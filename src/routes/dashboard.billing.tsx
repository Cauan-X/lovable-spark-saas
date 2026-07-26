import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CalendarClock, CreditCard, Download, Key, Loader2, Receipt } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useUser } from "@/hooks/use-user";

export const Route = createFileRoute("/dashboard/billing")({
  head: () => ({ meta: [{ title: "Faturas — Lovable Spark" }, { name: "robots", content: "noindex" }] }),
  component: BillingPage,
});

const PLAN_LABEL: Record<string, string> = {
  test: "Teste",
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

type License = { key: string; status: string; expires_at: string | null };

function BillingPage() {
  const { user } = useUser();
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [sub, setSub] = useState<Sub | null>(null);
  const [license, setLicense] = useState<License | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    let alive = true;
    (async () => {
      const [{ data: inv }, { data: subs }, { data: lics }] = await Promise.all([
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
        supabase
          .from("licenses")
          .select("key,status,expires_at")
          .eq("user_id", user.id)
          .in("status", ["active", "past_due"])
          .limit(1),
      ]);
      if (!alive) return;
      setInvoices((inv as Invoice[] | null) ?? []);
      setSub((subs?.[0] as Sub | undefined) ?? null);
      setLicense((lics?.[0] as License | undefined) ?? null);
      setLoading(false);
    })();
    return () => { alive = false; };
  }, [user]);

  const fmtMoney = (cents: number, currency = "BRL") =>
    new Intl.NumberFormat("pt-BR", { style: "currency", currency }).format(cents / 100);
  const fmtDate = (iso: string) => new Date(iso).toLocaleDateString("pt-BR");
  const fmtDateShort = (iso: string) => new Date(iso).toLocaleDateString("pt-BR", { day: "2-digit", month: "short", year: "numeric" });

  const subStatus = sub?.status ?? "inactive";
  const subExpiresAt = sub?.expires_at ?? license?.expires_at ?? null;
  const daysLeft = subExpiresAt
    ? Math.max(0, Math.ceil((new Date(subExpiresAt).getTime() - Date.now()) / 86400000))
    : null;
  const isActive = subStatus === "active" || license?.status === "active";

  if (loading) {
    return (
      <div className="flex items-center justify-center gap-2 p-20 text-sm text-muted-foreground">
        <Loader2 className="h-4 w-4 animate-spin" /> Carregando…
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-5xl">
      <div>
        <h1 className="text-3xl font-display font-semibold tracking-tight">Assinatura</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Gerencie seu plano, veja suas faturas e acompanhe o status da licença.
        </p>
      </div>

      {!isActive ? (
        <Card className="glass-card p-8 text-center">
          <p className="text-muted-foreground mb-4">Você ainda não possui uma assinatura ativa.</p>
          <Link to="/" hash="pricing">
            <Button>Ver planos</Button>
          </Link>
        </Card>
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Card className="glass-card p-5">
              <div className="flex items-center gap-2 text-[11px] uppercase tracking-wider text-muted-foreground">
                <CreditCard className="h-3.5 w-3.5" /> Plano
              </div>
              <div className="mt-2 text-lg font-semibold">
                {sub ? PLAN_LABEL[sub.plan_slug] ?? sub.plan_slug : "Ativo"}
              </div>
              <Badge className={`mt-2 border-0 ${
                subStatus === "active" ? "bg-emerald-500/15 text-emerald-400" :
                subStatus === "past_due" ? "bg-amber-500/15 text-amber-400" :
                "bg-red-500/15 text-red-400"
              }`}>
                {subStatus === "active" ? "Ativo" : subStatus === "past_due" ? "Vencendo" : subStatus}
              </Badge>
            </Card>

            <Card className="glass-card p-5">
              <div className="flex items-center gap-2 text-[11px] uppercase tracking-wider text-muted-foreground">
                <CalendarClock className="h-3.5 w-3.5" /> Válido até
              </div>
              <div className="mt-2 text-lg font-semibold">
                {subExpiresAt ? fmtDate(subExpiresAt) : "—"}
              </div>
              {daysLeft !== null && (
                <div className="mt-3 space-y-1">
                  <div className="flex justify-between text-[11px] text-muted-foreground">
                    <span>{daysLeft} dias restantes</span>
                    <span>7 dias</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-white/[0.06] overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-emerald-400 transition-all"
                      style={{ width: `${Math.min(100, (daysLeft / 7) * 100)}%` }}
                    />
                  </div>
                </div>
              )}
            </Card>

            <Card className="glass-card p-5">
              <div className="flex items-center gap-2 text-[11px] uppercase tracking-wider text-muted-foreground">
                <Receipt className="h-3.5 w-3.5" /> Total pago
              </div>
              <div className="mt-2 text-lg font-semibold">
                {fmtMoney(invoices.reduce((s, i) => s + i.amount_cents, 0))}
              </div>
              <p className="mt-1 text-[11px] text-muted-foreground">
                {invoices.length} {invoices.length === 1 ? "pagamento" : "pagamentos"}
              </p>
            </Card>

            <Card className="glass-card p-5">
              <div className="flex items-center gap-2 text-[11px] uppercase tracking-wider text-muted-foreground">
                <Key className="h-3.5 w-3.5" /> Licença
              </div>
              {license ? (
                <>
                  <code className="mt-2 block truncate rounded-md bg-black/40 px-2 py-1 font-mono text-sm tracking-wider">
                    {license.key}
                  </code>
                  <Link to="/dashboard/download" className="mt-2 inline-flex items-center gap-1 text-[11px] text-primary hover:underline">
                    <Download className="h-3 w-3" /> Baixar extensão
                  </Link>
                </>
              ) : (
                <p className="mt-2 text-sm text-muted-foreground">—</p>
              )}
            </Card>
          </div>

          <Card className="glass-card p-0 overflow-hidden">
            <div className="border-b border-white/[0.06] px-5 py-4 text-sm font-medium flex items-center gap-2">
              <Receipt className="h-4 w-4" /> Histórico de pagamentos
            </div>
            {invoices.length === 0 ? (
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
                        <td className="px-5 py-3">{fmtDateShort(i.paid_at)}</td>
                        <td className="px-5 py-3">{PLAN_LABEL[i.plan_slug] ?? i.plan_slug}</td>
                        <td className="px-5 py-3 capitalize">{i.provider}</td>
                        <td className="px-5 py-3">
                          <Badge className={`border-0 capitalize ${
                            i.status === "paid" ? "bg-emerald-500/15 text-emerald-400" :
                            i.status === "refunded" ? "bg-red-500/15 text-red-400" :
                            "bg-amber-500/15 text-amber-400"
                          }`}>
                            {i.status === "paid" ? "Pago" : i.status}
                          </Badge>
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
        </>
      )}
    </div>
  );
}
