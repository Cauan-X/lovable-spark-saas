import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const InputSchema = z.object({
  txid: z.string().min(3).max(200),
});

// Consulta pública por transaction id (external_id) da Cakto.
// Busca a chave bruta no cache temporário (license_keys_cache) com TTL de 2h.
export const getLicenseByTransaction = createServerFn({ method: "GET" })
  .inputValidator((data: unknown) => InputSchema.parse(data))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    // Busca direto no cache (evita janela de 60min frágil)
    const { data: cache } = await supabaseAdmin
      .from("license_keys_cache")
      .select("license_key, plan_slug, expires_at")
      .eq("transaction_id", data.txid)
      .maybeSingle();

    if (!cache) {
      // Fallback: verifica se já passou o prazo (invoice paga)
      const { data: invoice } = await supabaseAdmin
        .from("invoices")
        .select("status, paid_at")
        .eq("provider", "cakto")
        .eq("external_id", data.txid)
        .maybeSingle();

      if (!invoice) return { status: "pending" as const };
      if (invoice.status === "paid") {
        const paidAt = new Date(invoice.paid_at).getTime();
        if (Date.now() - paidAt > 60 * 60 * 1000) {
          return { status: "expired" as const };
        }
      }
      return { status: "pending" as const };
    }

    return {
      status: "ready" as const,
      license_key: cache.license_key,
      plan_slug: cache.plan_slug,
      expires_at: cache.expires_at,
    };
  });