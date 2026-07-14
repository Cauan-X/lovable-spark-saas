import { Link } from "@tanstack/react-router";
import { Sparkles } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-border/60 bg-background">
      <div className="mx-auto max-w-6xl px-4 py-12 grid gap-8 md:grid-cols-4">
        <div>
          <div className="flex items-center gap-2 font-bold">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/15 text-primary">
              <Sparkles className="h-4 w-4" />
            </span>
            Lovable <span className="text-primary">Spark</span>
          </div>
          <p className="mt-3 text-sm text-muted-foreground">
            A extensão que turbina sua experiência no Lovable.dev.
          </p>
        </div>
        <FooterCol title="Produto" links={[
          { to: "/", label: "Recursos" },
          { to: "/docs", label: "Documentação" },
          { to: "/changelog", label: "Changelog" },
        ]} />
        <FooterCol title="Suporte" links={[
          { to: "/contact", label: "Contato" },
          { to: "/dashboard", label: "Dashboard" },
          { to: "/docs", label: "FAQ" },
        ]} />
        <FooterCol title="Legal" links={[
          { to: "/privacy", label: "Privacidade" },
          { to: "/terms", label: "Termos" },
          { to: "/refund", label: "Reembolso" },
          { to: "/cookies", label: "Cookies" },
        ]} />
      </div>
      <div className="border-t border-border/60 py-6 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} Lovable Spark. Todos os direitos reservados.
      </div>
    </footer>
  );
}

function FooterCol({ title, links }: { title: string; links: { to: string; label: string }[] }) {
  return (
    <div>
      <h4 className="font-semibold text-sm mb-3">{title}</h4>
      <ul className="space-y-2">
        {links.map((l) => (
          <li key={l.to + l.label}>
            <Link to={l.to} className="text-sm text-muted-foreground hover:text-foreground">
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}