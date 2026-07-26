import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Copy, Download, Key, CheckCircle2, ExternalLink, MonitorSmartphone, ShieldCheck, Puzzle, ChevronRight, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useUser } from "@/hooks/use-user";

export const Route = createFileRoute("/dashboard/download")({
  head: () => ({
    meta: [
      { title: "Download e Instalação — Lovable Spark" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: DownloadPage,
});

type License = {
  key: string;
  status: string;
  expires_at: string | null;
};

type ExtensionVersion = {
  version: string;
  crx_path: string;
  changelog: string | null;
  published_at: string;
};

const STEPS = [
  {
    icon: Download,
    title: "Baixar a extensão",
    desc: 'Clique no botão "Baixar .crx" abaixo para obter a versão mais recente da extensão.',
  },
  {
    icon: Puzzle,
    title: "Abrir extensões do Chrome",
    desc: 'No Chrome, digite chrome://extensions na barra de endereços e pressione Enter.',
  },
  {
    icon: MonitorSmartphone,
    title: "Ativar modo desenvolvedor",
    desc: 'Ative o toggle "Modo do desenvolvedor" no canto superior direito da página.',
  },
  {
    icon: Puzzle,
    title: "Instalar extensão",
    desc: "Arraste o arquivo .crx baixado para a janela do chrome://extensions e clique em \"Adicionar extensão\".",
  },
  {
    icon: Key,
    title: "Inserir chave de licença",
    desc: "Clique no ícone do Spark na barra de ferramentas do Chrome e cole sua chave de licença no campo indicado.",
  },
  {
    icon: ShieldCheck,
    title: "Validar e usar",
    desc: 'Clique em "Validar" e pronto! A extensão estará ativa com todos os recursos liberados.',
  },
];

function DownloadPage() {
  const { user } = useUser();
  const [license, setLicense] = useState<License | null>(null);
  const [latestVersion, setLatestVersion] = useState<ExtensionVersion | null>(null);
  const [versions, setVersions] = useState<ExtensionVersion[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    let alive = true;
    (async () => {
      const [{ data: lics }, { data: ver }] = await Promise.all([
        supabase
          .from("licenses")
          .select("key, status, expires_at")
          .eq("user_id", user.id)
          .in("status", ["active", "past_due"])
          .limit(1),
        supabase
          .from("extension_versions")
          .select("version, crx_path, changelog, published_at")
          .order("published_at", { ascending: false }),
      ]);
      if (!alive) return;
      setLicense((lics?.[0] as License | undefined) ?? null);
      setVersions((ver as ExtensionVersion[]) ?? []);
      setLatestVersion((ver?.[0] as ExtensionVersion | undefined) ?? null);
      setLoading(false);
    })();
    return () => { alive = false; };
  }, [user]);

  const copy = async () => {
    const fullKey = license?.key ?? "";
    await navigator.clipboard.writeText(fullKey);
    toast.success("Chave copiada!");
  };

  const version = latestVersion?.version ?? "3.1.0";
  // Serve o .crx direto do que estiver salvo em extension_versions.crx_path
  // (URL absoluta ou caminho servido pelo próprio app em /downloads/...).
  const crxUrl = latestVersion?.crx_path || `/downloads/spark-v${version}.crx`;

  if (!user) return null;

  return (
    <div className="space-y-10 max-w-4xl">
      <div>
        <h1 className="text-3xl font-display font-semibold tracking-tight">Download e Instalação</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Siga o passo a passo para instalar e ativar o Lovable Spark no seu navegador.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-5">
        <Card className="glass-card lg:col-span-3 p-6">
          <div className="flex items-center gap-2 text-[11px] uppercase tracking-wider text-muted-foreground mb-4">
            <Download className="h-3.5 w-3.5" /> Extensão v{version}
          </div>

          <div className="flex items-center gap-2 mb-4">
            <Badge className="bg-primary/15 text-primary border-0">
              <CheckCircle2 className="h-3 w-3 mr-1" /> {license ? "Licença ativa" : "Sem licença"}
            </Badge>
            {license?.expires_at && (
              <span className="text-xs text-muted-foreground">
                Expira em {new Date(license.expires_at).toLocaleDateString("pt-BR")}
              </span>
            )}
          </div>

          <a
            href={crxUrl}
            download
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-gradient-brand bg-gradient-brand-hover text-white px-6 py-3 text-sm font-medium transition-all hover:shadow-lg w-full sm:w-auto"
          >
            <Download className="h-4 w-4" />
            Baixar .crx (v{version})
          </a>

          {loading ? null : license ? (
            <div className="mt-6 rounded-lg border border-white/[0.06] bg-white/[0.02] p-4">
              <div className="flex items-center gap-2 text-[11px] uppercase tracking-wider text-muted-foreground mb-2">
                <Key className="h-3.5 w-3.5" /> Sua chave de licença
              </div>
              <div className="flex items-center gap-2">
                <code className="flex-1 truncate rounded-md bg-black/40 px-3 py-2 font-mono text-sm tracking-wider">
                  {license.key}
                </code>
                <Button size="sm" variant="outline" onClick={copy}>
                  <Copy className="mr-1.5 h-3.5 w-3.5" /> Copiar
                </Button>
              </div>
            </div>
          ) : (
            <p className="mt-4 text-sm text-muted-foreground">
              Nenhuma licença ativa encontrada.{" "}
              <Link to="/" hash="pricing" className="text-primary hover:underline">Ver planos</Link>
            </p>
          )}
        </Card>

        <Card className="glass-card lg:col-span-2 p-6">
          <div className="flex items-center gap-2 text-[11px] uppercase tracking-wider text-muted-foreground mb-3">
            <MonitorSmartphone className="h-3.5 w-3.5" /> Requisitos
          </div>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 shrink-0" />
              Google Chrome v{version.split(".")[0]} ou superior
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 shrink-0" />
              Microsoft Edge (Chromium) também compatível
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 shrink-0" />
              Brave, Opera e qualquer navegador Chromium
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 shrink-0" />
              Acesso ao lovable.dev
            </li>
          </ul>
        </Card>
      </div>

      {/* Changelog */}
      {latestVersion && (
        <Card className="glass-card p-6">
          <div className="flex items-center gap-2 text-[11px] uppercase tracking-wider text-muted-foreground mb-3">
            <Sparkles className="h-3.5 w-3.5" /> O que há de novo — v{latestVersion.version}
          </div>
          <div className="whitespace-pre-line text-sm text-muted-foreground">
            {latestVersion.changelog || "Nenhuma informação de changelog disponível."}
          </div>
          {versions.length > 1 && (
            <Link to="/changelog" className="mt-4 inline-flex items-center gap-1 text-xs text-primary hover:underline">
              Ver versões anteriores <ChevronRight className="h-3 w-3" />
            </Link>
          )}
        </Card>
      )}

      {/* Step-by-step guide */}
      <div className="space-y-3">
        <h2 className="text-xl font-display font-semibold tracking-tight">Passo a passo</h2>
        <p className="text-sm text-muted-foreground">
          Siga as instruções abaixo para instalar e ativar sua extensão.
        </p>
      </div>

      <div className="space-y-4">
        {STEPS.map((step, i) => (
          <motion.div
            key={step.title}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.08 }}
          >
            <Card className="glass-card p-5 flex items-start gap-4">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/15 text-primary text-sm font-bold">
                {i + 1}
              </div>
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/[0.04]">
                <step.icon className="h-4 w-4 text-muted-foreground" />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="font-medium text-sm">{step.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{step.desc}</p>
              </div>
              <ChevronRight className="h-5 w-5 text-muted-foreground/40 hidden sm:block mt-1" />
            </Card>
          </motion.div>
        ))}
      </div>

      <Card className="glass-card p-6 border-amber-500/30 bg-amber-500/[0.03]">
        <h3 className="font-medium text-sm flex items-center gap-2">
          <ExternalLink className="h-4 w-4" /> Troubleshooting
        </h3>
        <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
          <li>
            <strong>.crx não instala?</strong> Verifique se o modo desenvolvedor está ativo em chrome://extensions.
          </li>
          <li>
            <strong>Extensão não aparece?</strong> Após arrastar o .crx, clique em "Adicionar extensão" no popup de confirmação.
          </li>
          <li>
            <strong>Chave inválida?</strong> Certifique-se de copiar a chave completa, incluindo o prefixo SPARK-.
          </li>
          <li>
            <strong>Problemas persistentes?</strong>{" "}
            <Link to="/contact" className="text-primary hover:underline">Entre em contato</Link> com o suporte.
          </li>
        </ul>
      </Card>

      <div className="flex justify-center gap-3 pb-8">
        <Link to="/dashboard">
          <Button variant="outline">Voltar ao painel</Button>
        </Link>
        <Link to="/docs">
          <Button variant="ghost">Documentação completa</Button>
        </Link>
      </div>
    </div>
  );
}
