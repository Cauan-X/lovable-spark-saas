import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  ArrowUpRight,
  Check,
  Command,
  Zap,
  Shield,
  Download,
  Wand2,
  EyeOff,
  Sparkles,
  Play,
  Terminal,
  Braces,
  ShieldCheck,
  Rocket,
  Puzzle,
  Cpu,
  Star,
  Quote,
  Layers,
  Gauge,
} from "lucide-react";
import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { PLANS } from "@/lib/site-data";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Spark — A camada de produtividade do Lovable.dev" },
      {
        name: "description",
        content:
          "Extensão Chrome premium para Lovable.dev: otimize prompts com IA, proteja créditos, exporte código e envie 3× mais rápido.",
      },
    ],
  }),
  component: Index,
});

const fadeUp = {
  initial: { opacity: 0, y: 16, filter: "blur(6px)" },
  whileInView: { opacity: 1, y: 0, filter: "blur(0px)" },
  viewport: { once: true, margin: "-80px" },
  transition: { duration: 0.7, ease: [0.2, 0.7, 0.2, 1] as const },
};

function Index() {
  return (
    <div className="relative">
      <Hero />
      <ValueProps />
      <LogoStrip />
      <MockupsSection />
      <Benefits />
      <HowItWorks />
      <FeaturesBento />
      <ProductShowcase />
      <DashboardDemo />
      <Pricing />
      <Testimonials />
      <Guarantee />
      <FAQ />
      <CTA />
    </div>
  );
}

/* ---------------- HERO ---------------- */

function Hero() {
  const primary = PLANS.find((p) => p.id === "quarterly")!;
  return (
    <section className="relative overflow-hidden pt-20 pb-24 md:pt-28 md:pb-32">
      {/* grid + ambient light */}
      <div className="pointer-events-none absolute inset-0 -z-10 grid-bg" />
      <div className="pointer-events-none absolute inset-x-0 -top-40 -z-10 flex justify-center">
        <div className="h-[500px] w-[900px] rounded-full bg-[radial-gradient(closest-side,rgba(139,92,246,0.28),transparent_70%)] blur-3xl" />
      </div>
      <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

      <div className="mx-auto max-w-5xl px-6 text-center">
        <motion.a
          href="/changelog"
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="group inline-flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.03] px-3 py-1 text-xs text-muted-foreground backdrop-blur hover:bg-white/[0.06] transition-colors"
        >
          <span className="flex h-1.5 w-1.5 rounded-full bg-primary shadow-[0_0_10px_2px_rgba(139,92,246,0.6)]" />
          <span>Spark v3.1 — Prompt Optimizer com Claude Sonnet</span>
          <ArrowUpRight className="h-3 w-3 opacity-60 group-hover:opacity-100 transition-opacity" />
        </motion.a>

        <motion.h1
          initial={{ opacity: 0, y: 20, filter: "blur(8px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 0.9, ease: [0.2, 0.7, 0.2, 1] as const, delay: 0.05 }}
          className="mt-8 font-display text-[44px] sm:text-[64px] md:text-[88px] leading-[0.95] tracking-[-0.045em] font-semibold"
        >
          <span className="text-gradient-fade">A camada</span>
          <br />
          <span className="text-foreground">de produtividade</span>
          <br />
          <span className="text-gradient-fade">do </span>
          <span className="text-gradient-brand">Lovable.dev</span>
          <span className="text-foreground">.</span>
        </motion.h1>

        <motion.p
          {...fadeUp}
          transition={{ ...fadeUp.transition, delay: 0.15 }}
          className="mx-auto mt-8 max-w-xl text-[15px] md:text-base leading-relaxed text-muted-foreground"
        >
          Spark é a extensão que times sérios usam para injetar prompts, otimizar
          com IA, proteger créditos e exportar código — sem sair do navegador.
        </motion.p>

        <motion.div
          {...fadeUp}
          transition={{ ...fadeUp.transition, delay: 0.25 }}
          className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-3"
        >
          <a href={primary.checkoutUrl} target="_blank" rel="noopener noreferrer">
            <Button
              size="lg"
              className="h-11 rounded-md bg-white text-black hover:bg-white/90 text-[14px] font-medium px-5 shadow-[0_0_40px_-8px_rgba(255,255,255,0.35)]"
            >
              Instalar Spark <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </a>
          <Link
            to="/docs"
            className="group inline-flex items-center gap-2 text-[14px] text-muted-foreground hover:text-foreground transition-colors px-3 py-2"
          >
            Ver documentação
            <span className="opacity-60 group-hover:opacity-100 transition-opacity">→</span>
          </Link>
        </motion.div>

        <motion.p
          {...fadeUp}
          transition={{ ...fadeUp.transition, delay: 0.35 }}
          className="mt-6 text-xs text-muted-foreground/80"
        >
          A partir de R$ 29/mês · Cancele quando quiser · Suporte em PT-BR
        </motion.p>
      </div>

      {/* HERO MOCKUP */}
      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 1, ease: [0.2, 0.7, 0.2, 1] as const, delay: 0.4 }}
        className="relative mx-auto mt-20 max-w-5xl px-6"
      >
        <div className="pointer-events-none absolute -inset-x-10 -inset-y-6 -z-10 rounded-[40px] bg-[radial-gradient(closest-side,rgba(139,92,246,0.25),transparent_70%)] blur-2xl" />
        <HeroDashboard />
      </motion.div>
    </section>
  );
}

