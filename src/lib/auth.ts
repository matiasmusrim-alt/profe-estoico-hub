import { redirect } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";

export async function requireSession() {
  const { data, error } = await supabase.auth.getSession();
  if (error || !data.session) throw redirect({ to: "/auth" });
  return data.session;
}
