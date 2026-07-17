import { createFileRoute, Link } from "@tanstack/react-router";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Download, Puzzle, MonitorSmartphone, CheckCircle2, Sparkles, ChevronRight } from "lucide-react";

export const Route = createFileRoute("/dashboard/downloads")({
  head: () => ({
    meta: [
      { title: "Downloads — Lovable Spark" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: DownloadsPage,
});

const VERSION = "3.1.0";
const CRX_URL = `/downloads/spark-v${VERSION}.crx`;

const CHANGELOG = [
  { kind: "feature", text: "Watermark Remover reescrito, 3x mais rápido." },
  { kind: "feature", text: "Prompt Optimizer com suporte a modelos personalizados." },
  { kind: "melhoria", text: "Redução de 40% no consumo de memória." },
];

const STEPS = [
  { icon: Download, title: "Baixar a extensão", desc: "Clique no botão abaixo para baixar o arquivo .crx." },
  { icon: Puzzle, title: "Abrir chrome://extensions", desc: "Cole o endereço na barra do Chrome e pressione Enter." },
  { icon: MonitorSmartphone, title: "Ativar modo desenvolvedor", desc: 'Ative o toggle "Modo do desenvolvedor" no canto superior direito.' },
  { icon: Puzzle, title: "Arrastar o .crx", desc: 'Arraste o arquivo baixado para a janela de extensões e confirme "Adicionar extensão".' },
];

function DownloadsPage() {
  return (
    <div className="space-y-8 max-w-4xl">
      <div>
        <h1 className="text-3xl font-display font-semibold tracking-tight">Downloads</h1>
        <p className="mt-1 text-sm text-muted-foreground">Baixe a última versão da extensão e siga o passo a passo de instalação.</p>
      </div>

      <Card className="glass-card p-6">
        <div className="flex items-center gap-2 text-[11px] uppercase tracking-wider text-muted-foreground mb-3">
          <Sparkles className="h-3.5 w-3.5" /> Versão atual
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          <h2 className="text-2xl font-semibold">v{VERSION}</h2>
          <Badge className="bg-primary/15 text-primary border-0">Estável</Badge>
        </div>

        <a
          href={CRX_URL}
          download
          className="mt-5 inline-flex items-center justify-center gap-2 rounded-lg bg-gradient-brand bg-gradient-brand-hover text-white px-6 py-3 text-sm font-medium transition-all hover:shadow-lg"
        >
          <Download className="h-4 w-4" />
          Baixar spark-v{VERSION}.crx
        </a>

        <div className="mt-6 border-t border-white/[0.06] pt-5">
          <h3 className="text-sm font-medium mb-3">O que há de novo</h3>
          <ul className="space-y-2">
            {CHANGELOG.map((c, i) => (
              <li key={i} className="flex items-start gap-3 text-sm">
                <Badge variant={c.kind === "feature" ? "default" : "secondary"}>{c.kind}</Badge>
                <span className="text-muted-foreground">{c.text}</span>
              </li>
            ))}
          </ul>
          <Link to="/changelog" className="mt-4 inline-flex items-center gap-1 text-xs text-primary hover:underline">
            Ver changelog completo <ChevronRight className="h-3 w-3" />
          </Link>
        </div>
      </Card>

      <div className="space-y-3">
        <h2 className="text-xl font-display font-semibold tracking-tight">Como instalar</h2>
        <p className="text-sm text-muted-foreground">O Chrome exige o modo desenvolvedor para instalar extensões fora da Web Store.</p>
      </div>

      <div className="space-y-3">
        {STEPS.map((s, i) => (
          <Card key={s.title} className="glass-card p-5 flex items-start gap-4">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/15 text-primary text-sm font-bold">
              {i + 1}
            </div>
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/[0.04]">
              <s.icon className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="font-medium text-sm">{s.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{s.desc}</p>
            </div>
          </Card>
        ))}
      </div>

      <Card className="glass-card p-6 border-amber-500/30 bg-amber-500/[0.03]">
        <h3 className="font-medium text-sm flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4" /> Dica
        </h3>
        <p className="mt-2 text-sm text-muted-foreground">
          Após instalar, clique no ícone do Spark na barra de ferramentas do Chrome e cole sua chave de licença para ativar todos os recursos.
        </p>
      </Card>

      <div className="flex justify-center gap-3 pb-8">
        <Link to="/dashboard"><Button variant="outline">Voltar ao painel</Button></Link>
        <Link to="/docs"><Button variant="ghost">Documentação</Button></Link>
      </div>
    </div>
  );
}