function HeroDashboard() {
  return (
    <div className="glass-card rounded-2xl overflow-hidden shadow-[0_40px_80px_-30px_rgba(0,0,0,0.8)]">
      {/* window chrome */}
      <div className="flex items-center gap-2 border-b border-white/[0.06] bg-white/[0.02] px-4 py-3">
        <div className="flex gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-white/10" />
          <span className="h-2.5 w-2.5 rounded-full bg-white/10" />
          <span className="h-2.5 w-2.5 rounded-full bg-white/10" />
        </div>
        <div className="ml-4 flex-1 flex items-center justify-center">
          <div className="flex items-center gap-2 rounded-md border border-white/[0.06] bg-black/40 px-3 py-1 text-[11px] text-muted-foreground font-mono">
            <span className="opacity-60">lovable.dev</span>
            <span>/</span>
            <span className="text-foreground">projects/spark-ai</span>
          </div>
        </div>
        <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground font-mono">
          <Command className="h-3 w-3" />K
        </div>
      </div>

      {/* content */}
      <div className="grid grid-cols-12 min-h-[420px]">
        {/* sidebar */}
        <div className="col-span-3 border-r border-white/[0.06] bg-black/20 p-3 space-y-1 text-[12px]">
          <div className="px-2 py-1 text-[10px] uppercase tracking-widest text-muted-foreground/70">Spark</div>
          {[
            { label: "Prompts", active: true, icon: Wand2 },
            { label: "Injector", icon: Zap },
            { label: "Shield", icon: Shield },
            { label: "Export", icon: Download },
            { label: "Watermark", icon: EyeOff },
          ].map((it) => (
            <div
              key={it.label}
              className={`flex items-center gap-2 rounded-md px-2 py-1.5 ${
                it.active ? "bg-white/[0.06] text-foreground" : "text-muted-foreground"
              }`}
            >
              <it.icon className="h-3.5 w-3.5" />
              {it.label}
            </div>
          ))}
          <div className="mt-6 px-2 py-1 text-[10px] uppercase tracking-widest text-muted-foreground/70">Coleções</div>
          {["Landing pages", "SaaS boilerplate", "AI apps"].map((c) => (
            <div key={c} className="flex items-center gap-2 px-2 py-1.5 text-muted-foreground">
              <span className="h-1.5 w-1.5 rounded-full bg-primary/60" /> {c}
            </div>
          ))}
        </div>

        {/* main */}
        <div className="col-span-6 p-5 space-y-4">
          <div>
            <div className="text-[11px] uppercase tracking-widest text-muted-foreground/70">Prompt Optimizer</div>
            <div className="mt-2 text-[15px] font-medium">Refinando prompt para landing SaaS</div>
          </div>
          <div className="rounded-lg border border-white/[0.06] bg-black/40 p-4 font-mono text-[12px] leading-relaxed">
            <div className="text-muted-foreground">// input</div>
            <div className="text-foreground/90">
              crie uma landing page moderna com hero e pricing
            </div>
            <div className="mt-3 text-muted-foreground">// spark output</div>
            <div>
              <span className="text-[#a78bfa]">Design</span>
              <span className="text-foreground/90">
                {" "}
                a premium dark-mode landing for a SaaS extension. Hero with
                oversized display type, subtle grid, ambient glow…
              </span>
              <span className="ml-0.5 inline-block h-3 w-1.5 translate-y-0.5 animate-pulse bg-primary" />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="rounded-md border border-white/[0.06] bg-white/[0.03] px-2 py-1 text-[11px] text-muted-foreground">
              claude-sonnet-4
            </div>
            <div className="rounded-md border border-white/[0.06] bg-white/[0.03] px-2 py-1 text-[11px] text-muted-foreground">
              tokens · 1.284
            </div>
            <div className="ml-auto flex items-center gap-1 text-[11px] text-emerald-400/90">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.7)]" />
              otimizado
            </div>
          </div>
        </div>

        {/* right panel */}
        <div className="col-span-3 border-l border-white/[0.06] bg-black/20 p-4 space-y-3 text-[12px]">
          <div className="text-[10px] uppercase tracking-widest text-muted-foreground/70">Ações rápidas</div>
          {[
            { icon: Wand2, label: "Otimizar" },
            { icon: Shield, label: "Ativar Shield" },
            { icon: Download, label: "Baixar .zip" },
          ].map((a) => (
            <div
              key={a.label}
              className="flex items-center justify-between rounded-md border border-white/[0.06] bg-white/[0.02] px-3 py-2"
            >
              <div className="flex items-center gap-2 text-foreground/90">
                <a.icon className="h-3.5 w-3.5 text-primary" /> {a.label}
              </div>
              <ArrowRight className="h-3 w-3 text-muted-foreground" />
            </div>
          ))}
          <div className="mt-5 rounded-lg border border-white/[0.06] bg-gradient-to-br from-primary/15 to-transparent p-3">
            <div className="text-[10px] uppercase tracking-widest text-primary/90">Créditos</div>
            <div className="mt-1 font-display text-2xl">1.842</div>
            <div className="mt-2 h-1 rounded-full bg-white/[0.06] overflow-hidden">
              <div className="h-full w-2/3 rounded-full bg-gradient-brand" />
            </div>
            <div className="mt-2 text-[10px] text-muted-foreground">Shield ativo · 42 bloqueios</div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------------- LOGO STRIP ---------------- */

