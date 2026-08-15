import { Link, useNavigate } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
export function PrivateShell({ children }: { children: ReactNode }) {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-secondary/20">
      <header className="border-b bg-background">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <Link to="/portal" className="font-serif text-xl font-bold text-primary">
            Profe Estoico
          </Link>
          <nav className="flex items-center gap-3">
            <Link to="/portal" className="text-sm">
              Portal
            </Link>
            <Link to="/mentor" className="text-sm">
              Mentor
            </Link>
            <Button
              variant="outline"
              size="sm"
              onClick={async () => {
                await supabase.auth.signOut();
                navigate({ to: "/auth" });
              }}
            >
              Salir
            </Button>
          </nav>
        </div>
      </header>
      {children}
    </div>
  );
}
