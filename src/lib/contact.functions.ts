import { createServerFn } from "@tanstack/react-start";
import { contactSchema } from "./validation";

// Insere mensagens de contato via server function usando Service Role,
// validando o payload com Zod. Substitui o INSERT direto do cliente.
// A policy anon foi revogada; qualquer INSERT direto no PostgREST é agora rejeitado.
// Rate limiting real depende de infraestrutura ainda não disponível na plataforma;
// CHECK constraints no banco limitam tamanhos e formato.
export const submitContact = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => contactSchema.parse(input))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
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