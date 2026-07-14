import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search } from "lucide-react";

export const Route = createFileRoute("/docs")({
  head: () => ({ meta: [{ title: "Documentação — Lovable Spark" }, { name: "description", content: "Guias completos para todas as ferramentas do Lovable Spark." }] }),
  component: Docs,
});

const SECTIONS = [
  { id: "instalacao", title: "Instalação", body: "Baixe o arquivo .crx no seu Dashboard. No Chrome, abra chrome://extensions, ative o modo desenvolvedor e arraste o arquivo para a janela. Faça login com sua chave de licença ao abrir a extensão pela primeira vez." },
  { id: "prompt-injector", title: "Prompt Injector", body: "Salve prompts recorrentes e injete-os no editor do Lovable com Ctrl+Shift+I. Suporta variáveis dinâmicas como {{projeto}} e {{data}}. Ideal para padronizar instruções de refatoração e testes." },
  { id: "prompt-optimizer", title: "Prompt Optimizer", body: "Analisa seu prompt em tempo real e sugere melhorias em clareza, contexto e escopo. Utiliza modelo GPT-4o fine-tuned em prompts Lovable de alta performance. Ative com o botão ✨ ao lado do editor." },
  { id: "shield-mode", title: "Shield Mode", body: "Adiciona uma camada de confirmação antes de enviar mensagens críticas. Bloqueia envios acidentais durante edições longas e evita queima de créditos. Configurável por regex ou contagem de tokens." },
  { id: "code-downloader", title: "Code Downloader", body: "Baixa todo o código do projeto atual em .zip com um clique. Preserva a estrutura de pastas e exclui node_modules automaticamente. Funciona mesmo em projetos privados." },
  { id: "watermark-remover", title: "Watermark Remover", body: "Remove marcas d'água do preview para gravações e apresentações limpas. Apenas efeito visual local — respeita as políticas do Lovable." },
  { id: "faq", title: "FAQ Técnica", body: "Perguntas comuns sobre compatibilidade, atualizações automáticas, conflitos com outras extensões e resolução de problemas de licença." },
];

function Docs() {
  const [q, setQ] = useState("");
  const filtered = SECTIONS.filter((s) => s.title.toLowerCase().includes(q.toLowerCase()) || s.body.toLowerCase().includes(q.toLowerCase()));

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold">Documentação</h1>
          <p className="text-muted-foreground mt-1">Aprenda a extrair o máximo do Lovable Spark.</p>
        </div>
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Buscar na documentação..." value={q} onChange={(e) => setQ(e.target.value)} className="pl-9" />
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-[220px_1fr]">
        <aside className="lg:sticky lg:top-20 h-fit">
          <nav className="space-y-1">
            {SECTIONS.map((s) => (
              <a key={s.id} href={`#${s.id}`} className="block px-3 py-2 rounded-md text-sm text-muted-foreground hover:text-foreground hover:bg-accent">
                {s.title}
              </a>
            ))}
          </nav>
        </aside>

        <div className="space-y-8">
          {filtered.map((s) => (
            <section key={s.id} id={s.id}>
              <div className="flex items-center gap-2 mb-3">
                <h2 className="text-2xl font-bold">{s.title}</h2>
                <Badge variant="secondary">Guia</Badge>
              </div>
              <p className="text-muted-foreground leading-relaxed">{s.body}</p>
              <Card className="mt-4 aspect-video flex items-center justify-center bg-muted/40 text-muted-foreground text-sm">
                [ Imagem / GIF ilustrativo — {s.title} ]
              </Card>
            </section>
          ))}
          {filtered.length === 0 && <p className="text-muted-foreground">Nada encontrado para "{q}".</p>}
        </div>
      </div>
    </div>
  );
}