import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const InputSchema = z.object({
  txid: z.string().min(3).max(200),
});

// Consulta pública por transaction id (external_id) da Cakto.
// Só retorna a chave de licença se existir invoice paga correspondente
// criada nos últimos 60 minutos (janela pós-checkout).
export const getLicenseByTransaction = createServerFn({ method: "GET" })
  .inputValidator((data: unknown) => InputSchema.parse(data))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const { data: invoice, error: invErr } = await supabaseAdmin
      .from("invoices")
      .select("user_id, plan_slug, paid_at, status")
      .eq("provider", "cakto")
      .eq("external_id", data.txid)
      .maybeSingle();

    if (invErr) {
      console.error("[getLicenseByTransaction] invoice lookup", invErr);
      return { status: "pending" as const };
    }
    if (!invoice || invoice.status !== "paid") {
      return { status: "pending" as const };
    }

    // Janela de 60 minutos após o pagamento
    const paidAt = new Date(invoice.paid_at).getTime();
    if (Date.now() - paidAt > 60 * 60 * 1000) {
      return { status: "expired" as const };
    }

    const { data: license } = await supabaseAdmin
      .from("licenses")
      .select("key, status, expires_at")
      .eq("user_id", invoice.user_id)
      .eq("status", "active")
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (!license) return { status: "pending" as const };

    return {
      status: "ready" as const,
      license_key: license.key,
      plan_slug: invoice.plan_slug,
      expires_at: license.expires_at,
    };
  });