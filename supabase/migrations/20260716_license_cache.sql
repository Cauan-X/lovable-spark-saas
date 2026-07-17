-- Cache temporário de chaves de licença (raw key) para exibição no pós-compra
-- As chaves são limpas automaticamente após 2h ou pela cron abaixo
CREATE TABLE IF NOT EXISTS license_keys_cache (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  transaction_id TEXT NOT NULL UNIQUE,
  license_key   TEXT NOT NULL,
  plan_slug     TEXT NOT NULL,
  expires_at    TIMESTAMPTZ,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Índice para consulta rápida por transaction_id
CREATE INDEX IF NOT EXISTS idx_license_keys_cache_txid ON license_keys_cache(transaction_id);

-- Cron: limpa cache com mais de 2 horas a cada 30 minutos
SELECT cron.schedule('clean-license-cache', '*/30 * * * *',
  $$DELETE FROM license_keys_cache WHERE created_at < now() - interval '2 hours';$$
);
