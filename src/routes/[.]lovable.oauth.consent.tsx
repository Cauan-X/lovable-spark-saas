import { createFileRoute, redirect } from "@tanstack/react-router";
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sparkles, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

type AuthorizationDetails = {
  client?: { name?: string; client_id?: string; redirect_uri?: string };
  scope?: string;
  redirect_url?: string;
  redirect_to?: string;
};

type OAuthNamespace = {
  getAuthorizationDetails: (id: string) => Promise<{ data: AuthorizationDetails | null; error: { message: string } | null }>;
  approveAuthorization: (id: string) => Promise<{ data: AuthorizationDetails | null; error: { message: string } | null }>;
  denyAuthorization: (id: string) => Promise<{ data: AuthorizationDetails | null; error: { message: string } | null }>;
};

function oauth(): OAuthNamespace {
  return (supabase.auth as unknown as { oauth: OAuthNamespace }).oauth;
}

export const Route = createFileRoute("/.lovable/oauth/consent")({
  ssr: false,
  validateSearch: (s: Record<string, unknown>) => ({
    authorization_id: typeof s.authorization_id === "string" ? s.authorization_id : "",
  }),
  beforeLoad: async ({ search, location }) => {
    if (!search.authorization_id) throw new Error("authorization_id ausente");
    const { data } = await supabase.auth.getSession();
    const next = location.pathname + location.searchStr;
    if (!data.session) throw redirect({ to: "/auth", search: { next } });
  },
  loader: async ({ location }) => {
    const authorizationId = new URLSearchParams(location.search).get("authorization_id")!;
    const { data, error } = await oauth().getAuthorizationDetails(authorizationId);
    if (error) throw new Error(error.message);
    const immediate = data?.redirect_url ?? data?.redirect_to;
    if (immediate && !data?.client) throw redirect({ href: immediate });
    return data;
  },
  component: Consent,
  errorComponent: ({ error }) => (
    <div className="mx-auto max-w-md px-4 py-16">
      <Card className="p-8">
        <h1 className="text-lg font-semibold mb-2">Não foi possível carregar a autorização</h1>
        <p className="text-sm text-muted-foreground">{String((error as Error)?.message ?? error)}</p>
      </Card>
    </div>
  ),
});

function Consent() {
  const details = Route.useLoaderData();
  const { authorization_id } = Route.useSearch();
  const [busy, setBusy] = useState<"approve" | "deny" | null>(null);
  const [error, setError] = useState<string | null>(null);
  const clientName = details?.client?.name ?? "o aplicativo";

  async function decide(approve: boolean) {
    setBusy(approve ? "approve" : "deny");
    setError(null);
    const { data, error } = approve
      ? await oauth().approveAuthorization(authorization_id)
      : await oauth().denyAuthorization(authorization_id);
    if (error) { setBusy(null); setError(error.message); return; }
    const target = data?.redirect_url ?? data?.redirect_to;
    if (!target) { setBusy(null); setError("Servidor de autorização não retornou URL de redirecionamento."); return; }
    window.location.href = target;
  }

  return (
    <div className="mx-auto max-w-md px-4 py-16">
      <Card className="p-8">
        <div className="flex items-center gap-2 justify-center mb-6">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/15 text-primary">
            <Sparkles className="h-5 w-5" />
          </span>
          <span className="text-lg font-bold">Lovable <span className="text-primary">Spark</span></span>
        </div>
        <h1 className="text-xl font-semibold text-center">Conectar {clientName} à sua conta</h1>
        <p className="text-sm text-muted-foreground text-center mt-3">
          Isto permite que <span className="font-medium text-foreground">{clientName}</span> use as ferramentas do Spark como você.
          Suas políticas de acesso continuam valendo.
        </p>
        {details?.client?.redirect_uri && (
          <p className="text-xs text-muted-foreground text-center mt-2 break-all">
            Redireciona para: <code>{details.client.redirect_uri}</code>
          </p>
        )}
        {error && (
          <p role="alert" className="text-sm text-destructive text-center mt-4">{error}</p>
        )}
        <div className="mt-6 grid grid-cols-2 gap-2">
          <Button variant="outline" disabled={busy !== null} onClick={() => decide(false)}>
            {busy === "deny" ? <Loader2 className="h-4 w-4 animate-spin" /> : "Negar"}
          </Button>
          <Button disabled={busy !== null} onClick={() => decide(true)}>
            {busy === "approve" ? <Loader2 className="h-4 w-4 animate-spin" /> : "Aprovar"}
          </Button>
        </div>
      </Card>
    </div>
  );
}