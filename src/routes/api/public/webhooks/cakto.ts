import { createFileRoute } from "@tanstack/react-router";

// Handler do webhook Cakto. Segurança: token compartilhado enviado
// via query string `?secret=...` OU header `x-cakto-secret`.
// Configure o mesmo valor em Cakto → Webhooks e no secret CAKTO_WEBHOOK_SECRET.

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

// Mapeia produto/valor Cakto → plano interno. O ideal é o Cakto enviar
// o "external_reference" contendo o slug do plano; se não vier, caímos
// para o valor em centavos.
function resolvePlan(payload: Record<string, unknown>): { slug: string; days: number } | null {
  const ref = String(
    (payload.external_reference as string | undefined) ??
      ((payload.data as Record<string, unknown> | undefined)?.external_reference as string | undefined) ??
      "",
  ).toLowerCase();
  if (ref.includes("annual") || ref.includes("anual")) return { slug: "annual", days: 365 };
  if (ref.includes("quarter") || ref.includes("trimestral")) return { slug: "quarterly", days: 90 };
  if (ref.includes("month") || ref.includes("mensal")) return { slug: "monthly", days: 30 };
  if (ref.includes("test") || ref.includes("teste")) return { slug: "test", days: 7 };

  const amountCents = Number(
    (payload.amount as number | undefined) ??
      ((payload.data as Record<string, unknown> | undefined)?.amount as number | undefined) ??
      0,
  );
  if (amountCents >= 15000) return { slug: "annual", days: 365 };
  if (amountCents >= 5000) return { slug: "quarterly", days: 90 };
  if (amountCents >= 2000) return { slug: "monthly", days: 30 };
  if (amountCents > 0 && amountCents < 500) return { slug: "test", days: 7 };
  return null;
}

function extractEmail(payload: Record<string, unknown>): string | null {
  const c = payload.customer as Record<string, unknown> | undefined;
  const d = payload.data as Record<string, unknown> | undefined;
  const dc = d?.customer as Record<string, unknown> | undefined;
  const email = (c?.email ?? payload.email ?? dc?.email ?? d?.email) as string | undefined;
  return email ? String(email).toLowerCase().trim() : null;
}

function extractExternalId(payload: Record<string, unknown>): string | null {
  const d = payload.data as Record<string, unknown> | undefined;
  const id = payload.id ?? payload.transaction_id ?? d?.id ?? d?.transaction_id;
  return id ? String(id) : null;
}

function extractStatus(payload: Record<string, unknown>): string {
  const d = payload.data as Record<string, unknown> | undefined;
  return String(payload.status ?? d?.status ?? payload.event ?? "unknown").toLowerCase();
}

function extractAmount(payload: Record<string, unknown>): number {
  const d = payload.data as Record<string, unknown> | undefined;
  return Number(payload.amount ?? d?.amount ?? 0);
}

