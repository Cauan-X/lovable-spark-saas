import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Sparkles, Loader2, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { passwordSchema } from "@/lib/validation";
import { prettyError } from "@/lib/error-messages";

export const Route = createFileRoute("/reset-password")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Redefinir senha — Lovable Spark" },
      { name: "description", content: "Defina uma nova senha para sua conta." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: ResetPasswordPage,
});

function ResetPasswordPage() {
  const navigate = useNavigate();
  const [ready, setReady] = useState(false);
  const [pwd, setPwd] = useState("");
  const [confirm, setConfirm] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    // O Supabase publica o evento PASSWORD_RECOVERY quando o usuário chega
    // pelo link do email de recovery. Só habilitamos o form nesse caso.
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) setReady(true);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "PASSWORD_RECOVERY" || (event === "SIGNED_IN" && session)) setReady(true);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = passwordSchema.safeParse(pwd);
    if (!parsed.success) { toast.error(parsed.error.issues[0]?.message ?? "Senha inválida"); return; }
    if (pwd !== confirm) { toast.error("As senhas não coincidem"); return; }
    setSaving(true);
    const { error } = await supabase.auth.updateUser({ password: parsed.data });
    setSaving(false);
    if (error) { toast.error(prettyError(error)); return; }
    toast.success("Senha redefinida! Faça login novamente.");
    await supabase.auth.signOut();
    navigate({ to: "/auth" });
  };

  return (
    <div className="mx-auto max-w-md px-4 py-16">
      <Card className="p-8">
        <div className="flex items-center gap-2 justify-center mb-6">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/15 text-primary">
            <Sparkles className="h-5 w-5" />
          </span>
          <span className="text-lg font-bold">Lovable <span className="text-primary">Spark</span></span>
        </div>
        <h1 className="text-2xl font-bold text-center">Redefinir senha</h1>
        <p className="text-sm text-muted-foreground text-center mt-2">
          Escolha uma nova senha com pelo menos 8 caracteres.
        </p>

        {!ready ? (
          <div className="mt-8 flex items-center justify-center text-sm text-muted-foreground">
            <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Validando link…
          </div>
        ) : (
          <form onSubmit={submit} className="mt-6 space-y-3">
            <div>
              <Label htmlFor="pwd">Nova senha</Label>
              <Input id="pwd" type="password" required minLength={8} maxLength={72} value={pwd} onChange={(e) => setPwd(e.target.value)} autoComplete="new-password" />
            </div>
            <div>
              <Label htmlFor="confirm">Confirmar senha</Label>
              <Input id="confirm" type="password" required minLength={8} maxLength={72} value={confirm} onChange={(e) => setConfirm(e.target.value)} autoComplete="new-password" />
            </div>
            <Button type="submit" className="w-full" disabled={saving}>
              {saving ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Salvando</> : <><ShieldCheck className="mr-2 h-4 w-4" /> Redefinir senha</>}
            </Button>
          </form>
        )}
      </Card>
    </div>
  );
}