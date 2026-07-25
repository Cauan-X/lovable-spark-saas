import { createFileRoute, Link, Outlet, useNavigate, useRouterState } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Loader2, Shield, Users, Key, LayoutDashboard, LogOut } from "lucide-react";
import { Logo } from "@/components/logo";
import { supabase } from "@/integrations/supabase/client";
import { useUser, initialsOf } from "@/hooks/use-user";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/admin")({
  ssr: false,
  head: () => ({ meta: [{ title: "Admin — Lovable Spark" }, { name: "robots", content: "noindex" }] }),
  beforeLoad: async () => {
    const { data } = await supabase.auth.getSession();
    if (!data.session) throw new Error("Not authenticated");
    const { data: role } = await supabase.rpc("is_admin", { user_id: data.session.user.id });
    if (!role) throw new Error("Acesso restrito a administradores");
  },
  component: AdminLayout,
});

const NAV = [
  { to: "/admin", label: "Visão geral", icon: LayoutDashboard, exact: true },
  { to: "/admin/users", label: "Usuários", icon: Users },
  { to: "/admin/licenses", label: "Licenças", icon: Key },
];

function AdminLayout() {
  const navigate = useNavigate();
  const { user, profile, avatarUrl, loading } = useUser();
  const [checking, setChecking] = useState(true);
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => {
    if (!loading) {
      if (!user) {
        navigate({ to: "/auth", replace: true });
      } else {
        supabase.rpc("is_admin", { user_id: user.id }).then(({ data }) => {
          if (!data) navigate({ to: "/dashboard", replace: true });
          else setChecking(false);
        });
      }
    }
  }, [loading, user, navigate]);

  if (loading || checking) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background text-muted-foreground">
        <Loader2 className="h-5 w-5 animate-spin mr-2" /> Verificando acesso…
      </div>
    );
  }

  const displayName = profile?.full_name || user!.email?.split("@")[0] || "Admin";
  const initials = initialsOf(profile?.full_name, user!.email);

  const signOut = async () => {
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  };

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      <aside className="fixed inset-y-0 left-0 z-30 w-56 border-r border-white/[0.06] bg-[#0a0a0f]">
        <div className="flex h-full flex-col gap-6 p-4">
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-amber-400" />
            <span className="text-sm font-semibold tracking-tight">Admin Spark</span>
          </div>

          <nav className="flex flex-col gap-1">
            {NAV.map((item) => {
              const active = item.exact ? pathname === item.to : pathname.startsWith(item.to);
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={cn(
                    "flex items-center gap-3 rounded-md px-3 py-2 text-[13px] transition-colors",
                    active ? "bg-white/[0.06] text-foreground" : "text-muted-foreground hover:text-foreground hover:bg-white/[0.03]",
                  )}
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="mt-auto space-y-2">
            <Link
              to="/dashboard"
              className="flex items-center gap-3 rounded-md px-3 py-2 text-[13px] text-muted-foreground hover:text-foreground hover:bg-white/[0.03]"
            >
              <LayoutDashboard className="h-4 w-4" /> Dashboard
            </Link>
            <div className="flex items-center gap-3 rounded-lg border border-white/[0.06] bg-white/[0.02] p-3">
              <Avatar className="h-8 w-8">
                {avatarUrl && <AvatarImage src={avatarUrl} />}
                <AvatarFallback className="bg-primary/15 text-primary text-[10px]">{initials}</AvatarFallback>
              </Avatar>
              <div className="min-w-0 flex-1">
                <div className="truncate text-[12px] font-medium">{displayName}</div>
                <button onClick={signOut} className="flex items-center gap-1 text-[10px] text-muted-foreground hover:text-destructive">
                  <LogOut className="h-3 w-3" /> Sair
                </button>
              </div>
            </div>
          </div>
        </div>
      </aside>

      <div className="flex-1 lg:pl-56">
        <motion.main
          key={pathname}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className="mx-auto max-w-6xl px-5 py-8"
        >
          <Outlet />
        </motion.main>
      </div>
    </div>
  );
}
