import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Loader2, Upload, Save, ShieldCheck, Mail } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useUser, initialsOf } from "@/hooks/use-user";
import { nameSchema, phoneSchema, passwordSchema, otpNonceSchema } from "@/lib/validation";
import { prettyError } from "@/lib/error-messages";

// Whitelist de imagens seguras. SVG é rejeitado por permitir XSS quando servido inline.
const ALLOWED_AVATAR_MIME: Record<string, string> = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/webp": "webp",
};
const MAX_AVATAR_BYTES = 2 * 1024 * 1024;

export const Route = createFileRoute("/dashboard/profile")({
  component: ProfilePage,
});

function ProfilePage() {
  const { user, profile, avatarUrl, refresh } = useUser();
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [preview, setPreview] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);
  const [pwd, setPwd] = useState("");
  const [pwdConfirm, setPwdConfirm] = useState("");
  const [pwdSaving, setPwdSaving] = useState(false);
  // Reautenticação por nonce (código de 6 dígitos enviado por email) — fluxo oficial
  // do Supabase para trocar senha sem depender da senha atual (usuários magic link).
  const [reauthSent, setReauthSent] = useState(false);
  const [reauthNonce, setReauthNonce] = useState("");
  const [reauthSending, setReauthSending] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setFullName(profile?.full_name ?? "");
    setPhone(profile?.phone ?? "");
  }, [profile]);

  if (!user) return null;

  const initials = initialsOf(profile?.full_name, user.email);
  const shownAvatar = preview ?? avatarUrl;

  const onFile = (f: File) => {
    if (!(f.type in ALLOWED_AVATAR_MIME)) {
      toast.error("Formato inválido. Use PNG, JPG ou WEBP.");
      return;
    }
    if (f.size > MAX_AVATAR_BYTES) {
      toast.error("Imagem muito grande. Máximo 2MB.");
      return;
    }
    setFile(f);
    const r = new FileReader();
    r.onload = () => setPreview(r.result as string);
    r.readAsDataURL(f);
  };

  const save = async () => {
    const nameCheck = nameSchema.safeParse(fullName);
    if (fullName && !nameCheck.success) { toast.error(nameCheck.error.issues[0]?.message ?? "Nome inválido"); return; }
    const phoneCheck = phoneSchema.safeParse(phone);
    if (!phoneCheck.success) { toast.error("Telefone inválido"); return; }
    setSaving(true);
    try {
      let avatar_path = profile?.avatar_url ?? null;
      if (file) {
        // MIME já foi validado em onFile; deriva extensão a partir do MIME (não do nome do arquivo).
        const ext = ALLOWED_AVATAR_MIME[file.type];
        if (!ext) throw new Error("Formato inválido.");
        const rand = crypto.randomUUID();
        const path = `${user.id}/avatar-${rand}.${ext}`;
        const { error: upErr } = await supabase.storage.from("avatars").upload(path, file, {
          upsert: true,
          contentType: file.type,
          cacheControl: "3600",
        });
        if (upErr) throw upErr;
        avatar_path = path;
      }
      const { error } = await supabase.from("profiles").upsert({
        id: user.id,
        full_name: fullName || null,
        phone: phone || null,
        avatar_url: avatar_path,
        email: user.email,
      });
      if (error) throw error;
      setFile(null);
      setPreview(null);
      await refresh();
      toast.success("Perfil atualizado");
    } catch (e: unknown) {
      toast.error(prettyError(e, "Erro ao salvar"));
    } finally {
      setSaving(false);
    }
  };

  const requestReauth = async () => {
    setReauthSending(true);
    // Envia código de 6 dígitos ao email do usuário logado.
    const { error } = await supabase.auth.reauthenticate();
    setReauthSending(false);
    if (error) { toast.error(prettyError(error)); return; }
    setReauthSent(true);
    toast.success("Código enviado para o seu email.");
  };

  const changePassword = async () => {
    const pwdCheck = passwordSchema.safeParse(pwd);
    if (!pwdCheck.success) { toast.error(pwdCheck.error.issues[0]?.message ?? "Senha inválida"); return; }
    if (pwd !== pwdConfirm) { toast.error("As senhas não coincidem"); return; }
    const nonceCheck = otpNonceSchema.safeParse(reauthNonce);
    if (!nonceCheck.success) { toast.error("Informe o código de 6 dígitos enviado ao seu email"); return; }
    setPwdSaving(true);
    // updateUser({ password, nonce }) confirma o código de reautenticação e troca a senha
    // atomicamente. Sem o nonce válido o Supabase rejeita a alteração.
    const { error } = await supabase.auth.updateUser({ password: pwdCheck.data, nonce: nonceCheck.data });
    setPwdSaving(false);
    if (error) { toast.error(prettyError(error)); return; }
    setPwd("");
    setPwdConfirm("");
    setReauthNonce("");
    setReauthSent(false);
    toast.success("Senha alterada com sucesso.");
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-display font-semibold tracking-tight">Meu perfil</h1>
        <p className="mt-1 text-sm text-muted-foreground">Atualize suas informações e foto.</p>
      </div>

      <Card className="glass-card p-6">
        <div className="flex items-center gap-5">
          <Avatar className="h-20 w-20">
            {shownAvatar && <AvatarImage src={shownAvatar} alt="Avatar" />}
            <AvatarFallback className="bg-primary/15 text-primary text-lg">{initials}</AvatarFallback>
          </Avatar>
          <div>
            <Button variant="outline" size="sm" onClick={() => inputRef.current?.click()}>
              <Upload className="mr-2 h-4 w-4" /> Alterar foto
            </Button>
            <input
              ref={inputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => { const f = e.target.files?.[0]; if (f) onFile(f); }}
            />
            <p className="mt-2 text-xs text-muted-foreground">PNG ou JPG, até 2MB.</p>
          </div>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <div>
            <Label htmlFor="name">Nome completo</Label>
            <Input id="name" value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Seu nome" />
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input id="email" value={user.email ?? ""} disabled />
          </div>
          <div className="sm:col-span-2">
            <Label htmlFor="phone">Telefone</Label>
            <Input id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+55 11 90000-0000" />
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <Button onClick={save} disabled={saving} className="bg-gradient-brand bg-gradient-brand-hover text-white">
            {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
            Salvar alterações
          </Button>
        </div>
      </Card>

      <Card className="glass-card p-6">
        <h2 className="text-lg font-display font-semibold">Alterar senha</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Por segurança, enviamos um código de 6 dígitos ao seu email para confirmar a troca.
        </p>
        {!reauthSent ? (
          <div className="mt-4">
            <Button onClick={requestReauth} disabled={reauthSending} variant="outline">
              {reauthSending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Mail className="mr-2 h-4 w-4" />}
              Enviar código de verificação
            </Button>
          </div>
        ) : (
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <Label htmlFor="nonce">Código recebido por email</Label>
              <Input
                id="nonce"
                inputMode="numeric"
                maxLength={6}
                value={reauthNonce}
                onChange={(e) => setReauthNonce(e.target.value.replace(/\D/g, ""))}
                placeholder="000000"
                autoComplete="one-time-code"
              />
            </div>
            <div>
              <Label htmlFor="newpwd">Nova senha</Label>
              <Input id="newpwd" type="password" minLength={8} maxLength={72} value={pwd} onChange={(e) => setPwd(e.target.value)} autoComplete="new-password" />
            </div>
            <div>
              <Label htmlFor="confpwd">Confirmar senha</Label>
              <Input id="confpwd" type="password" minLength={8} maxLength={72} value={pwdConfirm} onChange={(e) => setPwdConfirm(e.target.value)} autoComplete="new-password" />
            </div>
            <div className="sm:col-span-2 flex flex-wrap gap-2">
              <Button onClick={changePassword} disabled={pwdSaving || !pwd || !pwdConfirm || !reauthNonce}>
                {pwdSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <ShieldCheck className="mr-2 h-4 w-4" />}
                Confirmar alteração
              </Button>
              <Button variant="ghost" onClick={() => { setReauthSent(false); setPwd(""); setPwdConfirm(""); setReauthNonce(""); }}>
                Cancelar
              </Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}