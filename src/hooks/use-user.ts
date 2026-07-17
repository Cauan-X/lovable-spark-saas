import { useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

export type Profile = {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  phone: string | null;
  email: string | null;
};

async function signedUrl(path: string | null | undefined) {
  if (!path) return null;
  if (path.startsWith("http")) return path;
  try {
    const { data } = await supabase.storage.from("avatars").createSignedUrl(path, 60 * 60);
    return data?.signedUrl ?? null;
  } catch (error) {
    console.warn("Unable to load avatar signed URL", error);
    return null;
  }
}

export function useUser() {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const load = async (u: User | null) => {
    if (!u) { setProfile(null); setAvatarUrl(null); return; }
    try {
      const { data } = await supabase.from("profiles").select("*").eq("id", u.id).maybeSingle();
      const p = (data as Profile | null) ?? { id: u.id, full_name: null, avatar_url: null, phone: null, email: u.email ?? null };
      setProfile(p);
      setAvatarUrl(await signedUrl(p.avatar_url));
    } catch (error) {
      console.warn("Unable to load user profile", error);
      setProfile({ id: u.id, full_name: null, avatar_url: null, phone: null, email: u.email ?? null });
      setAvatarUrl(null);
    }
  };

  useEffect(() => {
    let alive = true;
    let unsubscribe: (() => void) | undefined;

    const init = async () => {
      try {
        const { data } = await supabase.auth.getSession();
        if (!alive) return;
        setUser(data.session?.user ?? null);
        await load(data.session?.user ?? null);

        const { data: sub } = supabase.auth.onAuthStateChange(async (_e, session) => {
          setUser(session?.user ?? null);
          await load(session?.user ?? null);
        });
        unsubscribe = () => sub.subscription.unsubscribe();
      } catch (error) {
        console.warn("Authentication is unavailable on this build", error);
        if (!alive) return;
        setUser(null);
        setProfile(null);
        setAvatarUrl(null);
      } finally {
        if (alive) setLoading(false);
      }
    };

    init();
    return () => { alive = false; unsubscribe?.(); };
  }, []);

  const refresh = async () => { await load(user); };

  return { user, profile, avatarUrl, loading, refresh };
}

export function initialsOf(name?: string | null, email?: string | null) {
  const base = (name?.trim() || email?.split("@")[0] || "U").trim();
  return base.split(/\s+/).map((s) => s[0]).join("").slice(0, 2).toUpperCase();
}