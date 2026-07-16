import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { z } from "zod";
import { zodValidator } from "@tanstack/zod-adapter";
import { useServerFn } from "@tanstack/react-start";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Loader2, CheckCircle2, ArrowUpRight, CreditCard, Trash2, AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useUser } from "@/hooks/use-user";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { deleteMyAccount } from "@/lib/account.functions";
import { prettyError } from "@/lib/error-messages";
import { useQueryClient } from "@tanstack/react-query";

const searchSchema = z.object({
  tab: z.enum(["profile", "security", "subscription", "notifications"]).optional(),
});

export const Route = createFileRoute("/dashboard/settings")({
  validateSearch: zodValidator(searchSchema),
  component: SettingsPage,
});

const PLAN_LABEL: Record<string, string> = { monthly: "Mensal", quarterly: "Trimestral", annual: "Anual" };

function SettingsPage() {
  const { user, profile, refresh } = useUser();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const deleteAccount = useServerFn(deleteMyAccount);
  const [deleting, setDeleting] = useState(false);
  const [confirmText, setConfirmText] = useState("");
  const { tab } = Route.useSearch();
  const [active, setActive] = useState(tab ?? "profile");
  useEffect(() => { if (tab) setActive(tab); }, [tab]);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [saving, setSaving] = useState(false);
  const [pwd, setPwd] = useState("");
  const [notifs, setNotifs] = useState({ product: true, marketing: false, security: true });
  const [sub, setSub] = useState<{ plan_slug: string; status: string; expires_at: string | null } | null>(null);

  useEffect(() => {
    setName(profile?.full_name ?? "");
    setPhone(profile?.phone ?? "");
  }, [profile]);

  useEffect(() => {
    if (!user) return;
    supabase.from("subscriptions").select("plan_slug,status,expires_at").eq("user_id", user.id).order("created_at", { ascending: false }).limit(1).then(({ data }) => {
      setSub((data?.[0] as typeof sub) ?? null);
    });
  }, [user]);

  if (!user) return null;

  const saveProfile = async () => {
    setSaving(true);
    const { error } = await supabase.from("profiles").upsert({
      id: user.id, full_name: name || null, phone: phone || null, email: user.email,
    });
    setSaving(false);
    if (error) return toast.error(error.message);
    await refresh();
    toast.success("Salvo");
  };

  const changePassword = async () => {
    if (pwd.length < 8) return toast.error("Mínimo 8 caracteres");
    const { error } = await supabase.auth.updateUser({ password: pwd });
    if (error) return toast.error(error.message);
    setPwd("");
    toast.success("Senha atualizada");
  };

  const onDeleteAccount = async () => {
    if (confirmText.trim().toUpperCase() !== "EXCLUIR") {
      return toast.error("Digite EXCLUIR para confirmar");
    }
    setDeleting(true);
    try {
      await deleteAccount();
      try {
        await queryClient.cancelQueries();
        queryClient.clear();
      } catch {
        /* no-op */
      }
      await supabase.auth.signOut();
      toast.success("Sua conta foi excluída.");
      navigate({ to: "/", replace: true });
    } catch (err) {
      toast.error(prettyError(err, "Não foi possível excluir sua conta."));
      setDeleting(false);
    }
  };

  const planLabel = sub ? PLAN_LABEL[sub.plan_slug] ?? sub.plan_slug : null;
  const expires = sub?.expires_at ? new Date(sub.expires_at).toLocaleDateString("pt-BR") : null;

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-display font-semibold tracking-tight">Configurações</h1>
        <p className="mt-1 text-sm text-muted-foreground">Gerencie sua conta, segurança e assinatura.</p>
      </div>

      <Tabs value={active} onValueChange={(v) => setActive(v as typeof active)}>
        <TabsList className="grid grid-cols-2 sm:grid-cols-4 w-full">
          <TabsTrigger value="profile">Perfil</TabsTrigger>
          <TabsTrigger value="security">Segurança</TabsTrigger>
          <TabsTrigger value="subscription">Assinatura</TabsTrigger>
          <TabsTrigger value="notifications">Notificações</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="mt-5">
          <Card className="glass-card p-6 space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div><Label>Nome</Label><Input value={name} onChange={(e) => setName(e.target.value)} /></div>
              <div><Label>Email</Label><Input value={user.email ?? ""} disabled /></div>
              <div className="sm:col-span-2"><Label>Telefone</Label><Input value={phone} onChange={(e) => setPhone(e.target.value)} /></div>
            </div>
            <div className="flex justify-end">
              <Button onClick={saveProfile} disabled={saving} className="bg-gradient-brand bg-gradient-brand-hover text-white">
                {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} Salvar
              </Button>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="mt-5">
          <Card className="glass-card p-6 space-y-4">
            <div>
              <h3 className="font-medium">Alterar senha</h3>
              <p className="text-sm text-muted-foreground">Escolha uma senha forte com pelo menos 8 caracteres.</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <Input type="password" value={pwd} onChange={(e) => setPwd(e.target.value)} placeholder="Nova senha" />
              <Button onClick={changePassword} disabled={!pwd} variant="outline">Atualizar</Button>
            </div>
          </Card>

          <Card className="mt-5 border-destructive/30 bg-destructive/[0.03] p-6 space-y-4">
            <div className="flex items-start gap-3">
              <div className="flex h-9 w-9 flex-none items-center justify-center rounded-md bg-destructive/15 text-destructive">
                <AlertTriangle className="h-4 w-4" />
              </div>
              <div>
                <h3 className="font-medium">Zona de perigo</h3>
                <p className="text-sm text-muted-foreground">
                  A exclusão apaga permanentemente sua conta, licenças, faturas e todos os dados
                  associados. Esta ação é irreversível (LGPD).
                </p>
              </div>
            </div>
            <div className="flex justify-end">
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="outline" className="border-destructive/40 text-destructive hover:bg-destructive/10 hover:text-destructive">
                    <Trash2 className="mr-2 h-4 w-4" /> Excluir minha conta
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Excluir sua conta permanentemente?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Todos os seus dados serão apagados: perfil, assinaturas, licenças, faturas e
                      histórico. Não é possível desfazer.
                      <br /><br />
                      Digite <strong>EXCLUIR</strong> para confirmar.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <Input
                    placeholder="EXCLUIR"
                    value={confirmText}
                    onChange={(e) => setConfirmText(e.target.value)}
                    autoComplete="off"
                  />
                  <AlertDialogFooter>
                    <AlertDialogCancel onClick={() => setConfirmText("")}>Cancelar</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={(e) => { e.preventDefault(); onDeleteAccount(); }}
                      disabled={deleting}
                      className="bg-destructive hover:bg-destructive/90"
                    >
                      {deleting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      Excluir definitivamente
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="subscription" className="mt-5">
          <Card className="glass-card p-6">
            <div className="flex items-center gap-2 text-[11px] uppercase tracking-wider text-muted-foreground">
              <CreditCard className="h-3.5 w-3.5" /> Plano atual
            </div>
            <div className="mt-3 flex items-start justify-between gap-4 flex-wrap">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-xl font-display font-semibold">{planLabel ?? "Sem plano ativo"}</h3>
                  {sub && (
                    <Badge className="bg-primary/15 text-primary border-0">
                      <CheckCircle2 className="h-3 w-3 mr-1" /> {sub.status}
                    </Badge>
                  )}
                </div>
                <p className="mt-1 text-sm text-muted-foreground">
                  {expires ? `Próximo pagamento em ${expires}` : "Assine um plano para ativar sua licença."}
                </p>
              </div>
              <div className="flex gap-2">
                <Link to="/contact"><Button variant="outline">Gerenciar assinatura</Button></Link>
                <Link to="/" hash="pricing">
                  <Button className="bg-gradient-brand bg-gradient-brand-hover text-white">
                    Ver planos <ArrowUpRight className="ml-1 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="mt-5">
          <Card className="glass-card p-6 space-y-4">
            {[
              { key: "product", label: "Atualizações do produto", desc: "Novas versões e melhorias." },
              { key: "security", label: "Alertas de segurança", desc: "Novos logins e mudanças da conta." },
              { key: "marketing", label: "Ofertas e promoções", desc: "Descontos e novidades comerciais." },
            ].map((row) => (
              <div key={row.key} className="flex items-start justify-between gap-4">
                <div>
                  <div className="text-sm font-medium">{row.label}</div>
                  <div className="text-xs text-muted-foreground">{row.desc}</div>
                </div>
                <Switch
                  checked={notifs[row.key as keyof typeof notifs]}
                  onCheckedChange={(v) => setNotifs((n) => ({ ...n, [row.key]: v }))}
                />
              </div>
            ))}
            <div className="flex justify-end">
              <Button variant="outline" onClick={() => toast.success("Preferências salvas")}>Salvar preferências</Button>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}