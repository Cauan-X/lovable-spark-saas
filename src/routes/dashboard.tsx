import { createFileRoute, Link, Outlet, useNavigate, useRouterState } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { useQueryClient } from "@tanstack/react-query";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Home, User as UserIcon, Settings, LogOut, Loader2, Menu, X, LifeBuoy } from "lucide-react";
import { Logo } from "@/components/logo";
import { supabase } from "@/integrations/supabase/client";
import { useUser, initialsOf } from "@/hooks/use-user";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/dashboard")({
  ssr: false,
  head: () => ({ meta: [{ title: "Dashboard — Lovable Spark" }, { name: "robots", content: "noindex" }] }),
  component: DashboardLayout,
});

const NAV = [
  { to: "/dashboard", label: "Visão geral", icon: Home, exact: true },
  { to: "/dashboard/profile", label: "Meu perfil", icon: UserIcon },
  { to: "/dashboard/settings", label: "Configurações", icon: Settings },
];

function DashboardLayout() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user, profile, avatarUrl, loading } = useUser();
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => { setMobileOpen(false); }, [pathname]);

  useEffect(() => {
    if (!loading && !user) navigate({ to: "/auth" });
  }, [loading, user, navigate]);

  const signOut = async () => {
    // Higiene de logout: cancelar queries em voo (evita 401 storm),
    // limpar cache do React Query (evita restauração de dados protegidos via Back)
    // e só então encerrar a sessão Supabase.
    try {
      await queryClient.cancelQueries();
      queryClient.clear();
    } catch {
      /* no-op */
    }
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  };

  if (loading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background text-muted-foreground">
        <Loader2 className="h-5 w-5 animate-spin mr-2" /> Carregando…
      </div>
    );
  }

  const displayName = profile?.full_name || user.email?.split("@")[0] || "Usuário";
  const initials = initialsOf(profile?.full_name, user.email);

  const isActive = (to: string, exact?: boolean) => (exact ? pathname === to : pathname.startsWith(to));

  const SidebarInner = (
    <div className="flex h-full flex-col gap-6 p-5">
      <Logo size={28} wordmarkClassName="text-[15px] font-semibold tracking-tight font-display" />

      <nav className="flex flex-col gap-1">
        {NAV.map((item) => (
          <Link
            key={item.to}
            to={item.to}
            className={cn(
              "flex items-center gap-3 rounded-md px-3 py-2 text-[13px] transition-colors",
              isActive(item.to, item.exact)
                ? "bg-white/[0.06] text-foreground"
                : "text-muted-foreground hover:text-foreground hover:bg-white/[0.03]",
            )}
          >
            <item.icon className="h-4 w-4" />
            {item.label}
          </Link>
        ))}
      </nav>

      <div className="mt-auto">
        <Link
          to="/contact"
          className="flex items-center gap-3 rounded-md px-3 py-2 text-[13px] text-muted-foreground hover:text-foreground hover:bg-white/[0.03]"
        >
          <LifeBuoy className="h-4 w-4" /> Suporte
        </Link>
        <div className="mt-3 flex items-center gap-3 rounded-lg border border-white/[0.06] bg-white/[0.02] p-3">
          <Avatar className="h-9 w-9">
            {avatarUrl && <AvatarImage src={avatarUrl} alt={displayName} />}
            <AvatarFallback className="bg-primary/15 text-primary text-xs">{initials}</AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1">
            <div className="truncate text-[13px] font-medium">{displayName}</div>
            <div className="truncate text-[11px] text-muted-foreground">{user.email}</div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex fixed inset-y-0 left-0 z-30 w-64 border-r border-white/[0.06] bg-[#0a0a0f]">
        {SidebarInner}
      </aside>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="fixed inset-0 bg-black/60" onClick={() => setMobileOpen(false)} />
          <aside className="relative w-72 max-w-[80%] border-r border-white/[0.06] bg-[#0a0a0f]">{SidebarInner}</aside>
        </div>
      )}

      <div className="flex-1 lg:pl-64">
        <header className="sticky top-0 z-20 flex h-14 items-center justify-between gap-4 border-b border-white/[0.06] bg-background/70 px-5 backdrop-blur-xl">
          <div className="flex items-center gap-2">
            <button className="lg:hidden p-2 -ml-2" onClick={() => setMobileOpen(true)} aria-label="Abrir menu">
              <Menu className="h-5 w-5" />
            </button>
            <span className="text-[13px] text-muted-foreground hidden sm:inline">
              {NAV.find((n) => isActive(n.to, n.exact))?.label ?? "Dashboard"}
            </span>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-2 rounded-full p-1 pr-3 hover:bg-white/[0.04]">
                <Avatar className="h-7 w-7">
                  {avatarUrl && <AvatarImage src={avatarUrl} alt={displayName} />}
                  <AvatarFallback className="bg-primary/15 text-primary text-[10px]">{initials}</AvatarFallback>
                </Avatar>
                <span className="hidden sm:inline text-[13px] font-medium">{displayName}</span>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel className="font-normal">
                <div className="text-sm font-medium">{displayName}</div>
                <div className="text-xs text-muted-foreground truncate">{user.email}</div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild><Link to="/dashboard/profile"><UserIcon className="mr-2 h-4 w-4" /> Meu perfil</Link></DropdownMenuItem>
              <DropdownMenuItem asChild><Link to="/dashboard"><Home className="mr-2 h-4 w-4" /> Dashboard</Link></DropdownMenuItem>
              <DropdownMenuItem asChild><Link to="/dashboard/settings"><Settings className="mr-2 h-4 w-4" /> Configurações</Link></DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={signOut} className="text-destructive focus:text-destructive">
                <LogOut className="mr-2 h-4 w-4" /> Sair
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </header>

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

      {/* mobile menu close button — sr fallback */}
      <button className="sr-only" onClick={() => setMobileOpen(false)} aria-hidden><X /></button>
    </div>
  );
}