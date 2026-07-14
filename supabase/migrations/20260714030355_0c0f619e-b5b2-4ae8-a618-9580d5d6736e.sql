
-- SUBSCRIPTIONS
CREATE TABLE public.subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  plan_slug TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.subscriptions TO authenticated;
GRANT ALL ON public.subscriptions TO service_role;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own subs select" ON public.subscriptions FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "own subs insert" ON public.subscriptions FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

-- LICENSES
CREATE TABLE public.licenses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  key TEXT NOT NULL UNIQUE,
  status TEXT NOT NULL DEFAULT 'active',
  activated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.licenses TO authenticated;
GRANT ALL ON public.licenses TO service_role;
ALTER TABLE public.licenses ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own licenses select" ON public.licenses FOR SELECT TO authenticated USING (auth.uid() = user_id);

-- DOWNLOADS
CREATE TABLE public.downloads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  version TEXT NOT NULL,
  downloaded_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT ON public.downloads TO authenticated;
GRANT ALL ON public.downloads TO service_role;
ALTER TABLE public.downloads ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own downloads select" ON public.downloads FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "own downloads insert" ON public.downloads FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

-- CONTACTS (anyone can submit)
CREATE TABLE public.contacts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT INSERT ON public.contacts TO anon, authenticated;
GRANT ALL ON public.contacts TO service_role;
ALTER TABLE public.contacts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "anyone insert contacts" ON public.contacts FOR INSERT TO anon, authenticated WITH CHECK (true);

-- License key generator
CREATE OR REPLACE FUNCTION public.generate_license_key()
RETURNS TEXT LANGUAGE plpgsql SET search_path = public AS $$
DECLARE
  chars TEXT := 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  seg TEXT;
  result TEXT := 'SPARK';
  i INT;
  j INT;
BEGIN
  FOR i IN 1..3 LOOP
    seg := '';
    FOR j IN 1..4 LOOP
      seg := seg || substr(chars, 1 + floor(random() * length(chars))::int, 1);
    END LOOP;
    result := result || '-' || seg;
  END LOOP;
  RETURN result;
END;
$$;

-- Trigger: when subscription becomes active, ensure a license exists for the user
CREATE OR REPLACE FUNCTION public.create_license_for_subscription()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  new_key TEXT;
BEGIN
  IF NEW.status = 'active' THEN
    IF NOT EXISTS (SELECT 1 FROM public.licenses WHERE user_id = NEW.user_id AND status = 'active') THEN
      LOOP
        new_key := public.generate_license_key();
        EXIT WHEN NOT EXISTS (SELECT 1 FROM public.licenses WHERE key = new_key);
      END LOOP;
      INSERT INTO public.licenses (user_id, key, status, expires_at)
      VALUES (NEW.user_id, new_key, 'active', NEW.expires_at);
    END IF;
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER subscriptions_create_license
AFTER INSERT OR UPDATE ON public.subscriptions
FOR EACH ROW EXECUTE FUNCTION public.create_license_for_subscription();
