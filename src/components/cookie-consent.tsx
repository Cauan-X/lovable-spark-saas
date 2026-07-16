import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Cookie, X } from "lucide-react";
import { Button } from "@/components/ui/button";

const KEY = "spark:cookie-consent";

export function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(KEY);
      if (!stored) setVisible(true);
    } catch {
      /* no-op */
    }
  }, []);

  const decide = (choice: "accepted" | "rejected") => {
    try {
      localStorage.setItem(KEY, JSON.stringify({ choice, at: Date.now() }));
    } catch {
      /* no-op */
    }
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 px-4 pb-4 sm:pb-6">
      <div className="mx-auto flex max-w-3xl flex-col gap-3 rounded-xl border border-white/[0.08] bg-[#0f0f14]/95 p-4 shadow-2xl backdrop-blur-xl sm:flex-row sm:items-center sm:gap-4">
        <div className="flex items-start gap-3 flex-1">
          <div className="mt-0.5 flex h-8 w-8 flex-none items-center justify-center rounded-md bg-primary/15 text-primary">
            <Cookie className="h-4 w-4" />
          </div>
          <p className="text-[13px] text-muted-foreground">
            Usamos cookies para melhorar sua experiência e analisar o uso do site. Leia nossa{" "}
            <Link to="/cookies" className="text-primary hover:underline">
              política de cookies
            </Link>
            .
          </p>
        </div>
        <div className="flex items-center gap-2 sm:flex-none">
          <Button size="sm" variant="ghost" className="text-muted-foreground" onClick={() => decide("rejected")}>
            Rejeitar
          </Button>
          <Button
            size="sm"
            className="bg-white text-black hover:bg-white/90"
            onClick={() => decide("accepted")}
          >
            Aceitar
          </Button>
          <button
            aria-label="Fechar"
            onClick={() => decide("rejected")}
            className="hidden text-muted-foreground hover:text-foreground sm:block"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}