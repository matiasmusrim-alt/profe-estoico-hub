import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { MENTOR_SYSTEM_PROMPT } from "@/lib/mentor-system-prompt";

const messageSchema = z.object({ message: z.string().trim().min(3).max(4000) });

export const getEntitlement = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase, userId } = context;
    const [{ data: license }, { data: usage }] = await Promise.all([
      supabase.from("licenses").select("tier,status").eq("user_id", userId).single(),
      supabase.from("demo_usage").select("used_count,max_uses").eq("user_id", userId).single(),
    ]);
    const premium = license?.tier === "premium" && license.status === "active";
    return {
      tier: premium ? "premium" : "demo",
      used: usage?.used_count ?? 0,
      max: usage?.max_uses ?? 10,
      remaining: premium ? null : Math.max(0, (usage?.max_uses ?? 10) - (usage?.used_count ?? 0)),
    };
  });

export const sendMentorMessage = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator(messageSchema)
  .handler(async ({ data, context }) => {
    const { userId } = context;
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: quota, error: quotaError } = await supabaseAdmin.rpc("consume_mentor_use", {
      _user_id: userId,
    });
    if (quotaError) throw new Error("No fue posible validar tu cuota.");
    const gate = quota as { allowed?: boolean; reason?: string; remaining?: number | null };
    if (!gate.allowed)
      return {
        ok: false as const,
        code: gate.reason ?? "limit",
        remaining: 0,
        message: "Alcanzaste el límite de 10 usos de la demo.",
      };

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      await supabaseAdmin.rpc("refund_mentor_use", { _user_id: userId });
      throw new Error("El mentor aún no está configurado.");
    }

    try {
      const { data: previousMessages } = await supabaseAdmin
        .from("mentor_messages")
        .select("role,content")
        .eq("user_id", userId)
        .order("created_at", { ascending: false })
        .limit(12);

      const conversation = (previousMessages ?? [])
        .reverse()
        .map((item) => ({
          role: item.role === "assistant" ? ("assistant" as const) : ("user" as const),
          content: item.content,
        }));

      const response = await fetch("https://api.openai.com/v1/responses", {
        method: "POST",
        headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          model: process.env.OPENAI_MODEL ?? "gpt-5-mini",
          instructions: MENTOR_SYSTEM_PROMPT,
          input: [...conversation, { role: "user", content: data.message }],
          max_output_tokens: 900,
        }),
      });
      if (!response.ok) throw new Error(`OpenAI ${response.status}`);
      const result = (await response.json()) as {
        output_text?: string;
        output?: Array<{ content?: Array<{ text?: string }> }>;
      };
      const answer =
        result.output_text ??
        result.output
          ?.flatMap((item) => item.content ?? [])
          .map((item) => item.text ?? "")
          .join("")
          .trim();
      if (!answer) throw new Error("Respuesta vacía del mentor");
      await supabaseAdmin.from("mentor_messages").insert([
        { user_id: userId, role: "user", content: data.message },
        {
          user_id: userId,
          role: "assistant",
          content: answer,
          model: process.env.OPENAI_MODEL ?? "gpt-5-mini",
        },
      ]);
      return { ok: true as const, answer, remaining: gate.remaining ?? null };
    } catch (error) {
      await supabaseAdmin.rpc("refund_mentor_use", { _user_id: userId });
      console.error("[mentor]", error);
      throw new Error("El mentor no pudo responder. Tu uso no fue descontado.");
    }
  });
