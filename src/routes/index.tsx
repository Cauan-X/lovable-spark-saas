import { createFileRoute, Link } from "@tanstack/react-router";
import { Sparkles, Zap, Shield, Download, Wand2, EyeOff, Check, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PLANS } from "@/lib/site-data";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Lovable Spark — Extensão Chrome para Lovable.dev" },
      { name: "description", content: "Prompt Injector, Optimizer, Shield Mode, Code Downloader e Watermark Remover em uma única extensão." },
    ],
  }),
  component: Index,
});

const FEATURES = [
  { icon: Zap, title: "Prompt Injector", desc: "Injete prompts salvos com um clique dentro do Lovable." },
  { icon: Wand2, title: "Prompt Optimizer", desc: "Melhore seus prompts automaticamente com IA especializada." },
  { icon: Shield, title: "Shield Mode", desc: "Bloqueia envios acidentais e protege créditos preciosos." },
  { icon: Download, title: "Code Downloader", desc: "Baixe o código do seu projeto direto do navegador, em .zip." },
  { icon: EyeOff, title: "Watermark Remover", desc: "Remove marcas d'água em previews para apresentações limpas." },
  { icon: Sparkles, title: "Atualizações contínuas", desc: "Novas features chegam a cada mês sem custo adicional." },
];

function Index() {
  return (
    <div>
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-primary/20 via-background to-background" />
        <div className="mx-auto max-w-5xl px-4 py-24 text-center">
          <Badge variant="secondary" className="mb-6">
            <Sparkles className="h-3 w-3 mr-1" /> v3.1.0 disponível
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
            Turbine o <span className="text-primary">Lovable.dev</span><br />
            com um único clique.
          </h1>
          <p className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto">
            A extensão Chrome preferida por desenvolvedores brasileiros. Injete prompts, otimize com IA, proteja créditos e baixe seu código sem sair da aba.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <a
              href={PLANS.find((p) => p.id === "quarterly")!.checkoutUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button size="lg">Começar agora <ArrowRight className="ml-2 h-4 w-4" /></Button>
            </a>
            <Link to="/docs">
              <Button size="lg" variant="outline">Ver documentação</Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold">Tudo que você precisa</h2>
          <p className="mt-3 text-muted-foreground">Seis ferramentas essenciais para dominar o Lovable.</p>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f) => (
            <Card key={f.title} className="p-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/15 text-primary mb-4">
                <f.icon className="h-5 w-5" />
              </div>
              <h3 className="font-semibold text-lg">{f.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{f.desc}</p>
            </Card>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold">Planos simples</h2>
          <p className="mt-3 text-muted-foreground">Escolha o que faz sentido pra você.</p>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {PLANS.map((p) => (
            <Card key={p.id} className={`p-6 relative ${p.highlight ? "border-primary shadow-lg" : ""}`}>
              {p.highlight && (
                <Badge className="absolute -top-3 left-1/2 -translate-x-1/2">Mais popular</Badge>
              )}
              <h3 className="font-semibold text-lg">{p.name}</h3>
              <div className="mt-4 flex items-baseline gap-1">
                <span className="text-4xl font-bold">{p.price}</span>
                <span className="text-sm text-muted-foreground">{p.period}</span>
              </div>
              <ul className="mt-6 space-y-2">
                {p.features.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm">
                    <Check className="h-4 w-4 text-primary" /> {f}
                  </li>
                ))}
              </ul>
              <a
                href={p.checkoutUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="block mt-6"
              >
                <Button className="w-full" variant={p.highlight ? "default" : "outline"}>
                  Assinar {p.name}
                </Button>
              </a>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}