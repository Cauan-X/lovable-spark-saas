
-- ============ extension_versions ============
CREATE TABLE public.extension_versions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  version TEXT NOT NULL UNIQUE,
  crx_path TEXT NOT NULL,
  changelog TEXT,
  is_latest BOOLEAN NOT NULL DEFAULT false,
  published_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.extension_versions TO authenticated;
GRANT ALL ON public.extension_versions TO service_role;
ALTER TABLE public.extension_versions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "authenticated can read versions" ON public.extension_versions
  FOR SELECT TO authenticated USING (true);

CREATE UNIQUE INDEX one_latest_version ON public.extension_versions (is_latest) WHERE is_latest = true;

INSERT INTO public.extension_versions (version, crx_path, changelog, is_latest, published_at) VALUES
('3.1.0', '/downloads/spark-v3.1.0.crx',
'✨ Novo motor de sugestões IA com 2x mais velocidade
🛡️ Correções de segurança e melhorias de estabilidade
🎨 Atalhos de teclado no editor Lovable
🐞 Correção de bug ao colar prompts longos', true, now());

-- ============ user_roles ============
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

CREATE TABLE public.user_roles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role app_role NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "users read own roles" ON public.user_roles
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN LANGUAGE SQL STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;

CREATE OR REPLACE FUNCTION public.is_admin(user_id UUID)
RETURNS BOOLEAN LANGUAGE SQL STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT public.has_role(user_id, 'admin'::app_role)
$$;

-- Admins can also read all roles
CREATE POLICY "admins read all roles" ON public.user_roles
  FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'::app_role));
