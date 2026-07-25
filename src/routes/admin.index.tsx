import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { Users, Key, Activity, Loader2 } from "lucide-react";

export const Route = createFileRoute("/admin/")({
  component: AdminOverview,
});

type Stats = {
  users: number;
  licenses: number;
  activeLicenses: number;
  expiredLicenses: number;
};

function AdminOverview() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    (async () => {
      const [{ count: users }, { count: licenses }, { count: active }, { count: expired }] = await Promise.all([
        supabase.from("profiles").select("*", { count: "exact", head: true }),
        supabase.from("licenses").select("*", { count: "exact", head: true }),
        supabase.from("licenses").select("*", { count: "exact", head: true }).eq("status", "active"),
        supabase.from("licenses").select("*", { count: "exact", head: true }).eq("status", "expired"),
      ]);
      if (!alive) return;
      setStats({ users: users ?? 0, licenses: licenses ?? 0, activeLicenses: active ?? 0, expiredLicenses: expired ?? 0 });
      setLoading(false);
    })();
    return () => { alive = false; };
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20 text-muted-foreground">
        <Loader2 className="h-5 w-5 animate-spin mr-2" /> Carregando…
      </div>
    );
  }

  const cards = [
    { icon: Users, label: "Usuários", value: stats?.users ?? 0, color: "blue" },
    { icon: Key, label: "Licenças", value: stats?.licenses ?? 0, color: "purple" },
    { icon: Activity, label: "Ativas", value: stats?.activeLicenses ?? 0, color: "green" },
    { icon: Activity, label: "Expiradas", value: stats?.expiredLicenses ?? 0, color: "red" },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-display font-semibold tracking-tight">Admin</h1>
        <p className="mt-1 text-sm text-muted-foreground">Visão geral do sistema.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((c) => (
          <Card key={c.label} className="glass-card p-5">
            <div className="flex items-center gap-2 text-[11px] uppercase tracking-wider text-muted-foreground">
              <c.icon className="h-3.5 w-3.5" /> {c.label}
            </div>
            <div className="mt-2 text-2xl font-semibold">{c.value}</div>
          </Card>
        ))}
      </div>

      <Card className="glass-card p-6">
        <h2 className="text-sm font-medium mb-3">Ações rápidas</h2>
        <div className="flex flex-wrap gap-3">
          <Link to="/admin/users" className="text-sm text-primary hover:underline">Gerenciar usuários</Link>
          <Link to="/admin/licenses" className="text-sm text-primary hover:underline">Gerenciar licenças</Link>
        </div>
      </Card>
    </div>
  );
}
