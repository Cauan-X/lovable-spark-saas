import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "motion/react";
import { CheckCircle2, ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/obrigado")({
  head: () => ({
    meta: [
      { title: "Obrigado! — Lovable Spark" },
      { name: "description", content: "Pagamento recebido. Sua licença está sendo ativada." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: ObrigadoPage,
});

function ObrigadoPage() {
  return (
    <div className="mx-auto flex min-h-[70vh] max-w-lg flex-col items-center justify-center px-4 py-16 text-center">
      <motion.div
        initial={{ scale: 0.85, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 18 }}
        className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/15 text-primary"
      >
        <CheckCircle2 className="h-8 w-8" />
      </motion.div>

      <motion.h1
        initial={{ y: 8, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="mt-6 font-display text-3xl font-semibold tracking-tight"
      >
        Pagamento confirmado!
      </motion.h1>

      <motion.p
        initial={{ y: 8, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.15 }}
        className="mt-3 text-sm text-muted-foreground"
      >
        Obrigado por assinar o <strong className="text-foreground">Lovable Spark</strong>. Sua licença está
        sendo ativada e chegará no seu e-mail em instantes.
      </motion.p>

      <motion.div
        initial={{ y: 8, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="mt-8 w-full rounded-xl border border-white/[0.06] bg-white/[0.02] p-5 text-left"
      >
        <div className="flex items-center gap-2 text-[11px] uppercase tracking-wider text-muted-foreground">
          <Sparkles className="h-3.5 w-3.5" /> Próximos passos
        </div>
        <ol className="mt-3 space-y-2 text-sm">
          <li>1. Confira seu e-mail (inclusive spam) — enviamos sua chave de licença.</li>
          <li>2. Faça login no painel para ver sua chave e baixar a extensão.</li>
          <li>3. Cole a chave na extensão e ative todas as ferramentas.</li>
        </ol>
      </motion.div>

      <motion.div
        initial={{ y: 8, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.25 }}
        className="mt-6 flex flex-col gap-2 sm:flex-row"
      >
        <Link to="/dashboard">
          <Button className="bg-gradient-brand bg-gradient-brand-hover text-white">
            Ir para o painel <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>
        <Link to="/docs">
          <Button variant="outline">Ver documentação</Button>
        </Link>
      </motion.div>

      <p className="mt-8 text-xs text-muted-foreground">
        Precisa de ajuda?{" "}
        <Link to="/contact" className="text-primary hover:underline">
          Fale com nosso suporte
        </Link>
        .
      </p>
    </div>
  );
}