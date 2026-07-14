import { createFileRoute, Link, Outlet, useRouterState } from "@tanstack/react-router";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Download, Key, LifeBuoy, User, CheckCircle2 } from "lucide-react";

export const Route = createFileRoute("/dashboard")({
  head: () => ({ meta: [{ title: "Dashboard — Lovable Spark" }, { name: "description", content: "Gerencie sua licença, downloads e suporte." }] }),
  component: Dashboard,
});

const SIDE = [
  { icon: Download, label: "Downloads", key: "downloads" },
  { icon: Key, label: "Licença", key: "license" },
  { icon: LifeBuoy, label: "Suporte", key: "support" },
  { icon: User, label: "Minha Conta", key: "account" },
];

const VERSIONS = [
  { v: "3.1.0", date: "10 Jul 2026", size: "2.4 MB", status: "Atual" },
  { v: "3.0.2", date: "22 Jun 2026", size: "2.3 MB", status: "Anterior" },
  { v: "3.0.0", date: "01 Jun 2026", size: "2.3 MB", status: "Legado" },
  { v: "2.9.1", date: "12 Mai 2026", size: "2.1 MB", status: "Legado" },
];

function Dashboard() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold">Olá, João 👋</h1>
          <p className="text-sm text-muted-foreground">Bem-vindo de volta ao seu painel Spark.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <div className="text-sm font-medium">João Silva</div>
            <div className="text-xs text-muted-foreground">joao@email.com</div>
          </div>
          <Avatar><AvatarFallback className="bg-primary/15 text-primary">JS</AvatarFallback></Avatar>
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
                  <Badge className="bg-primary/15 text-primary border-0"><CheckCircle2 className="h-3 w-3 mr-1" /> Licença ativa</Badge>
                  <span className="text-xs text-muted-foreground">Trimestral · expira em 30/09/2026</span>
                </div>
                <h2 className="mt-3 text-xl font-semibold">Lovable Spark v3.1.0</h2>
                <p className="text-sm text-muted-foreground mt-1">Chave de licença: <code className="text-foreground">SPRK-8F2A-19XZ-4KDM</code></p>
              </div>
              <Button><Download className="mr-2 h-4 w-4" /> Baixar .crx</Button>
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
                    <td className="text-right"><Button size="sm" variant="ghost"><Download className="h-4 w-4" /></Button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>

          <Card className="p-6">
            <h3 className="font-semibold mb-3">Informações da conta</h3>
            <Separator className="mb-4" />
            <dl className="grid gap-3 sm:grid-cols-2 text-sm">
              <div><dt className="text-muted-foreground">Nome</dt><dd>João Silva</dd></div>
              <div><dt className="text-muted-foreground">Email</dt><dd>joao@email.com</dd></div>
              <div><dt className="text-muted-foreground">Plano</dt><dd>Trimestral</dd></div>
              <div><dt className="text-muted-foreground">Dispositivos</dt><dd>1 / 2</dd></div>
            </dl>
          </Card>
        </div>
      </div>
    </div>
  );
}