import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  CheckCircle2,
  Copy,
  Download,
  Key,
  Loader2,
  Sparkles,
  CreditCard,
  ArrowUpRight,
  CalendarClock,
} from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useUser } from "@/hooks/use-user";

export const Route = createFileRoute("/dashboard/")({
  component: DashboardHome,
});

const PLAN_LABEL: Record<string, string> = {
  monthly: "Mensal",
  quarterly: "Trimestral",
  annual: "Anual",
};

type Sub = { plan_slug: string; status: string; expires_at: string | null };
type Lic = { key_prefix: string; status: string; expires_at: string | null };

function DashboardHome() {
  const { user, profile } = useUser();
  const [sub, setSub] = useState<Sub | null>(null);
  const [license, setLicense] = useState<Lic | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    let alive = true;
    (async () => {
      const [{ data: subs }, { data: lics }] = await Promise.all([
        supabase.from("subscriptions").select("plan_slug,status,expires_at").eq("user_id", user.id).order("created_at", { ascending: false }).limit(1),
        supabase.from("licenses").select("key_prefix,status,expires_at").eq("user_id", user.id).in("status", ["active", "past_due"]).limit(1),
      ]);
      if (!alive) return;
      setSub((subs?.[0] as Sub | undefined) ?? null);
      setLicense((lics?.[0] as Lic | undefined) ?? null);
      setLoading(false);
    })();
    return () => { alive = false; };
  }, [user]);

  const copy = async () => {
    if (!license) return;
    await navigator.clipboard.writeText(license.key_prefix);
    toast.success("Prefixo copiado");
  };

  const name = profile?.full_name || user?.email?.split("@")[0] || "Usuário";
  const planLabel = sub ? PLAN_LABEL[sub.plan_slug] ?? sub.plan_slug : null;
  const expires = sub?.expires_at ? new Date(sub.expires_at).toLocaleDateString("pt-BR") : null;

  const cards = [
    { icon: Sparkles, label: "Plano", value: planLabel ?? "Nenhum" },
    { icon: CheckCircle2, label: "Status", value: sub?.status ?? "sem assinatura" },
    { icon: CalendarClock, label: "Renovação", value: expires ?? "—" },
    { icon: Key, label: "Licenças", value: license ? "1 ativa" : "0" },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-display font-semibold tracking-tight">Olá, {name} 👋</h1>
        <p className="mt-1 text-sm text-muted-foreground">Bem-vindo de volta ao seu painel Spark.</p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((c, i) => (
          <motion.div
            key={c.label}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <Card className="glass-card hover-lift p-4">
              <div className="flex items-center gap-2 text-[11px] uppercase tracking-wider text-muted-foreground">
                <c.icon className="h-3.5 w-3.5" /> {c.label}
              </div>
              <div className="mt-2 text-lg font-semibold capitalize">{c.value}</div>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="glass-card lg:col-span-2 p-6">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                {license ? (
                  <Badge className="bg-primary/15 text-primary border-0"><CheckCircle2 className="h-3 w-3 mr-1" /> Licença ativa</Badge>
                ) : (
                  <Badge variant="secondary">Sem licença ativa</Badge>
                )}
                {planLabel && <span className="text-xs text-muted-foreground">{planLabel}{expires ? ` · expira em ${expires}` : ""}</span>}
              </div>
              <h2 className="mt-3 text-xl font-display font-semibold">Lovable Spark v3.1.0</h2>
              {loading ? (
                <div className="mt-3 flex items-center text-sm text-muted-foreground"><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Carregando…</div>
              ) : license ? (
                <div className="mt-3 flex items-center gap-2">
                  <code className="rounded bg-muted px-2 py-1 text-sm">{license.key_prefix}••••-••••-••••-••••</code>
                  <Button size="sm" variant="ghost" onClick={copy}><Copy className="h-3.5 w-3.5" /></Button>
                </div>
              ) : (
                <p className="mt-3 text-sm text-muted-foreground">
                  Escolha um plano para receber sua chave de licença.{" "}
                  <Link to="/" hash="pricing" className="text-primary hover:underline">Ver planos</Link>
                </p>
              )}
            </div>
            <Link to="/dashboard/download" disabled={!license} className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-brand bg-gradient-brand-hover text-white px-5 py-2.5 text-sm font-medium transition-all hover:shadow-lg disabled:opacity-50 disabled:pointer-events-none">
              <Download className="h-4 w-4" /> Baixar .crx
            </Link>
          </div>
        </Card>

        <Card className="glass-card p-6">
          <div className="flex items-center gap-2 text-[11px] uppercase tracking-wider text-muted-foreground">
            <CreditCard className="h-3.5 w-3.5" /> Assinatura
          </div>
          <div className="mt-3 text-xl font-display font-semibold">{planLabel ?? "Sem plano"}</div>
          <p className="mt-1 text-sm text-muted-foreground">
            {sub ? `Status: ${sub.status}${expires ? ` · próximo em ${expires}` : ""}` : "Nenhuma assinatura ativa."}
          </p>
          <div className="mt-4 flex gap-2">
            <Link to="/dashboard/settings" search={{ tab: "subscription" }}>
              <Button size="sm" variant="outline">Gerenciar</Button>
            </Link>
            <Link to="/" hash="pricing">
              <Button size="sm" variant="ghost" className="text-primary">
                Planos <ArrowUpRight className="ml-1 h-3.5 w-3.5" />
              </Button>
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
}