function LogoStrip() {
  const logos = ["Ycombinator", "Loft", "Nubank", "Rappi", "iFood", "Kavak"];
  return (
    <section className="border-y border-white/[0.06] bg-background/60">
      <div className="mx-auto max-w-6xl px-6 py-10">
        <p className="text-center text-[11px] uppercase tracking-[0.2em] text-muted-foreground/70">
          Confiado por times que enviam software de verdade
        </p>
        <div className="mt-6 grid grid-cols-3 md:grid-cols-6 gap-6 items-center">
          {logos.map((l) => (
            <div key={l} className="text-center font-display text-sm md:text-base text-muted-foreground/60 hover:text-foreground transition-colors">
              {l}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------- FEATURES BENTO ---------------- */

function FeaturesBento() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-28 md:py-36">
      <motion.div {...fadeUp} className="max-w-2xl">
        <div className="text-[11px] uppercase tracking-[0.2em] text-primary/90">Ferramentas</div>
        <h2 className="mt-4 font-display text-4xl md:text-5xl tracking-[-0.03em] font-semibold">
          Um kit completo para
          <br />
          <span className="text-gradient-fade">dominar o Lovable.</span>
        </h2>
        <p className="mt-4 text-muted-foreground max-w-lg">
          Cinco ferramentas ajustadas ao milímetro. Uma única extensão. Zero
          fricção no seu fluxo de trabalho.
        </p>
      </motion.div>

      <div className="mt-16 grid gap-4 md:grid-cols-6 md:grid-rows-[220px_220px_220px] auto-rows-[220px]">
        {/* Big card — Prompt Optimizer */}
        <BentoCard className="md:col-span-4 md:row-span-2" delay={0}>
          <div className="flex h-full flex-col">
            <FeatureHead icon={Wand2} label="Prompt Optimizer" />
            <h3 className="mt-4 font-display text-2xl md:text-3xl tracking-tight">
              Reescreve seus prompts <span className="text-gradient-fade">com IA especializada</span>
            </h3>
            <p className="mt-2 text-sm text-muted-foreground max-w-md">
              Refina intenção, adiciona contexto e força padrões de design system —
              antes de gastar um crédito sequer.
            </p>
            <div className="mt-6 flex-1 rounded-lg border border-white/[0.06] bg-black/40 p-4 font-mono text-[12px] overflow-hidden relative">
              <div className="text-muted-foreground">before →</div>
              <div className="text-foreground/70 line-through">crie um form de login bonito</div>
              <div className="mt-3 text-muted-foreground">after ↓</div>
              <div className="text-foreground">
                Design a <span className="text-[#a78bfa]">minimal</span> login form with
                email + magic link. Dark theme, subtle border, focus ring in primary.
                Handle loading, error, success states…
              </div>
              <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-[#0f0f14] to-transparent" />
            </div>
          </div>
        </BentoCard>

        {/* Injector */}
        <BentoCard className="md:col-span-2" delay={0.05}>
          <FeatureHead icon={Zap} label="Prompt Injector" />
          <h3 className="mt-4 font-display text-xl tracking-tight">Um atalho, mil prompts.</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Biblioteca de prompts salvos disparada por <kbd className="rounded border border-white/10 bg-white/5 px-1.5 py-0.5 text-[10px] font-mono">⌘K</kbd>.
          </p>
        </BentoCard>

        {/* Shield */}
        <BentoCard className="md:col-span-2" delay={0.1}>
          <FeatureHead icon={Shield} label="Shield Mode" />
          <h3 className="mt-4 font-display text-xl tracking-tight">Nunca perca créditos.</h3>
          <div className="mt-3 flex items-center gap-2 text-[11px] text-emerald-400/90">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.7)]" />
            42 bloqueios hoje
          </div>
        </BentoCard>

        {/* Downloader */}
        <BentoCard className="md:col-span-2" delay={0.15}>
          <FeatureHead icon={Download} label="Code Downloader" />
          <h3 className="mt-4 font-display text-xl tracking-tight">Seu código, seu backup.</h3>
          <p className="mt-2 text-sm text-muted-foreground">Exporte projetos inteiros em .zip.</p>
        </BentoCard>

        {/* Watermark */}
        <BentoCard className="md:col-span-2" delay={0.2}>
          <FeatureHead icon={EyeOff} label="Watermark Remover" />
          <h3 className="mt-4 font-display text-xl tracking-tight">Previews limpos.</h3>
          <p className="mt-2 text-sm text-muted-foreground">Perfeito para demos e apresentações.</p>
        </BentoCard>

        {/* Updates */}
        <BentoCard className="md:col-span-2" delay={0.25}>
          <FeatureHead icon={Sparkles} label="Updates" />
          <h3 className="mt-4 font-display text-xl tracking-tight">Novas features, todo mês.</h3>
          <p className="mt-2 text-sm text-muted-foreground">Sem custos adicionais. Nunca.</p>
        </BentoCard>
      </div>
    </section>
  );
}

function BentoCard({
  children,
  className = "",
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, filter: "blur(6px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.7, ease: [0.2, 0.7, 0.2, 1] as const, delay }}
      className={`glass-card hover-lift relative rounded-xl p-6 overflow-hidden ${className}`}
    >
      {children}
    </motion.div>
  );
}

function FeatureHead({ icon: Icon, label }: { icon: React.ElementType; label: string }) {
  return (
    <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
      <span className="flex h-6 w-6 items-center justify-center rounded-md border border-white/[0.08] bg-white/[0.03]">
        <Icon className="h-3.5 w-3.5 text-primary" />
      </span>
      {label}
    </div>
  );
}

/* ---------------- PRODUCT SHOWCASE (asymmetric) ---------------- */

function ProductShowcase() {
  return (
    <section className="relative py-28 md:py-40">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(139,92,246,0.12),transparent_70%)] blur-3xl" />
      </div>

      {/* row 1 — text left, mockup right */}
      <div className="mx-auto max-w-6xl px-6 grid gap-16 md:grid-cols-2 md:gap-24 items-center">
        <motion.div {...fadeUp}>
          <div className="text-[11px] uppercase tracking-[0.2em] text-primary/90">Prompt Studio</div>
          <h2 className="mt-4 font-display text-4xl md:text-[52px] leading-[1.05] tracking-[-0.035em] font-semibold">
            Trate prompts como <span className="text-gradient-fade">código de produção.</span>
          </h2>
          <p className="mt-5 text-muted-foreground max-w-md">
            Versionamento, coleções compartilhadas, atalhos globais e refinamento
            automático. Sua stack de prompts nunca mais será um documento perdido no Notion.
          </p>
          <ul className="mt-6 space-y-3 text-sm">
            {["Coleções ilimitadas", "Templates com variáveis", "Histórico versionado", "Sincroniza entre dispositivos"].map((f) => (
              <li key={f} className="flex items-center gap-3 text-foreground/90">
                <span className="flex h-5 w-5 items-center justify-center rounded-full border border-primary/30 bg-primary/10">
                  <Check className="h-3 w-3 text-primary" />
                </span>
                {f}
              </li>
            ))}
          </ul>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 30, filter: "blur(6px)" }}
          whileInView={{ opacity: 1, x: 0, filter: "blur(0px)" }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.9, ease: [0.2, 0.7, 0.2, 1] as const }}
          className="glass-card rounded-xl p-4 relative"
        >
          <div className="flex items-center justify-between text-[11px] text-muted-foreground border-b border-white/[0.06] pb-3">
            <div className="flex items-center gap-2">
              <Terminal className="h-3.5 w-3.5" />
              <span className="font-mono">prompt-studio.spark</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              synced
            </div>
          </div>
          <div className="mt-4 space-y-2 font-mono text-[12px]">
            {[
              { k: "hero.landing", t: "128 tokens", active: true },
              { k: "pricing.saas", t: "96 tokens" },
              { k: "auth.login", t: "64 tokens" },
              { k: "dashboard.analytics", t: "212 tokens" },
              { k: "onboarding.step1", t: "148 tokens" },
            ].map((r) => (
              <div
                key={r.k}
                className={`flex items-center justify-between rounded-md border px-3 py-2 ${
                  r.active
                    ? "border-primary/30 bg-primary/[0.06]"
                    : "border-white/[0.05] bg-white/[0.01]"
                }`}
              >
                <div className="flex items-center gap-2">
                  <Braces className="h-3.5 w-3.5 text-primary/70" />
                  <span className="text-foreground/90">{r.k}</span>
                </div>
                <span className="text-muted-foreground">{r.t}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* row 2 — mockup left, text right */}
      <div className="mx-auto max-w-6xl px-6 mt-32 grid gap-16 md:grid-cols-2 md:gap-24 items-center">
        <motion.div
          initial={{ opacity: 0, x: -30, filter: "blur(6px)" }}
          whileInView={{ opacity: 1, x: 0, filter: "blur(0px)" }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.9, ease: [0.2, 0.7, 0.2, 1] as const }}
          className="glass-card rounded-xl p-6 relative md:order-1 order-2"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Shield className="h-3.5 w-3.5 text-primary" />
              <span className="font-mono">shield.log</span>
            </div>
            <div className="flex items-center gap-1.5 text-[11px] text-emerald-400/90">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.7)]" />
              armed
            </div>
          </div>
          <div className="mt-4 space-y-1.5 font-mono text-[11px] text-muted-foreground">
            {[
              ["12:04", "blocked", "duplicate send · 3s window"],
              ["12:06", "blocked", "empty prompt"],
              ["12:09", "allowed", "prompt · 214 tokens"],
              ["12:11", "blocked", "credit threshold reached"],
              ["12:14", "allowed", "prompt · 96 tokens"],
              ["12:16", "blocked", "double-tap ⌘↩"],
            ].map(([t, s, m]) => (
              <div key={t + m} className="flex items-center gap-3">
                <span className="text-muted-foreground/70 w-10">{t}</span>
                <span
                  className={`w-14 rounded px-1.5 py-0.5 text-[10px] uppercase tracking-wider ${
                    s === "blocked"
                      ? "bg-primary/15 text-primary"
                      : "bg-emerald-400/10 text-emerald-400"
                  }`}
                >
                  {s}
                </span>
                <span className="text-foreground/80">{m}</span>
              </div>
            ))}
          </div>
          <div className="mt-5 flex items-center justify-between border-t border-white/[0.06] pt-4">
            <div>
              <div className="text-[10px] uppercase tracking-widest text-muted-foreground">Créditos salvos hoje</div>
              <div className="mt-1 font-display text-2xl">R$ 47,20</div>
            </div>
            <div className="text-xs text-muted-foreground text-right">
              +312 este mês
              <br />
              <span className="text-primary">≈ 4 planos mensais</span>
            </div>
          </div>
        </motion.div>

        <motion.div {...fadeUp} className="md:order-2 order-1">
          <div className="text-[11px] uppercase tracking-[0.2em] text-primary/90">Shield Mode</div>
          <h2 className="mt-4 font-display text-4xl md:text-[52px] leading-[1.05] tracking-[-0.035em] font-semibold">
            Cada crédito <span className="text-gradient-fade">tem um propósito.</span>
          </h2>
          <p className="mt-5 text-muted-foreground max-w-md">
            Spark analisa cada envio antes de sair da sua máquina. Cliques duplos,
            prompts vazios e loops acidentais são bloqueados em silêncio.
          </p>
          <div className="mt-6 grid grid-cols-3 gap-3">
            {[
              { n: "312", l: "bloqueios/mês" },
              { n: "R$ 47", l: "salvos hoje" },
              { n: "0", l: "falsos positivos" },
            ].map((s) => (
              <div key={s.l} className="rounded-lg border border-white/[0.06] bg-white/[0.02] px-3 py-3">
                <div className="font-display text-xl">{s.n}</div>
                <div className="mt-0.5 text-[11px] text-muted-foreground">{s.l}</div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/* ---------------- PRICING ---------------- */

function Pricing() {
  return (
    <section id="pricing" className="relative py-28 md:py-36 scroll-mt-20">
      <div className="mx-auto max-w-6xl px-6">
        <motion.div {...fadeUp} className="text-center max-w-2xl mx-auto">
          <div className="text-[11px] uppercase tracking-[0.2em] text-primary/90">Planos</div>
          <h2 className="mt-4 font-display text-4xl md:text-5xl tracking-[-0.03em] font-semibold">
            Preços honestos.
            <br />
            <span className="text-gradient-fade">Sem asterisco.</span>
          </h2>
          <p className="mt-4 text-muted-foreground">
            Cancele quando quiser. Reembolso integral em 7 dias.
          </p>
        </motion.div>

        <div className="mt-16 grid gap-6 md:grid-cols-3 items-stretch">
          {PLANS.map((p, i) => (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, y: 20, filter: "blur(6px)" }}
              whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.7, ease: [0.2, 0.7, 0.2, 1] as const, delay: i * 0.08 }}
              className={`relative rounded-2xl p-8 hover-lift ${
                p.highlight
                  ? "border border-primary/30 bg-gradient-to-b from-primary/[0.08] via-transparent to-transparent md:scale-[1.03] md:-translate-y-1"
                  : "glass-card"
              }`}
            >
              {p.highlight && (
                <>
                  <div className="pointer-events-none absolute -inset-px rounded-2xl bg-gradient-to-b from-primary/40 via-transparent to-transparent opacity-40 -z-10" />
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full border border-primary/40 bg-background px-3 py-1 text-[10px] font-medium uppercase tracking-widest text-primary">
                    Mais popular
                  </div>
                </>
              )}
              <div className="flex items-center justify-between">
                <h3 className="font-display text-lg">{p.name}</h3>
                {p.highlight && <Sparkles className="h-4 w-4 text-primary" />}
              </div>
              <div className="mt-6 flex items-baseline gap-1.5">
                <span className="font-display text-5xl tracking-[-0.03em]">{p.price}</span>
                <span className="text-sm text-muted-foreground">{p.period}</span>
              </div>
              <ul className="mt-8 space-y-3 text-sm">
                {p.features.map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-foreground/85">
                    <Check className="h-4 w-4 shrink-0 mt-0.5 text-primary" /> {f}
                  </li>
                ))}
              </ul>
              <a
                href={p.checkoutUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="block mt-10"
              >
                <Button
                  className={`w-full h-11 rounded-md text-[14px] font-medium ${
                    p.highlight
                      ? "bg-white text-black hover:bg-white/90"
                      : "bg-white/[0.04] text-foreground hover:bg-white/[0.08] border border-white/[0.08]"
                  }`}
                >
                  Assinar {p.name}
                </Button>
              </a>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------- FAQ ---------------- */

const FAQS = [
  {
    q: "O Spark funciona em qualquer projeto Lovable?",
    a: "Sim. A extensão detecta automaticamente o editor do Lovable.dev e injeta os controles em qualquer projeto que você tenha acesso — sem configuração adicional.",
  },
  {
    q: "Como funciona o Shield Mode?",
    a: "O Shield analisa cada envio localmente antes de chegar ao Lovable. Cliques duplos, prompts vazios, loops acidentais e limites de crédito são interceptados. Nada é enviado para servidores externos.",
  },
  {
    q: "Posso cancelar quando quiser?",
    a: "Sim, o cancelamento é imediato e feito direto no seu dashboard. Se você não gostou, oferecemos reembolso integral em até 7 dias.",
  },
  {
    q: "Meus prompts ficam salvos em qual lugar?",
    a: "Seus prompts são criptografados e sincronizados com sua conta Spark. Você pode acessá-los em qualquer dispositivo autenticado e exportar em JSON quando quiser.",
  },
  {
    q: "Vocês têm nota fiscal?",
    a: "Sim. Emitimos NFS-e automaticamente após cada pagamento via Cakto e enviamos por email.",
  },
];

function FAQ() {
  return (
    <section className="mx-auto max-w-4xl px-6 py-28 md:py-36">
      <motion.div {...fadeUp} className="text-center">
        <div className="text-[11px] uppercase tracking-[0.2em] text-primary/90">FAQ</div>
        <h2 className="mt-4 font-display text-4xl md:text-5xl tracking-[-0.03em] font-semibold">
          Perguntas <span className="text-gradient-fade">frequentes.</span>
        </h2>
      </motion.div>

      <motion.div {...fadeUp} className="mt-14">
        <Accordion type="single" collapsible className="w-full divide-y divide-white/[0.06] border-y border-white/[0.06]">
          {FAQS.map((f, i) => (
            <AccordionItem key={i} value={`item-${i}`} className="border-0">
              <AccordionTrigger className="py-6 text-left text-base md:text-[17px] font-display font-medium hover:no-underline hover:text-primary transition-colors [&>svg]:text-muted-foreground">
                {f.q}
              </AccordionTrigger>
              <AccordionContent className="pb-6 text-[15px] leading-relaxed text-muted-foreground">
                {f.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </motion.div>
    </section>
  );
}

/* ---------------- FINAL CTA ---------------- */

function CTA() {
  const primary = PLANS.find((p) => p.id === "quarterly")!;
  return (
    <section className="relative py-28 md:py-36">
      <div className="mx-auto max-w-4xl px-6">
        <motion.div
          {...fadeUp}
          className="relative overflow-hidden rounded-3xl glass-card px-8 py-16 md:px-16 md:py-24 text-center"
        >
          <div className="pointer-events-none absolute inset-0 grid-bg opacity-40" />
          <div className="pointer-events-none absolute -inset-x-20 -top-40 h-[400px] bg-[radial-gradient(closest-side,rgba(139,92,246,0.25),transparent_70%)] blur-3xl" />
          <div className="relative">
            <h2 className="font-display text-4xl md:text-6xl tracking-[-0.03em] font-semibold leading-[1.02]">
              Construa <span className="text-gradient-brand">rápido.</span>
              <br />
              Construa <span className="text-gradient-fade">bem.</span>
            </h2>
            <p className="mx-auto mt-6 max-w-md text-muted-foreground">
              Instale o Spark em 20 segundos e sinta a diferença no primeiro prompt.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-3">
              <a href={primary.checkoutUrl} target="_blank" rel="noopener noreferrer">
                <Button
                  size="lg"
                  className="h-11 rounded-md bg-white text-black hover:bg-white/90 text-[14px] font-medium px-5"
                >
                  <Play className="mr-2 h-4 w-4 fill-black" /> Começar agora
                </Button>
              </a>
              <Link to="/contact" className="text-[14px] text-muted-foreground hover:text-foreground transition-colors px-3 py-2">
                Falar com o time →
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/* ---------------- VALUE PROPS (proposta de valor) ---------------- */

function ValueProps() {
  const items = [
    { icon: Rocket, k: "3×", l: "mais rápido para enviar um prompt refinado" },
    { icon: ShieldCheck, k: "R$ 47", l: "de créditos salvos por dia com o Shield" },
    { icon: Cpu, k: "5 em 1", l: "ferramentas premium em uma extensão" },
  ];
  return (
    <section className="relative border-y border-white/[0.06] bg-background/60">
      <div className="mx-auto max-w-6xl px-6 py-14 md:py-16 grid gap-8 md:grid-cols-3">
        {items.map((it, i) => (
          <motion.div
            key={it.l}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.6, ease: [0.2, 0.7, 0.2, 1] as const, delay: i * 0.08 }}
            className="flex items-start gap-4"
          >
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.03]">
              <it.icon className="h-5 w-5 text-primary" />
            </span>
            <div className="min-w-0">
              <div className="font-display text-2xl md:text-3xl tracking-[-0.02em]">{it.k}</div>
              <div className="mt-1 text-sm text-muted-foreground">{it.l}</div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

/* ---------------- MOCKUPS (notebook + phone) ---------------- */

function MockupsSection() {
  const primary = PLANS.find((p) => p.id === "quarterly")!;
  return (
    <section className="relative py-28 md:py-36 overflow-hidden">
      <div className="pointer-events-none absolute inset-0 -z-10 grid-bg opacity-60" />
      <div className="pointer-events-none absolute left-1/2 top-1/3 -z-10 h-[500px] w-[900px] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(139,92,246,0.16),transparent_70%)] blur-3xl" />

      <div className="mx-auto max-w-3xl px-6 text-center">
        <motion.div {...fadeUp}>
          <div className="text-[11px] uppercase tracking-[0.2em] text-primary/90">Em ação</div>
          <h2 className="mt-4 font-display text-4xl md:text-5xl tracking-[-0.03em] font-semibold leading-[1.05]">
            <span className="text-gradient-fade">Funciona em qualquer lugar</span>
            <br />
            que o Lovable roda.
          </h2>
          <p className="mt-4 text-muted-foreground">
            Do desktop ao celular — mesma experiência, mesma velocidade, mesma proteção.
          </p>
        </motion.div>
      </div>

      <div className="relative mx-auto mt-16 max-w-6xl px-6">
        {/* notebook */}
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.98 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 1, ease: [0.2, 0.7, 0.2, 1] as const }}
          className="relative mx-auto max-w-4xl"
        >
          <div className="glass-card rounded-2xl overflow-hidden shadow-[0_60px_120px_-40px_rgba(0,0,0,0.9)]">
            <div className="flex items-center gap-2 border-b border-white/[0.06] bg-white/[0.02] px-4 py-2.5">
              <div className="flex gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-white/10" />
                <span className="h-2.5 w-2.5 rounded-full bg-white/10" />
                <span className="h-2.5 w-2.5 rounded-full bg-white/10" />
              </div>
              <div className="ml-3 flex-1 flex justify-center">
                <div className="rounded-md border border-white/[0.06] bg-black/40 px-3 py-1 text-[11px] font-mono text-muted-foreground">
                  lovable.dev / <span className="text-foreground">projeto/spark</span>
                </div>
              </div>
            </div>
            <div className="relative aspect-[16/9] bg-gradient-to-b from-black/40 to-black/70">
              <div className="absolute inset-0 grid-bg opacity-40" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-[62%] rounded-xl border border-white/[0.08] bg-black/60 backdrop-blur-xl p-5 shadow-[0_20px_60px_-20px_rgba(139,92,246,0.4)]">
                  <div className="flex items-center gap-2 text-[11px] uppercase tracking-widest text-primary">
                    <Wand2 className="h-3.5 w-3.5" /> Prompt Optimizer
                  </div>
                  <div className="mt-3 rounded-md border border-white/[0.06] bg-black/50 p-3 font-mono text-[12px] leading-relaxed">
                    <div className="text-muted-foreground">// entrada</div>
                    <div className="text-foreground/80 line-through">landing bonita para saas</div>
                    <div className="mt-2 text-muted-foreground">// spark</div>
                    <div className="text-foreground">
                      Design a <span className="text-[#a78bfa]">premium dark-mode</span> SaaS landing with
                      oversized hero, subtle grid, ambient violet glow…
                      <span className="ml-0.5 inline-block h-3 w-1.5 translate-y-0.5 animate-pulse bg-primary" />
                    </div>
                  </div>
                  <div className="mt-3 flex items-center gap-2 text-[11px]">
                    <span className="rounded border border-white/[0.06] bg-white/[0.03] px-1.5 py-0.5 text-muted-foreground">claude-sonnet-4</span>
                    <span className="rounded border border-white/[0.06] bg-white/[0.03] px-1.5 py-0.5 text-muted-foreground">1.284 tokens</span>
                    <span className="ml-auto inline-flex items-center gap-1 text-emerald-400/90">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" /> otimizado
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* notebook base */}
          <div className="mx-auto h-3 w-[85%] rounded-b-2xl bg-gradient-to-b from-white/[0.06] to-transparent" />
        </motion.div>

        {/* phone */}
        <motion.div
          initial={{ opacity: 0, y: 40, rotate: -3 }}
          whileInView={{ opacity: 1, y: 0, rotate: -6 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 1, ease: [0.2, 0.7, 0.2, 1] as const, delay: 0.15 }}
          className="absolute -right-2 md:-right-6 -bottom-10 md:bottom-6 w-[180px] md:w-[220px] hidden sm:block"
        >
          <div className="relative rounded-[32px] border border-white/[0.08] bg-black shadow-[0_40px_80px_-30px_rgba(139,92,246,0.5)] overflow-hidden">
            <div className="absolute inset-x-14 top-2 h-4 rounded-full bg-black/80 z-10" />
            <div className="aspect-[9/19] bg-gradient-to-b from-[#0f0f14] to-black p-4 pt-8">
              <div className="mt-3 rounded-2xl border border-white/[0.06] bg-white/[0.03] p-3">
                <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-widest text-primary">
                  <Shield className="h-3 w-3" /> Shield
                </div>
                <div className="mt-1.5 font-display text-lg">Ativo</div>
                <div className="mt-2 h-1 rounded-full bg-white/[0.06] overflow-hidden">
                  <div className="h-full w-3/4 rounded-full bg-gradient-brand" />
                </div>
              </div>
              <div className="mt-3 space-y-2 text-[10px] font-mono text-muted-foreground">
                {["blocked · loop", "allowed · 96t", "blocked · empty", "allowed · 128t"].map((r) => (
                  <div key={r} className="rounded-md border border-white/[0.05] bg-black/40 px-2 py-1">{r}</div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* CTA reinforcement */}
      <div className="mx-auto mt-24 max-w-3xl px-6 text-center">
        <a href={primary.checkoutUrl} target="_blank" rel="noopener noreferrer">
          <Button className="h-11 rounded-md bg-white text-black hover:bg-white/90 text-[14px] font-medium px-5 shadow-[0_0_40px_-8px_rgba(255,255,255,0.35)]">
            Instalar Spark <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </a>
        <div className="mt-3 text-xs text-muted-foreground">Setup em 20 segundos · Cancele quando quiser</div>
      </div>
    </section>
  );
}

/* ---------------- BENEFITS (foco em resultado) ---------------- */

function Benefits() {
  const list = [
    {
      icon: Rocket,
      title: "Envie 3× mais rápido",
      desc: "Atalhos globais, prompts salvos e refinamento automático eliminam o tempo perdido entre pensar e enviar.",
    },
    {
      icon: ShieldCheck,
      title: "Nunca perca crédito",
      desc: "Cliques duplos, loops e prompts vazios são bloqueados antes de sair da sua máquina.",
    },
    {
      icon: Gauge,
      title: "Prompts que convertem",
      desc: "IA especializada refina intenção e força padrões — você recebe resultado de senior no primeiro shot.",
    },
    {
      icon: Download,
      title: "Seu código, sempre seu",
      desc: "Exporte o projeto inteiro em .zip a qualquer momento. Sem lock-in, sem drama.",
    },
    {
      icon: EyeOff,
      title: "Demos limpas para o cliente",
      desc: "Remova marcas d'água em previews e apresente como se fosse produção.",
    },
    {
      icon: Layers,
      title: "Uma extensão, todo o kit",
      desc: "Cinco ferramentas ajustadas ao milímetro. Uma assinatura. Zero add-ons escondidos.",
    },
  ];
  return (
    <section className="mx-auto max-w-6xl px-6 py-28 md:py-36">
      <motion.div {...fadeUp} className="max-w-2xl">
        <div className="text-[11px] uppercase tracking-[0.2em] text-primary/90">Benefícios</div>
        <h2 className="mt-4 font-display text-4xl md:text-5xl tracking-[-0.03em] font-semibold">
          O que muda no seu dia
          <br />
          <span className="text-gradient-fade">a partir de hoje.</span>
        </h2>
      </motion.div>
      <div className="mt-16 grid gap-4 md:grid-cols-3">
        {list.map((b, i) => (
          <motion.div
            key={b.title}
            initial={{ opacity: 0, y: 16, filter: "blur(6px)" }}
            whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6, ease: [0.2, 0.7, 0.2, 1] as const, delay: i * 0.06 }}
            className="glass-card hover-lift rounded-xl p-6"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/[0.08] bg-white/[0.03]">
              <b.icon className="h-5 w-5 text-primary" />
            </span>
            <h3 className="mt-5 font-display text-lg tracking-tight">{b.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{b.desc}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

/* ---------------- HOW IT WORKS ---------------- */

function HowItWorks() {
  const steps = [
    {
      n: "01",
      icon: Puzzle,
      title: "Instale a extensão",
      desc: "Adicione o Spark ao Chrome em 20 segundos. Sem cadastro obrigatório para começar.",
    },
    {
      n: "02",
      icon: Command,
      title: "Abra qualquer projeto Lovable",
      desc: "Spark detecta automaticamente o editor e injeta os controles direto na interface.",
    },
    {
      n: "03",
      icon: Sparkles,
      title: "Envie prompts de alto nível",
      desc: "Otimize com IA, ative o Shield, dispare do ⌘K. Cada envio vira resultado sênior.",
    },
  ];
  return (
    <section className="relative border-y border-white/[0.06] bg-background/40 py-28 md:py-36">
      <div className="mx-auto max-w-6xl px-6">
        <motion.div {...fadeUp} className="max-w-2xl">
          <div className="text-[11px] uppercase tracking-[0.2em] text-primary/90">Como funciona</div>
          <h2 className="mt-4 font-display text-4xl md:text-5xl tracking-[-0.03em] font-semibold">
            Do zero ao primeiro prompt
            <br />
            <span className="text-gradient-fade">em menos de um minuto.</span>
          </h2>
        </motion.div>

        <div className="mt-16 grid gap-6 md:grid-cols-3">
          {steps.map((s, i) => (
            <motion.div
              key={s.n}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.6, ease: [0.2, 0.7, 0.2, 1] as const, delay: i * 0.1 }}
              className="relative glass-card hover-lift rounded-2xl p-8"
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-[11px] tracking-widest text-primary/80">{s.n}</span>
                <span className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/[0.08] bg-white/[0.03]">
                  <s.icon className="h-4 w-4 text-primary" />
                </span>
              </div>
              <h3 className="mt-8 font-display text-2xl tracking-[-0.02em]">{s.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{s.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------- DASHBOARD DEMO (área do cliente) ---------------- */

function DashboardDemo() {
  return (
    <section className="relative py-28 md:py-36 overflow-hidden">
      <div className="pointer-events-none absolute inset-0 -z-10 grid-bg opacity-50" />
      <div className="mx-auto max-w-6xl px-6 grid gap-16 md:grid-cols-2 md:gap-24 items-center">
        <motion.div {...fadeUp}>
          <div className="text-[11px] uppercase tracking-[0.2em] text-primary/90">Área do cliente</div>
          <h2 className="mt-4 font-display text-4xl md:text-[52px] leading-[1.05] tracking-[-0.035em] font-semibold">
            Sua licença, seu plano,
            <br />
            <span className="text-gradient-fade">tudo no mesmo lugar.</span>
          </h2>
          <p className="mt-5 text-muted-foreground max-w-md">
            Um painel calmo e direto: chave de ativação, status da assinatura,
            histórico de downloads e configurações. Sem fricção, sem ruído.
          </p>
          <ul className="mt-6 space-y-3 text-sm">
            {[
              "Chave de licença sempre à mão",
              "Renovação e histórico da assinatura",
              "Download do .crx e versões anteriores",
              "Suporte prioritário integrado",
            ].map((f) => (
              <li key={f} className="flex items-center gap-3 text-foreground/90">
                <span className="flex h-5 w-5 items-center justify-center rounded-full border border-primary/30 bg-primary/10">
                  <Check className="h-3 w-3 text-primary" />
                </span>
                {f}
              </li>
            ))}
          </ul>
          <div className="mt-8">
            <Link to="/dashboard">
              <Button className="h-11 rounded-md bg-white/[0.06] text-foreground hover:bg-white/[0.1] border border-white/[0.1] text-[14px] font-medium px-5">
                Entrar no dashboard <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 30, filter: "blur(6px)" }}
          whileInView={{ opacity: 1, x: 0, filter: "blur(0px)" }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.9, ease: [0.2, 0.7, 0.2, 1] as const }}
          className="glass-card rounded-2xl p-6 relative"
        >
          <div className="flex items-center justify-between border-b border-white/[0.06] pb-4">
            <div>
              <div className="text-[10px] uppercase tracking-widest text-muted-foreground/80">Boas-vindas</div>
              <div className="mt-1 font-display text-xl">Olá, Rafael</div>
            </div>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-400/25 bg-emerald-400/10 px-2.5 py-1 text-[11px] text-emerald-400">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.7)]" /> Ativo
            </span>
          </div>

          <div className="mt-5 grid grid-cols-2 gap-3">
            <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
              <div className="text-[10px] uppercase tracking-widest text-muted-foreground">Plano</div>
              <div className="mt-1.5 font-display text-lg">Trimestral</div>
              <div className="mt-1 text-[11px] text-muted-foreground">Renova 12/out</div>
            </div>
            <div className="rounded-xl border border-primary/30 bg-gradient-to-b from-primary/[0.1] to-transparent p-4">
              <div className="text-[10px] uppercase tracking-widest text-primary">Licença</div>
              <div className="mt-1.5 font-mono text-[13px]">SPARK-9K2A-XR7Q-1D8Z</div>
              <div className="mt-1 text-[11px] text-muted-foreground">2 de 2 dispositivos</div>
            </div>
          </div>

          <div className="mt-5 rounded-xl border border-white/[0.06] bg-black/30 p-4">
            <div className="text-[10px] uppercase tracking-widest text-muted-foreground">Downloads recentes</div>
            <div className="mt-3 space-y-2 text-[12px]">
              {[
                ["spark_v3.1.0.crx", "hoje"],
                ["spark_v3.0.5.crx", "há 12 dias"],
                ["spark_v3.0.3.crx", "há 1 mês"],
              ].map(([f, t]) => (
                <div key={f} className="flex items-center justify-between border-b border-white/[0.04] pb-2 last:border-0 last:pb-0">
                  <div className="flex items-center gap-2 text-foreground/85">
                    <Download className="h-3.5 w-3.5 text-primary" /> {f}
                  </div>
                  <span className="text-muted-foreground">{t}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/* ---------------- TESTIMONIALS ---------------- */

function Testimonials() {
  const quotes = [
    {
      q: "O Shield sozinho paga a assinatura. Parei de perder crédito com clique duplo em reunião.",
      n: "Marina Reis",
      r: "Product Designer · Loft",
      i: "MR",
    },
    {
      q: "Meu output triplicou. O Optimizer transforma prompts preguiçosos em briefings sérios.",
      n: "Diego Amaral",
      r: "Founder · Kombi Studio",
      i: "DA",
    },
    {
      q: "Finalmente uma extensão que respeita o fluxo. Sem popup, sem ruído — só velocidade.",
      n: "Camila Nakamura",
      r: "Tech Lead · Rappi",
      i: "CN",
    },
  ];
  return (
    <section className="mx-auto max-w-6xl px-6 py-28 md:py-36">
      <motion.div {...fadeUp} className="text-center max-w-2xl mx-auto">
        <div className="text-[11px] uppercase tracking-[0.2em] text-primary/90">Prova social</div>
        <h2 className="mt-4 font-display text-4xl md:text-5xl tracking-[-0.03em] font-semibold">
          Usado por quem <span className="text-gradient-fade">envia software.</span>
        </h2>
        <div className="mt-6 flex items-center justify-center gap-6 text-sm text-muted-foreground">
          <div className="flex items-center gap-1.5">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} className="h-4 w-4 fill-primary text-primary" />
            ))}
            <span className="ml-1 text-foreground">4.9</span>
          </div>
          <span className="h-3 w-px bg-white/10" />
          <span>+2.400 desenvolvedores ativos</span>
        </div>
      </motion.div>

      <div className="mt-16 grid gap-6 md:grid-cols-3">
        {quotes.map((t, i) => (
          <motion.div
            key={t.n}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6, ease: [0.2, 0.7, 0.2, 1] as const, delay: i * 0.08 }}
            className="glass-card hover-lift rounded-2xl p-7 flex flex-col"
          >
            <Quote className="h-5 w-5 text-primary/70" />
            <p className="mt-4 text-[15px] leading-relaxed text-foreground/90">"{t.q}"</p>
            <div className="mt-6 flex items-center gap-3 pt-5 border-t border-white/[0.06]">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-brand text-[13px] font-medium">
                {t.i}
              </span>
              <div>
                <div className="text-sm font-medium">{t.n}</div>
                <div className="text-[12px] text-muted-foreground">{t.r}</div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

/* ---------------- GUARANTEE ---------------- */

function Guarantee() {
  return (
    <section className="relative py-20 md:py-24">
      <div className="mx-auto max-w-5xl px-6">
        <motion.div
          {...fadeUp}
          className="relative overflow-hidden rounded-3xl glass-card px-8 py-10 md:px-14 md:py-12"
        >
          <div className="pointer-events-none absolute -inset-y-10 -right-20 h-[280px] w-[280px] rounded-full bg-[radial-gradient(closest-side,rgba(139,92,246,0.25),transparent_70%)] blur-3xl" />
          <div className="relative flex flex-col md:flex-row items-start md:items-center gap-6 md:gap-10">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl border border-primary/30 bg-primary/10 shadow-[0_0_40px_-10px_rgba(139,92,246,0.6)]">
              <ShieldCheck className="h-7 w-7 text-primary" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-[11px] uppercase tracking-[0.2em] text-primary/90">Garantia de 7 dias</div>
              <h3 className="mt-2 font-display text-2xl md:text-3xl tracking-[-0.02em]">
                Teste sem risco. Reembolso <span className="text-gradient-fade">integral em 7 dias.</span>
              </h3>
              <p className="mt-2 text-sm text-muted-foreground max-w-xl">
                Se o Spark não acelerar seu fluxo, devolvemos 100% do valor. Sem perguntas, sem burocracia — basta abrir um chamado no seu dashboard.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}