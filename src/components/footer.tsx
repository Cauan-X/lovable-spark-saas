import { Link } from "@tanstack/react-router";

export function Footer() {
  return (
    <footer className="border-t border-white/[0.06] bg-background">
      <div className="mx-auto max-w-6xl px-6 py-16 grid gap-10 md:grid-cols-5">
        <div className="md:col-span-2">
          <div className="flex items-center gap-2.5 text-[15px] font-semibold tracking-tight">
            <span className="relative flex h-6 w-6 items-center justify-center rounded-md bg-gradient-brand">
              <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 text-white" fill="currentColor" aria-hidden>
                <path d="M12 2 L14.5 9.5 L22 12 L14.5 14.5 L12 22 L9.5 14.5 L2 12 L9.5 9.5 Z" />
              </svg>
            </span>
            Spark
          </div>
          <p className="mt-4 text-sm text-muted-foreground max-w-xs leading-relaxed">
            A camada de produtividade para quem constrói no Lovable.dev.
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
      <div className="border-t border-white/[0.06]">
        <div className="mx-auto max-w-6xl px-6 py-6 flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-muted-foreground">
          <span>© {new Date().getFullYear()} Spark. Todos os direitos reservados.</span>
          <span className="font-mono text-[11px] tracking-wider uppercase">Feito no Brasil</span>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, links }: { title: string; links: { to: string; label: string }[] }) {
  return (
    <div>
      <h4 className="font-medium text-xs uppercase tracking-wider text-muted-foreground mb-4">{title}</h4>
      <ul className="space-y-3">
        {links.map((l) => (
          <li key={l.to + l.label}>
            <Link to={l.to} className="text-sm text-foreground/80 hover:text-foreground transition-colors">
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}