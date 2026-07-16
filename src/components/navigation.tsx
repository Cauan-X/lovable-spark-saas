import { Link, useNavigate } from "@tanstack/react-router";
import { Menu, X, User as UserIcon, Settings, LayoutDashboard, LogOut } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { NAV_LINKS } from "@/lib/site-data";
import { Logo } from "@/components/logo";
import { useUser, initialsOf } from "@/hooks/use-user";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";

export function Navigation() {
  const [open, setOpen] = useState(false);
  const { user, profile, avatarUrl } = useUser();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const signOut = async () => {
    try {
      await queryClient.cancelQueries();
      queryClient.clear();
    } catch {
      /* no-op */
    }
    await supabase.auth.signOut();
    navigate({ to: "/", replace: true });
  };
  const displayName = profile?.full_name || user?.email?.split("@")[0] || "";
  const initials = initialsOf(profile?.full_name, user?.email);

  const UserMenu = user ? (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex items-center gap-2 rounded-full p-1 pr-3 hover:bg-white/[0.04] transition-colors">
          <Avatar className="h-7 w-7">
            {avatarUrl && <AvatarImage src={avatarUrl} alt={displayName} />}
            <AvatarFallback className="bg-primary/15 text-primary text-[10px]">{initials}</AvatarFallback>
          </Avatar>
          <span className="text-[13px] font-medium max-w-[120px] truncate">{displayName}</span>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel className="font-normal">
          <div className="text-sm font-medium truncate">{displayName}</div>
          <div className="text-xs text-muted-foreground truncate">{user.email}</div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild><Link to="/dashboard/profile"><UserIcon className="mr-2 h-4 w-4" /> Meu perfil</Link></DropdownMenuItem>
        <DropdownMenuItem asChild><Link to="/dashboard"><LayoutDashboard className="mr-2 h-4 w-4" /> Dashboard</Link></DropdownMenuItem>
        <DropdownMenuItem asChild><Link to="/dashboard/settings"><Settings className="mr-2 h-4 w-4" /> Configurações</Link></DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={signOut} className="text-destructive focus:text-destructive">
          <LogOut className="mr-2 h-4 w-4" /> Sair
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  ) : null;

  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/[0.06] bg-background/70 backdrop-blur-xl">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-6">
        <div className="flex items-center gap-4">
          {user && (
            <div className="md:hidden">
              <Avatar className="h-7 w-7">
                {avatarUrl && <AvatarImage src={avatarUrl} alt={displayName} />}
                <AvatarFallback className="bg-primary/15 text-primary text-[10px]">{initials}</AvatarFallback>
              </Avatar>
            </div>
          )}
          <Logo size={26} />
        </div>

        <nav className="hidden md:flex items-center gap-1">
          {NAV_LINKS.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className="px-3 py-1.5 rounded-md text-[13px] text-muted-foreground hover:text-foreground transition-colors"
              activeProps={{ className: "px-3 py-1.5 rounded-md text-[13px] text-foreground" }}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-2">
          {user ? (
            UserMenu
          ) : (
            <>
              <Link to="/auth" className="text-[13px] text-muted-foreground hover:text-foreground transition-colors px-3 py-1.5">
                Entrar
              </Link>
              <Link to="/" hash="pricing">
                <Button size="sm" className="h-8 rounded-md bg-white text-black hover:bg-white/90 text-[13px] font-medium px-3.5">
                  Ver planos
                </Button>
              </Link>
            </>
          )}
        </div>

        <button className="md:hidden p-2" onClick={() => setOpen(!open)} aria-label="Menu">
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <div className="md:hidden border-t border-white/[0.06] px-6 py-4 space-y-1 bg-background">
          {NAV_LINKS.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              onClick={() => setOpen(false)}
              className="block px-3 py-2 rounded-md text-sm text-muted-foreground hover:text-foreground hover:bg-white/[0.04]"
            >
              {l.label}
            </Link>
          ))}
          {user ? (
            <>
              <Link to="/dashboard/profile" onClick={() => setOpen(false)} className="block px-3 py-2 rounded-md text-sm text-muted-foreground hover:text-foreground hover:bg-white/[0.04]">Meu perfil</Link>
              <Link to="/dashboard/settings" onClick={() => setOpen(false)} className="block px-3 py-2 rounded-md text-sm text-muted-foreground hover:text-foreground hover:bg-white/[0.04]">Configurações</Link>
              <button onClick={() => { setOpen(false); signOut(); }} className="block w-full text-left px-3 py-2 rounded-md text-sm text-destructive hover:bg-white/[0.04]">Sair</button>
            </>
          ) : (
            <>
              <Link to="/auth" onClick={() => setOpen(false)}>
                <Button size="sm" variant="outline" className="w-full mt-2">Entrar</Button>
              </Link>
              <Link to="/" hash="pricing" onClick={() => setOpen(false)}>
                <Button size="sm" className="w-full mt-2 bg-white text-black hover:bg-white/90">Ver planos</Button>
              </Link>
            </>
          )}
        </div>
      )}
    </header>
  );
}