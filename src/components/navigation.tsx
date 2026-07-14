import { Link } from "@tanstack/react-router";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { NAV_LINKS } from "@/lib/site-data";

export function Navigation() {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/[0.06] bg-background/70 backdrop-blur-xl">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-6">
        <Link to="/" className="flex items-center gap-2.5 text-[15px] font-semibold tracking-tight">
          <span className="relative flex h-6 w-6 items-center justify-center rounded-md bg-gradient-brand">
            <span className="absolute inset-0 rounded-md bg-gradient-brand opacity-60 blur-md" />
            <svg viewBox="0 0 24 24" className="relative h-3.5 w-3.5 text-white" fill="currentColor" aria-hidden>
              <path d="M12 2 L14.5 9.5 L22 12 L14.5 14.5 L12 22 L9.5 14.5 L2 12 L9.5 9.5 Z" />
            </svg>
          </span>
          <span>Spark</span>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {NAV_LINKS.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className="px-3 py-1.5 rounded-md text-[13px] text-muted-foreground hover:text-foreground transition-colors"
              activeProps={{ className: "px-3 py-1.5 rounded-md text-[13px] text-foreground" }}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-2">
          <Link to="/auth" className="text-[13px] text-muted-foreground hover:text-foreground transition-colors px-3 py-1.5">
            Entrar
          </Link>
          <Link to="/" hash="pricing">
            <Button size="sm" className="h-8 rounded-md bg-white text-black hover:bg-white/90 text-[13px] font-medium px-3.5">
              Ver planos
            </Button>
          </Link>
        </div>

        <button className="md:hidden p-2" onClick={() => setOpen(!open)} aria-label="Menu">
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <div className="md:hidden border-t border-white/[0.06] px-6 py-4 space-y-1 bg-background">
          {NAV_LINKS.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              onClick={() => setOpen(false)}
              className="block px-3 py-2 rounded-md text-sm text-muted-foreground hover:text-foreground hover:bg-white/[0.04]"
            >
              {l.label}
            </Link>
          ))}
          <Link to="/auth" onClick={() => setOpen(false)}>
            <Button size="sm" variant="outline" className="w-full mt-2">Entrar</Button>
          </Link>
          <Link to="/" hash="pricing" onClick={() => setOpen(false)}>
            <Button size="sm" className="w-full mt-2 bg-white text-black hover:bg-white/90">Ver planos</Button>
          </Link>
        </div>
      )}
    </header>
  );
}