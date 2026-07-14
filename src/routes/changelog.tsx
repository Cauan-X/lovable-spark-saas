import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";

export const Route = createFileRoute("/changelog")({
  head: () => ({ meta: [{ title: "Changelog — Lovable Spark" }, { name: "description", content: "Histórico completo de versões e melhorias do Lovable Spark." }] }),
  component: Changelog,
});

type Kind = "feature" | "bug" | "melhoria";
const KIND_LABEL: Record<Kind, string> = { feature: "Nova feature", bug: "Bug fix", melhoria: "Melhoria" };

const RELEASES: { v: string; date: string; highlight?: boolean; items: { kind: Kind; text: string }[] }[] = [
  { v: "3.1.0", date: "10 Jul 2026", highlight: true, items: [
    { kind: "feature", text: "Watermark Remover totalmente reescrito, agora 3x mais rápido." },
    { kind: "feature", text: "Prompt Optimizer com suporte a modelos personalizados." },
    { kind: "melhoria", text: "Redução de 40% no consumo de memória." },
  ]},
  { v: "3.0.2", date: "22 Jun 2026", items: [
    { kind: "bug", text: "Corrigido bug de autenticação após atualização do Chrome 128." },
    { kind: "melhoria", text: "Melhor exibição de erros no Shield Mode." },
  ]},
  { v: "3.0.0", date: "01 Jun 2026", items: [
    { kind: "feature", text: "Nova interface baseada em Tailwind v4." },
    { kind: "feature", text: "Introdução do Code Downloader." },
  ]},
  { v: "2.9.1", date: "12 Mai 2026", items: [
    { kind: "bug", text: "Corrigido crash raro ao injetar prompts longos." },
  ]},
];

function Changelog() {
  const [filter, setFilter] = useState<Kind | "all">("all");

  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Changelog</h1>
        <p className="text-muted-foreground mt-1">Todas as atualizações que enviamos ao Spark.</p>
      </div>

      <div className="flex gap-2 mb-8 flex-wrap">
        {(["all", "feature", "bug", "melhoria"] as const).map((k) => (
          <Button key={k} size="sm" variant={filter === k ? "default" : "outline"} onClick={() => setFilter(k)}>
            {k === "all" ? "Todos" : KIND_LABEL[k]}
          </Button>
        ))}
      </div>

      <div className="space-y-6">
        {RELEASES.map((r) => {
          const items = filter === "all" ? r.items : r.items.filter((i) => i.kind === filter);
          if (items.length === 0) return null;
          return (
            <Card key={r.v} className={`p-6 ${r.highlight ? "border-primary" : ""}`}>
              <div className="flex items-center gap-3 flex-wrap">
                <h2 className="text-xl font-bold">v{r.v}</h2>
                <span className="text-sm text-muted-foreground">{r.date}</span>
                {r.highlight && <Badge><Sparkles className="h-3 w-3 mr-1" /> Última versão</Badge>}
              </div>
              <ul className="mt-4 space-y-2">
                {items.map((i, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-sm">
                    <Badge variant={i.kind === "feature" ? "default" : i.kind === "bug" ? "destructive" : "secondary"}>{KIND_LABEL[i.kind]}</Badge>
                    <span>{i.text}</span>
                  </li>
                ))}
              </ul>
            </Card>
          );
        })}
      </div>
    </div>
  );
}