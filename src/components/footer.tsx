import { Link } from "@tanstack/react-router";
import { Logo } from "@/components/logo";

export function Footer() {
  return (
    <footer className="border-t border-white/[0.06] bg-background">
      <div className="mx-auto max-w-6xl px-6 py-16 grid gap-10 md:grid-cols-5">
        <div className="md:col-span-2">
          <Logo size={28} />
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