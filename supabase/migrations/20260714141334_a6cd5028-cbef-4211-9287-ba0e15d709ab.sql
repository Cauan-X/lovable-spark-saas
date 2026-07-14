-- Segurança: endurecer tabela contacts, adicionar CHECK constraints e índices para RLS.

-- 1) CHECK constraints em contacts (limita tamanho e formato do email).
ALTER TABLE public.contacts
  ADD CONSTRAINT contacts_name_length CHECK (char_length(name) BETWEEN 1 AND 100),
  ADD CONSTRAINT contacts_subject_length CHECK (char_length(subject) BETWEEN 1 AND 150),
  ADD CONSTRAINT contacts_message_length CHECK (char_length(message) BETWEEN 10 AND 2000),
  ADD CONSTRAINT contacts_email_length CHECK (char_length(email) BETWEEN 3 AND 254),
  ADD CONSTRAINT contacts_email_format CHECK (email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$');

-- 2) Revogar INSERT anônimo/authenticated direto — agora só via server function (service_role).
DROP POLICY IF EXISTS "anyone insert contacts" ON public.contacts;
REVOKE INSERT ON public.contacts FROM anon, authenticated;

-- 3) Índices para acelerar leituras filtradas por RLS (auth.uid() = user_id).
CREATE INDEX IF NOT EXISTS subscriptions_user_id_idx ON public.subscriptions(user_id);
CREATE INDEX IF NOT EXISTS licenses_user_id_idx      ON public.licenses(user_id);
CREATE INDEX IF NOT EXISTS downloads_user_id_idx     ON public.downloads(user_id);

-- 4) Unicidade real da chave de licença (defesa em profundidade — a função já checa).
CREATE UNIQUE INDEX IF NOT EXISTS licenses_key_unique ON public.licenses(key);