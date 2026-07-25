import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Loader2, Search } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/admin/licenses")({
  head: () => ({ meta: [{ title: "Admin · Licenças" }, { name: "robots", content: "noindex" }] }),
  component: AdminLicenses,
});

type Row = {
  id: string;
  user_id: string;
  key: string;
  status: string;
  expires_at: string | null;
  created_at: string;
};

function AdminLicenses() {
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");

  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from("licenses")
        .select("id,user_id,key,status,expires_at,created_at")
        .order("created_at", { ascending: false })
        .limit(200);
      setRows((data as Row[]) ?? []);
      setLoading(false);
    })();
  }, []);

  const filtered = rows.filter(
    (r) => !q || r.key?.toLowerCase().includes(q.toLowerCase()) || r.status.includes(q.toLowerCase()),
  );

  const badge = (status: string) => {
    if (status === "active") return <Badge className="bg-emerald-500/15 text-emerald-400 border-0">ativa</Badge>;
    if (status === "revoked") return <Badge className="bg-red-500/15 text-red-400 border-0">revogada</Badge>;
    if (status === "expired") return <Badge className="bg-amber-500/15 text-amber-400 border-0">expirada</Badge>;
    return <Badge variant="secondary">{status}</Badge>;
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-display font-semibold tracking-tight">Licenças</h1>
        <p className="mt-1 text-sm text-muted-foreground">{rows.length} licenças emitidas.</p>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Buscar por prefixo ou status" className="pl-9" />
      </div>

      <Card className="glass-card overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-muted-foreground text-sm">
            <Loader2 className="inline h-4 w-4 animate-spin mr-2" /> Carregando…
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead className="border-b border-white/[0.06] text-[11px] uppercase text-muted-foreground">
              <tr>
                <th className="text-left px-4 py-3 font-medium">Chave</th>
                <th className="text-left px-4 py-3 font-medium">Status</th>
                <th className="text-left px-4 py-3 font-medium">Expira</th>
                <th className="text-left px-4 py-3 font-medium">Emissão</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((r) => (
                <tr key={r.id} className="border-b border-white/[0.04] hover:bg-white/[0.02]">
                  <td className="px-4 py-3 font-mono text-xs">{r.key.slice(0, 10)}••••</td>
                  <td className="px-4 py-3">{badge(r.status)}</td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {r.expires_at ? new Date(r.expires_at).toLocaleDateString("pt-BR") : "—"}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {new Date(r.created_at).toLocaleDateString("pt-BR")}
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={4} className="px-4 py-8 text-center text-muted-foreground">Nenhuma licença encontrada.</td></tr>
              )}
            </tbody>
          </table>
        )}
      </Card>

      <p className="text-xs text-muted-foreground">
        Ações administrativas (revogar, estender) exigem função server-side privilegiada — abrir via suporte.
      </p>
    </div>
  );
}