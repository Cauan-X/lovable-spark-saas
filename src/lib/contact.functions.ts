import { createServerFn } from "@tanstack/react-start";
import { contactSchema } from "./validation";
import { getRequestHeader, getRequestIP } from "@tanstack/react-start/server";

// Insere mensagens de contato via server function usando Service Role,
// com honeypot antibot e rate limit por IP (5 mensagens / 10 min).
const MAX_PER_WINDOW = 5;
const WINDOW_MINUTES = 10;

export const submitContact = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => contactSchema.parse(input))
  .handler(async ({ data }) => {
    // 1) Honeypot: se preenchido, silenciosamente aceita e descarta
    if (data.website && data.website.length > 0) {
      return { ok: true as const };
    }

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    // 2) Rate limit por IP
    const ip =
      getRequestHeader("cf-connecting-ip") ??
      getRequestHeader("x-real-ip") ??
      getRequestIP({ xForwardedFor: true }) ??
      "unknown";

    const since = new Date(Date.now() - WINDOW_MINUTES * 60 * 1000).toISOString();
    const { count } = await supabaseAdmin
      .from("contact_rate_limits")
      .select("id", { count: "exact", head: true })
      .eq("ip", ip)
      .gte("created_at", since);

    if ((count ?? 0) >= MAX_PER_WINDOW) {
      throw new Error("Muitas mensagens em pouco tempo. Tente novamente em alguns minutos.");
    }

    await supabaseAdmin.from("contact_rate_limits").insert({ ip });

    const { error } = await supabaseAdmin.from("contacts").insert({
      name: data.name,
      email: data.email,
      subject: data.subject,
      message: data.message,
    });
    if (error) {
      // Log server-side com detalhe, resposta genérica ao cliente.
      console.error("[submitContact]", error);
      throw new Error("Não foi possível enviar sua mensagem no momento.");
    }
    return { ok: true as const };
  });