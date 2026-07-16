import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

// Exclusão de conta LGPD: chama a função `delete_my_account` (SECURITY DEFINER)
// via cliente autenticado do usuário.
export const deleteMyAccount = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { error } = await context.supabase.rpc("delete_my_account");
    if (error) {
      console.error("[deleteMyAccount]", error);
      throw new Error("Não foi possível excluir sua conta. Tente novamente.");
    }
    return { ok: true as const };
  });