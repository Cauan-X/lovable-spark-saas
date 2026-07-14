import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Download, Key, LifeBuoy, User, CheckCircle2, Loader2, Copy, LogOut } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import type { User as AuthUser } from "@supabase/supabase-js";

export const Route = createFileRoute("/dashboard")({
  ssr: false,
  head: () => ({ meta: [{ title: "Dashboard — Lovable Spark" }, { name: "description", content: "Gerencie sua licença, downloads e suporte." }] }),
  component: Dashboard,
});

const SIDE = [
  { icon: Key, label: "Licença", key: "license" },
  { icon: Download, label: "Downloads", key: "downloads" },
  { icon: LifeBuoy, label: "Suporte", key: "support" },
  { icon: User, label: "Minha Conta", key: "account" },
];

const VERSIONS = [
  { v: "3.1.0", date: "10 Jul 2026", size: "2.4 MB", status: "Atual" },
  { v: "3.0.2", date: "22 Jun 2026", size: "2.3 MB", status: "Anterior" },
  { v: "3.0.0", date: "01 Jun 2026", size: "2.3 MB", status: "Legado" },
];

const PLAN_LABEL: Record<string, string> = {
  monthly: "Mensal",
  quarterly: "Trimestral",
  annual: "Anual",
};

type Sub = { plan_slug: string; status: string; expires_at: string | null };
type Lic = { key: string; status: string; expires_at: string | null };

function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [sub, setSub] = useState<Sub | null>(null);
  const [license, setLicense] = useState<Lic | null>(null);

  useEffect(() => {
    let alive = true;
    (async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { navigate({ to: "/auth" }); return; }
      if (!alive) return;
      setUser(session.user);

      const [{ data: subs }, { data: lics }] = await Promise.all([
        supabase.from("subscriptions").select("plan_slug,status,expires_at").eq("user_id", session.user.id).order("created_at", { ascending: false }).limit(1),
        supabase.from("licenses").select("key,status,expires_at").eq("user_id", session.user.id).eq("status", "active").limit(1),
      ]);
      if (!alive) return;
      setSub(subs?.[0] ?? null);
      setLicense(lics?.[0] ?? null);
      setLoading(false);
    })();
    return () => { alive = false; };
  }, [navigate]);

  const signOut = async () => {
    await supabase.auth.signOut();
    navigate({ to: "/auth" });
  };

  const copy = async () => {
    if (!license) return;
    await navigator.clipboard.writeText(license.key);
    toast.success("Chave copiada");
  };

  if (loading) {
    return <div className="mx-auto max-w-6xl px-4 py-24 flex items-center justify-center text-muted-foreground"><Loader2 className="h-5 w-5 animate-spin mr-2" /> Carregando…</div>;
  }

  const name = (user?.user_metadata?.full_name as string) || user?.email?.split("@")[0] || "Usuário";
  const initials = name.split(" ").map((s) => s[0]).join("").slice(0, 2).toUpperCase();
  const planLabel = sub ? PLAN_LABEL[sub.plan_slug] ?? sub.plan_slug : null;
  const expires = sub?.expires_at ? new Date(sub.expires_at).toLocaleDateString("pt-BR") : null;

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold">Olá, {name} 👋</h1>
          <p className="text-sm text-muted-foreground">Bem-vindo de volta ao seu painel Spark.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <div className="text-sm font-medium">{name}</div>
            <div className="text-xs text-muted-foreground">{user?.email}</div>
          </div>
          <Avatar><AvatarFallback className="bg-primary/15 text-primary">{initials}</AvatarFallback></Avatar>
          <Button size="sm" variant="ghost" onClick={signOut}><LogOut className="h-4 w-4" /></Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[220px_1fr]">
        <aside className="space-y-1">
          {SIDE.map((s) => (
            <button key={s.key} className="flex w-full items-center gap-3 px-3 py-2 rounded-md text-sm hover:bg-accent text-left">
              <s.icon className="h-4 w-4" /> {s.label}
            </button>
          ))}
        </aside>

        <div className="space-y-6">
          <Card className="p-6">
            <div className="flex items-start justify-between flex-wrap gap-4">
              <div>
                <div className="flex items-center gap-2">
                  {license ? (
                    <Badge className="bg-primary/15 text-primary border-0"><CheckCircle2 className="h-3 w-3 mr-1" /> Licença ativa</Badge>
                  ) : (
                    <Badge variant="secondary">Sem licença ativa</Badge>
                  )}
                  {planLabel && <span className="text-xs text-muted-foreground">{planLabel}{expires ? ` · expira em ${expires}` : ""}</span>}
                </div>
                <h2 className="mt-3 text-xl font-semibold">Lovable Spark v3.1.0</h2>
                {license ? (
                  <div className="mt-2 flex items-center gap-2">
                    <code className="rounded bg-muted px-2 py-1 text-sm text-foreground">{license.key}</code>
                    <Button size="sm" variant="ghost" onClick={copy}><Copy className="h-3.5 w-3.5" /></Button>
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground mt-2">Escolha um plano para receber sua chave de licença.</p>
                )}
              </div>
              <Button disabled={!license}><Download className="mr-2 h-4 w-4" /> Baixar .crx</Button>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="font-semibold mb-4">Histórico de versões</h3>
            <table className="w-full text-sm">
              <thead className="text-left text-muted-foreground text-xs uppercase">
                <tr><th className="py-2">Versão</th><th>Data</th><th>Tamanho</th><th>Status</th><th></th></tr>
              </thead>
              <tbody>
                {VERSIONS.map((v) => (
                  <tr key={v.v} className="border-t border-border/60">
                    <td className="py-3 font-medium">v{v.v}</td>
                    <td>{v.date}</td>
                    <td>{v.size}</td>
                    <td><Badge variant="secondary">{v.status}</Badge></td>
                    <td className="text-right"><Button size="sm" variant="ghost" disabled={!license}><Download className="h-4 w-4" /></Button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>

          <Card className="p-6">
            <h3 className="font-semibold mb-3">Informações da conta</h3>
            <Separator className="mb-4" />
            <dl className="grid gap-3 sm:grid-cols-2 text-sm">
              <div><dt className="text-muted-foreground">Nome</dt><dd>{name}</dd></div>
              <div><dt className="text-muted-foreground">Email</dt><dd>{user?.email}</dd></div>
              <div><dt className="text-muted-foreground">Plano</dt><dd>{planLabel ?? "—"}</dd></div>
              <div><dt className="text-muted-foreground">Status</dt><dd>{sub?.status ?? "sem assinatura"}</dd></div>
            </dl>
          </Card>
        </div>
      </div>
    </div>
  );
}