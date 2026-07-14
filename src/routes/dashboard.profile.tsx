import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Loader2, Upload, Save } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useUser, initialsOf } from "@/hooks/use-user";

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
  const [pwdSaving, setPwdSaving] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setFullName(profile?.full_name ?? "");
    setPhone(profile?.phone ?? "");
  }, [profile]);

  if (!user) return null;

  const initials = initialsOf(profile?.full_name, user.email);
  const shownAvatar = preview ?? avatarUrl;

  const onFile = (f: File) => {
    setFile(f);
    const r = new FileReader();
    r.onload = () => setPreview(r.result as string);
    r.readAsDataURL(f);
  };

  const save = async () => {
    setSaving(true);
    try {
      let avatar_path = profile?.avatar_url ?? null;
      if (file) {
        const ext = file.name.split(".").pop() || "png";
        const path = `${user.id}/avatar-${Date.now()}.${ext}`;
        const { error: upErr } = await supabase.storage.from("avatars").upload(path, file, { upsert: true });
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
      toast.error(e instanceof Error ? e.message : "Erro ao salvar");
    } finally {
      setSaving(false);
    }
  };

  const changePassword = async () => {
    if (pwd.length < 8) { toast.error("A senha deve ter pelo menos 8 caracteres"); return; }
    setPwdSaving(true);
    const { error } = await supabase.auth.updateUser({ password: pwd });
    setPwdSaving(false);
    if (error) { toast.error(error.message); return; }
    setPwd("");
    toast.success("Senha alterada");
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
        <p className="mt-1 text-sm text-muted-foreground">Defina uma nova senha para sua conta.</p>
        <div className="mt-4 flex flex-col sm:flex-row gap-3">
          <Input type="password" value={pwd} onChange={(e) => setPwd(e.target.value)} placeholder="Nova senha (mín. 8 caracteres)" />
          <Button onClick={changePassword} disabled={pwdSaving || !pwd} variant="outline">
            {pwdSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} Atualizar
          </Button>
        </div>
      </Card>
    </div>
  );
}