export const Route = createFileRoute("/api/public/webhooks/cakto")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const secret = process.env.CAKTO_WEBHOOK_SECRET;
        if (!secret) {
          console.error("[cakto-webhook] CAKTO_WEBHOOK_SECRET not configured");
          return json({ error: "webhook not configured" }, 503);
        }

        const url = new URL(request.url);

        // Lê o body cru primeiro para poder aceitar o secret vindo no payload
        // (formato oficial da Cakto: { secret, event, data }).
        const rawBody = await request.text();
        let payload: Record<string, unknown>;
        try {
          payload = JSON.parse(rawBody) as Record<string, unknown>;
        } catch {
          return json({ error: "invalid json" }, 400);
        }

        const provided =
          (typeof payload.secret === "string" ? payload.secret : "") ||
          request.headers.get("x-cakto-secret") ||
          request.headers.get("x-webhook-secret") ||
          request.headers.get("authorization")?.replace(/^Bearer\s+/i, "") ||
          url.searchParams.get("secret") ||
          "";

        if (!provided || provided.length !== secret.length) {
          console.error(
            `[cakto-webhook] unauthorized: length mismatch (got=${provided.length} expected=${secret.length} prefix=${provided.slice(0, 4)} source=${
              typeof payload.secret === "string" && payload.secret
                ? "body"
                : request.headers.get("x-cakto-secret")
                  ? "x-cakto-secret"
                  : request.headers.get("authorization")
                    ? "authorization"
                    : url.searchParams.get("secret")
                      ? "query"
                      : "none"
            })`,
          );
          return json({ error: "unauthorized" }, 401);
        }
        let ok = 0;
        for (let i = 0; i < secret.length; i++) ok |= provided.charCodeAt(i) ^ secret.charCodeAt(i);
        if (ok !== 0) {
          console.error("[cakto-webhook] unauthorized: secret mismatch");
          return json({ error: "unauthorized" }, 401);
        }

        // A Cakto envia o corpo real do evento em `data`. Normalizamos para
        // que os extractors abaixo continuem funcionando lendo tanto do
        // topo quanto de `data`.
        if (payload.data && typeof payload.data === "object") {
          const evt = (payload.event as string | undefined) ?? "";
          if (evt && !payload.status) {
            (payload as Record<string, unknown>).status = evt;
          }
        }

        const status = extractStatus(payload);
        const email = extractEmail(payload);
        const externalId = extractExternalId(payload);
        const amountCents = extractAmount(payload);

        if (!email) return json({ error: "missing customer email" }, 400);

        const isPaid = ["paid", "approved", "completed", "purchase_approved", "subscription_renewed"].some(
          (s) => status.includes(s),
        );
        const isCanceled = ["canceled", "cancelled", "refunded", "chargeback", "subscription_canceled"].some(
          (s) => status.includes(s),
        );

        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

        // Find or create the user via Supabase Admin API
        const { data: usersList, error: listErr } = await supabaseAdmin.auth.admin.listUsers({
          page: 1,
          perPage: 1000,
        });
        if (listErr) {
          console.error("[cakto-webhook] listUsers", listErr);
          return json({ error: "internal" }, 500);
        }
        let user = usersList.users.find((u) => u.email?.toLowerCase() === email);
        if (!user) {
          const created = await supabaseAdmin.auth.admin.createUser({
            email,
            email_confirm: true,
          });
          if (created.error || !created.data.user) {
            console.error("[cakto-webhook] createUser", created.error);
            return json({ error: "cannot create user" }, 500);
          }
          user = created.data.user;
        }

        if (isCanceled) {
          await supabaseAdmin
            .from("subscriptions")
            .update({ status: "canceled" })
            .eq("user_id", user.id)
            .eq(externalId ? "external_id" : "user_id", externalId ?? user.id);
          await supabaseAdmin
            .from("licenses")
            .update({ status: "canceled" })
            .eq("user_id", user.id)
            .eq("status", "active");
          return json({ ok: true, action: "canceled" });
        }

        if (!isPaid) return json({ ok: true, action: "ignored", status });

        const plan = resolvePlan(payload);
        if (!plan) return json({ error: "unknown plan" }, 400);

        const expiresAt = new Date(Date.now() + plan.days * 24 * 60 * 60 * 1000).toISOString();

        // Idempotência: se já existe invoice com esse external_id, não duplica
        if (externalId) {
          const { data: existing } = await supabaseAdmin
            .from("invoices")
            .select("id")
            .eq("provider", "cakto")
            .eq("external_id", externalId)
            .maybeSingle();
          if (existing) return json({ ok: true, action: "already_processed" });
        }

        // upsert subscription
        const { data: sub, error: subErr } = await supabaseAdmin
          .from("subscriptions")
          .insert({
            user_id: user.id,
            plan_slug: plan.slug,
            status: "active",
            expires_at: expiresAt,
            external_id: externalId,
          })
          .select("id")
          .single();
        if (subErr) {
          console.error("[cakto-webhook] insert sub", subErr);
        }

        // Invoice
        await supabaseAdmin.from("invoices").insert({
          user_id: user.id,
          subscription_id: sub?.id ?? null,
          external_id: externalId,
          provider: "cakto",
          plan_slug: plan.slug,
          amount_cents: amountCents,
          currency: "BRL",
          status: "paid",
          raw_payload: payload as never,
        });

        // Trigger `create_license_for_subscription` roda automaticamente no insert de subscription ativa.

        return json({ ok: true, action: "activated", plan: plan.slug });
      },
    },
  },
});