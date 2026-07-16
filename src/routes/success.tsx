import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { motion } from "motion/react";
import { CheckCircle2, Copy, ArrowRight, Sparkles, Loader2, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getLicenseByTransaction } from "@/lib/checkout.functions";
import { toast } from "sonner";
import { z } from "zod";

const searchSchema = z.object({
  id: z.string().optional(),
  transaction_id: z.string().optional(),
  txid: z.string().optional(),
  plan: z.string().optional(),
});

const PLAN_LABEL: Record<string, string> = {
  monthly: "Mensal",
  quarterly: "Trimestral",
  annual: "Anual",
};

export const Route = createFileRoute("/success")({
  validateSearch: (search) => searchSchema.parse(search),
  head: () => ({
    meta: [
      { title: "Compra confirmada — Lovable Spark" },
      { name: "description", content: "Sua licença está pronta." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: SuccessPage,
});

type State =
  | { kind: "loading" }
  | { kind: "ready"; key: string; plan: string; expiresAt: string | null }
  | { kind: "timeout" }
  | { kind: "missing" };

function SuccessPage() {
  const search = Route.useSearch();
  const navigate = useNavigate();
  const txid = search.id ?? search.transaction_id ?? search.txid ?? null;
  const planHint = search.plan ?? null;

  const [state, setState] = useState<State>(() =>
    txid ? { kind: "loading" } : { kind: "missing" },
  );
  const fetchFn = useServerFn(getLicenseByTransaction);
  const stopRef = useRef(false);

  useEffect(() => {
    if (!txid) return;
    stopRef.current = false;
    let attempts = 0;
    const maxAttempts = 20; // ~60s

    const poll = async () => {
      if (stopRef.current) return;
      attempts++;
      try {
        const res = await fetchFn({ data: { txid } });
        if (stopRef.current) return;
        if (res.status === "ready") {
          setState({
            kind: "ready",
            key: res.license_key,
            plan: res.plan_slug,
            expiresAt: res.expires_at,
          });
          return;
        }
      } catch (err) {
        console.error("[/success] poll", err);
      }
      if (attempts >= maxAttempts) {
        setState({ kind: "timeout" });
        return;
      }
      setTimeout(poll, 3000);
    };
    poll();
    return () => {
      stopRef.current = true;
    };
  }, [txid, fetchFn]);

  const copy = async (key: string) => {
    try {
      await navigator.clipboard.writeText(key);
      toast.success("Chave copiada!");
    } catch {
      toast.error("Não foi possível copiar");
    }
  };

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-xl flex-col items-center justify-center px-4 py-16 text-center">
      {state.kind === "loading" && (
        <>
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/15 text-primary">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
          <h1 className="mt-6 font-display text-3xl font-semibold tracking-tight">
            Ativando sua licença…
          </h1>
          <p className="mt-3 text-sm text-muted-foreground">
            Estamos confirmando seu pagamento com a Cakto. Isso costuma levar poucos segundos.
          </p>
        </>
      )}

      {state.kind === "ready" && (
        <>
          <motion.div
            initial={{ scale: 0.85, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 18 }}
            className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/15 text-primary"
          >
            <CheckCircle2 className="h-8 w-8" />
          </motion.div>
          <h1 className="mt-6 font-display text-3xl font-semibold tracking-tight">
            Tudo pronto! Sua licença foi ativada
          </h1>
          <p className="mt-3 text-sm text-muted-foreground">
            Plano{" "}
            <strong className="text-foreground">
              {PLAN_LABEL[state.plan] ?? state.plan}
            </strong>
            . Copie a chave abaixo e cole na extensão.
          </p>

          <div className="mt-6 w-full rounded-xl border border-white/[0.06] bg-white/[0.02] p-5 text-left">
            <div className="flex items-center gap-2 text-[11px] uppercase tracking-wider text-muted-foreground">
              <Sparkles className="h-3.5 w-3.5" /> Sua chave de licença
            </div>
            <div className="mt-3 flex items-center gap-2">
              <code className="flex-1 truncate rounded-md bg-black/40 px-3 py-2 font-mono text-sm">
                {state.key}
              </code>
              <Button size="sm" variant="outline" onClick={() => copy(state.key)}>
                <Copy className="mr-1.5 h-3.5 w-3.5" /> Copiar
              </Button>
            </div>
            {state.expiresAt && (
              <p className="mt-3 text-xs text-muted-foreground">
                Válida até {new Date(state.expiresAt).toLocaleDateString("pt-BR")}
              </p>
            )}
          </div>

          <div className="mt-6 flex flex-col gap-2 sm:flex-row">
            <Link to="/dashboard">
              <Button className="bg-gradient-brand bg-gradient-brand-hover text-white">
                Ir para o painel <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link to="/docs">
              <Button variant="outline">Como instalar</Button>
            </Link>
          </div>
        </>
      )}

      {state.kind === "timeout" && (
        <>
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-amber-500/15 text-amber-400">
            <AlertTriangle className="h-8 w-8" />
          </div>
          <h1 className="mt-6 font-display text-3xl font-semibold tracking-tight">
            Ainda processando…
          </h1>
          <p className="mt-3 text-sm text-muted-foreground">
            Seu pagamento pode levar alguns minutos para ser confirmado pela Cakto. Assim que
            confirmar, sua chave aparecerá no painel.
          </p>
          <div className="mt-6 flex gap-2">
            <Button variant="outline" onClick={() => navigate({ to: "/success", search })}>
              Tentar novamente
            </Button>
            <Link to="/dashboard">
              <Button className="bg-gradient-brand bg-gradient-brand-hover text-white">
                Ir para o painel
              </Button>
            </Link>
          </div>
        </>
      )}

      {state.kind === "missing" && (
        <>
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-amber-500/15 text-amber-400">
            <AlertTriangle className="h-8 w-8" />
          </div>
          <h1 className="mt-6 font-display text-3xl font-semibold tracking-tight">
            Sem identificador de transação
          </h1>
          <p className="mt-3 text-sm text-muted-foreground">
            Não recebemos o ID da compra. Acesse o painel para ver sua chave de licença.
          </p>
          <div className="mt-6">
            <Link to="/dashboard">
              <Button className="bg-gradient-brand bg-gradient-brand-hover text-white">
                Ir para o painel
              </Button>
            </Link>
          </div>
          {planHint && (
            <p className="mt-6 text-xs text-muted-foreground">Plano: {planHint}</p>
          )}
        </>
      )}
    </div>
  );
}