CREATE TABLE public.devices (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  license_id UUID NOT NULL REFERENCES public.licenses(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  device_id TEXT NOT NULL,
  label TEXT,
  user_agent TEXT,
  blocked BOOLEAN NOT NULL DEFAULT false,
  last_seen_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (license_id, device_id)
);

CREATE INDEX idx_devices_user ON public.devices(user_id);
CREATE INDEX idx_devices_license ON public.devices(license_id);

GRANT SELECT ON public.devices TO authenticated;
GRANT ALL ON public.devices TO service_role;

ALTER TABLE public.devices ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Owners can view their devices"
ON public.devices FOR SELECT TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all devices"
ON public.devices FOR SELECT TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role));

CREATE TRIGGER devices_set_updated_at
BEFORE UPDATE ON public.devices
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();