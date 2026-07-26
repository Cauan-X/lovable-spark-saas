-- Fix trigger to consider expired licenses when checking for existing active licenses

CREATE OR REPLACE FUNCTION public.create_license_for_subscription()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  new_key TEXT;
BEGIN
  IF NEW.status = 'active' THEN
    -- Expire any active-but-expired licenses for this user
    UPDATE public.licenses
    SET status = 'expired'
    WHERE user_id = NEW.user_id
      AND status = 'active'
      AND expires_at IS NOT NULL
      AND expires_at <= NOW();

    -- Only create new license if user has no truly active (non-expired) license
    IF NOT EXISTS (
      SELECT 1 FROM public.licenses
      WHERE user_id = NEW.user_id
        AND status = 'active'
        AND (expires_at IS NULL OR expires_at > NOW())
    ) THEN
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
