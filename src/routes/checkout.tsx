import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect } from "react";
import { z } from "zod";
import { zodValidator, fallback } from "@tanstack/zod-adapter";
import { Loader2 } from "lucide-react";
import { PLANS } from "@/lib/site-data";

const searchSchema = z.object({
  plan: fallback(z.string(), "quarterly").default("quarterly"),
});

const PLAN_ALIASES: Record<string, string> = {
  yearly: "annual",
  anual: "annual",
  mensal: "monthly",
  trimestral: "quarterly",
};

export const Route = createFileRoute("/checkout")({
  validateSearch: zodValidator(searchSchema),
  head: () => ({
    meta: [
      { title: "Redirecionando para o pagamento — Lovable Spark" },
      { name: "description", content: "Redirecionando você para o checkout seguro Cakto." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: Checkout,
});

function Checkout() {
  const { plan } = Route.useSearch();
  const resolved = PLAN_ALIASES[plan] ?? plan;
  const selected = PLANS.find((p) => p.id === resolved) ?? PLANS[1];

  useEffect(() => {
    window.location.href = selected.checkoutUrl;
  }, [selected.checkoutUrl]);

  return (
    <div className="mx-auto flex min-h-[60vh] max-w-md flex-col items-center justify-center px-4 py-16 text-center">
      <Loader2 className="h-10 w-10 animate-spin text-primary" />
      <h1 className="mt-6 text-2xl font-serif">Redirecionando para o pagamento seguro…</h1>
      <p className="mt-3 text-sm text-muted-foreground">
        Plano {selected.name} — {selected.price}{selected.period}. Você está sendo levado ao checkout da Cakto.
      </p>
      <p className="mt-6 text-xs text-muted-foreground">
        Não foi redirecionado?{" "}
        <a href={selected.checkoutUrl} className="underline text-foreground">
          Clique aqui
        </a>
        .
      </p>
      <Link to="/" className="mt-4 text-xs text-muted-foreground underline">
        Voltar para o início
      </Link>
    </div>
  );
}