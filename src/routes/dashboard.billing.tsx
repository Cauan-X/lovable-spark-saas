import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CalendarClock, CreditCard, Loader2, Receipt } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useUser } from "@/hooks/use-user";

export const Route = createFileRoute("/dashboard/billing")({
  head: () => ({ meta: [{ title: "Faturas — Lovable Spark" }, { name: "robots", content: "noindex" }] }),
  component: BillingPage,
});

const PLAN_LABEL: Record<string, string> = {
  monthly: "Mensal",
  quarterly: "Trimestral",
  annual: "Anual",
};

type Invoice = {
  id: string;
  plan_slug: string;
  amount_cents: number;
  currency: string;
  status: string;
  paid_at: string;
  provider: string;
};

type Sub = { plan_slug: string; status: string; expires_at: string | null };

function BillingPage() {
  const { user } = useUser();
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [sub, setSub] = useState<Sub | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    let alive = true;
    (async () => {
      const [{ data: inv }, { data: subs }] = await Promise.all([
        supabase
          .from("invoices")
          .select("id,plan_slug,amount_cents,currency,status,paid_at,provider")
          .eq("user_id", user.id)
          .order("paid_at", { ascending: false }),
        supabase
          .from("subscriptions")
          .select("plan_slug,status,expires_at")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false })
          .limit(1),
      ]);
      if (!alive) return;
      setInvoices((inv as Invoice[] | null) ?? []);
      setSub((subs?.[0] as Sub | undefined) ?? null);
      setLoading(false);
    })();
    return () => {
      alive = false;
    };
  }, [user]);

  const fmtMoney = (cents: number, currency = "BRL") =>
    new Intl.NumberFormat("pt-BR", { style: "currency", currency }).format(cents / 100);
  const fmtDate = (iso: string) => new Date(iso).toLocaleDateString("pt-BR");

  return (
    <div className="space-y-8 max-w-5xl">
      <div>
        <h1 className="text-3xl font-display font-semibold tracking-tight">Faturas</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Histórico de pagamentos e status da sua assinatura.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="glass-card p-5">
          <div className="flex items-center gap-2 text-[11px] uppercase tracking-wider text-muted-foreground">
            <CreditCard className="h-3.5 w-3.5" /> Plano
          </div>
          <div className="mt-2 text-lg font-semibold">
            {sub ? PLAN_LABEL[sub.plan_slug] ?? sub.plan_slug : "Sem plano"}
          </div>
        </Card>
        <Card className="glass-card p-5">
          <div className="flex items-center gap-2 text-[11px] uppercase tracking-wider text-muted-foreground">
            <CalendarClock className="h-3.5 w-3.5" /> Próxima renovação
          </div>
          <div className="mt-2 text-lg font-semibold">
            {sub?.expires_at ? fmtDate(sub.expires_at) : "—"}
          </div>
        </Card>
        <Card className="glass-card p-5">
          <div className="flex items-center gap-2 text-[11px] uppercase tracking-wider text-muted-foreground">
            <Receipt className="h-3.5 w-3.5" /> Total pago
          </div>
          <div className="mt-2 text-lg font-semibold">
            {fmtMoney(invoices.reduce((s, i) => s + i.amount_cents, 0))}
          </div>
        </Card>
      </div>

      <Card className="glass-card p-0 overflow-hidden">
        <div className="border-b border-white/[0.06] px-5 py-4 text-sm font-medium">
          Histórico de pagamentos
        </div>
        {loading ? (
          <div className="flex items-center justify-center gap-2 p-10 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" /> Carregando…
          </div>
        ) : invoices.length === 0 ? (
          <div className="p-10 text-center text-sm text-muted-foreground">
            Nenhum pagamento registrado ainda.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-left text-[11px] uppercase tracking-wider text-muted-foreground">
                <tr>
                  <th className="px-5 py-3">Data</th>
                  <th className="px-5 py-3">Plano</th>
                  <th className="px-5 py-3">Provedor</th>
                  <th className="px-5 py-3">Status</th>
                  <th className="px-5 py-3 text-right">Valor</th>
                </tr>
              </thead>
              <tbody>
                {invoices.map((i) => (
                  <tr key={i.id} className="border-t border-white/[0.04]">
                    <td className="px-5 py-3">{fmtDate(i.paid_at)}</td>
                    <td className="px-5 py-3">{PLAN_LABEL[i.plan_slug] ?? i.plan_slug}</td>
                    <td className="px-5 py-3 capitalize">{i.provider}</td>
                    <td className="px-5 py-3">
                      <Badge className="bg-primary/15 text-primary border-0 capitalize">{i.status}</Badge>
                    </td>
                    <td className="px-5 py-3 text-right font-medium">
                      {fmtMoney(i.amount_cents, i.currency)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}