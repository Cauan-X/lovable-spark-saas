-- Tabela de versões da extensão para changelog dinâmico
CREATE TABLE IF NOT EXISTS extension_versions (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  version         TEXT NOT NULL UNIQUE,
  crx_path        TEXT NOT NULL,
  changelog       TEXT,
  published_at    TIMESTAMPTZ DEFAULT now(),
  is_latest       BOOLEAN DEFAULT false,
  min_app_version TEXT,
  download_count  INTEGER DEFAULT 0
);

CREATE INDEX IF NOT EXISTS idx_extension_versions_latest
  ON extension_versions(is_latest) WHERE is_latest = true;

-- Trigger: ao inserir nova versão como latest, desmarcar a anterior
CREATE OR REPLACE FUNCTION set_latest_extension_version()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.is_latest THEN
    UPDATE extension_versions SET is_latest = false WHERE id != NEW.id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_set_latest_extension_version ON extension_versions;
CREATE TRIGGER trg_set_latest_extension_version
  AFTER INSERT OR UPDATE OF is_latest ON extension_versions
  FOR EACH ROW EXECUTE FUNCTION set_latest_extension_version();

-- Seed: versão atual
INSERT INTO extension_versions (version, crx_path, changelog, is_latest)
VALUES (
  '3.1.0',
  '/downloads/spark-v3.1.0.crx',
  E'• Watermark Remover reescrito, 3x mais rápido\n• Prompt Optimizer com suporte a modelos personalizados\n• Redução de 40% no consumo de memória',
  true
) ON CONFLICT (version) DO NOTHING;
