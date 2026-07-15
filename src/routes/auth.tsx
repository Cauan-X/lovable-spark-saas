import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Sparkles, Loader2, Mail, Check } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";
import { emailSchema } from "@/lib/validation";
import { prettyError } from "@/lib/error-messages";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Entrar — Lovable Spark" },
      { name: "description", content: "Acesse sua área do cliente Lovable Spark." },
    ],
  }),
  validateSearch: (s: Record<string, unknown>) => ({
    next: typeof s.next === "string" ? s.next : "",
  }),
  component: AuthPage,
});

// Only accept same-origin relative paths to prevent open-redirects.
function safeNext(next: string): string {
  if (!next.startsWith("/") || next.startsWith("//")) return "/dashboard";
  return next;
}

function AuthPage() {
  const navigate = useNavigate();
  const { next } = Route.useSearch();
  const target = safeNext(next);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [resetting, setResetting] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) window.location.href = target;
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      if (session) window.location.href = target;
    });
    return () => sub.subscription.unsubscribe();
  }, [navigate, target]);

  const onMagicLink = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = emailSchema.safeParse(email);
    if (!parsed.success) { toast.error(parsed.error.issues[0]?.message ?? "Email inválido"); return; }
    setLoading(true);
    const { error } = await supabase.auth.signInWithOtp({
      email: parsed.data,
      options: { emailRedirectTo: `${window.location.origin}${target}` },
    });
    setLoading(false);
    if (error) { toast.error(prettyError(error)); return; }
    setSent(true);
    toast.success("Link mágico enviado! Verifique seu email.");
  };

  const onForgotPassword = async () => {
    const parsed = emailSchema.safeParse(email);
    if (!parsed.success) { toast.error("Informe seu email para receber o link de redefinição."); return; }
    setResetting(true);
    const { error } = await supabase.auth.resetPasswordForEmail(parsed.data, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    setResetting(false);
    if (error) { toast.error(prettyError(error)); return; }
    toast.success("Se este email existir, enviaremos um link para redefinir a senha.");
  };

  const onGoogle = async () => {
    const result = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: `${window.location.origin}/auth?next=${encodeURIComponent(target)}`,
    });
    if (result.error) toast.error("Falha ao entrar com Google");
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
        <h1 className="text-2xl font-bold text-center">Entrar na sua conta</h1>
        <p className="text-sm text-muted-foreground text-center mt-2">
          Acesse sua licença, downloads e suporte.
        </p>

        {sent ? (
          <div className="mt-8 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/15 text-primary mb-3">
              <Check className="h-5 w-5" />
            </div>
            <p className="font-medium">Link enviado para {email}</p>
            <p className="text-sm text-muted-foreground mt-1">Clique no link do email para entrar.</p>
          </div>
        ) : (
          <>
            <Button variant="outline" className="w-full mt-6" onClick={onGoogle}>
              <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24"><path fill="currentColor" d="M22.5 12.3c0-.8-.1-1.5-.2-2.3H12v4.3h5.9c-.3 1.4-1.1 2.6-2.3 3.4v2.8h3.7c2.1-2 3.3-4.9 3.3-8.2z"/><path fill="currentColor" d="M12 23c3.1 0 5.7-1 7.6-2.8l-3.7-2.8c-1 .7-2.3 1.1-3.9 1.1-3 0-5.5-2-6.4-4.7H1.7v2.9C3.6 20.4 7.5 23 12 23z"/><path fill="currentColor" d="M5.6 13.8c-.2-.7-.4-1.4-.4-2.2s.1-1.5.4-2.2V6.5H1.7C.9 8 .5 9.9.5 12s.4 4 1.2 5.5l3.9-3.7z"/><path fill="currentColor" d="M12 5.4c1.7 0 3.2.6 4.4 1.7l3.3-3.3C17.7 1.9 15.1 1 12 1 7.5 1 3.6 3.6 1.7 6.5l3.9 3c.9-2.7 3.4-4.1 6.4-4.1z"/></svg>
              Continuar com Google
            </Button>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-border" /></div>
              <div className="relative flex justify-center text-xs"><span className="bg-card px-2 text-muted-foreground">ou por email</span></div>
            </div>

            <form onSubmit={onMagicLink} className="space-y-3">
              <div>
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" maxLength={254} required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="voce@email.com" />
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Enviando</> : <><Mail className="mr-2 h-4 w-4" /> Enviar link mágico</>}
              </Button>
              <button
                type="button"
                onClick={onForgotPassword}
                disabled={resetting}
                className="w-full text-center text-xs text-muted-foreground hover:text-foreground underline underline-offset-4 disabled:opacity-50"
              >
                {resetting ? "Enviando link…" : "Esqueci minha senha"}
              </button>
            </form>
          </>
        )}
      </Card>
    </div>
  );
}