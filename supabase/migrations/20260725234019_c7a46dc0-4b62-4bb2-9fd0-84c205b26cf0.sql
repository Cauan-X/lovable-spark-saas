-- 1. Subscriptions: clients must not be able to create/activate their own subscription
DROP POLICY IF EXISTS "own subs insert" ON public.subscriptions;
REVOKE INSERT, UPDATE, DELETE ON public.subscriptions FROM authenticated;
GRANT SELECT ON public.subscriptions TO authenticated;
GRANT ALL ON public.subscriptions TO service_role;

-- 2. License key cache: server-only table referenced by the checkout lookup
CREATE TABLE IF NOT EXISTS public.license_keys_cache (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  transaction_id TEXT NOT NULL UNIQUE,
  license_key TEXT NOT NULL,
  plan_slug TEXT NOT NULL,
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT ALL ON public.license_keys_cache TO service_role;

ALTER TABLE public.license_keys_cache ENABLE ROW LEVEL SECURITY;
-- No policies on purpose: only the service role (which bypasses RLS) may read/write.

-- 3. SECURITY DEFINER functions must not be callable by anonymous visitors
REVOKE ALL ON FUNCTION public.has_role(uuid, public.app_role) FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION public.is_admin(uuid) FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION public.delete_my_account() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.is_admin(uuid) TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.delete_my_account() TO authenticated;