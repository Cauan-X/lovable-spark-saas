-- Tabela de papéis de usuário para controle de acesso admin
CREATE TABLE IF NOT EXISTS user_roles (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  role       TEXT NOT NULL CHECK (role IN ('admin', 'support', 'viewer')),
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_user_roles_user_id ON user_roles(user_id);
CREATE INDEX IF NOT EXISTS idx_user_roles_role ON user_roles(role);

-- Unique constraint: um papel por usuário
CREATE UNIQUE INDEX IF NOT EXISTS idx_user_roles_user_id_unique ON user_roles(user_id);

-- Função auxiliar para verificar se um usuário é admin
CREATE OR REPLACE FUNCTION is_admin(user_id UUID)
RETURNS BOOLEAN AS $$
  SELECT EXISTS (SELECT 1 FROM user_roles WHERE user_id = $1 AND role = 'admin');
$$ LANGUAGE sql SECURITY DEFINER;

-- Função para listar usuários com seus papéis (apenas admin pode chamar)
CREATE OR REPLACE FUNCTION list_users_with_roles()
RETURNS TABLE (
  id UUID,
  email TEXT,
  created_at TIMESTAMPTZ,
  role TEXT
) SECURITY DEFINER AS $$
BEGIN
  IF NOT is_admin(auth.uid()) THEN
    RAISE EXCEPTION 'Apenas administradores podem listar usuários';
  END IF;
  RETURN QUERY
    SELECT
      u.id,
      u.email::TEXT,
      u.created_at,
      ur.role
    FROM auth.users u
    LEFT JOIN user_roles ur ON ur.user_id = u.id
    ORDER BY u.created_at DESC;
END;
$$ LANGUAGE plpgsql;

-- Função para definir papel de um usuário (apenas admin)
CREATE OR REPLACE FUNCTION set_user_role(target_user_id UUID, new_role TEXT)
RETURNS VOID SECURITY DEFINER AS $$
BEGIN
  IF NOT is_admin(auth.uid()) THEN
    RAISE EXCEPTION 'Apenas administradores podem alterar papéis';
  END IF;
  IF new_role NOT IN ('admin', 'support', 'viewer') THEN
    RAISE EXCEPTION 'Papel inválido: %', new_role;
  END IF;
  INSERT INTO user_roles (user_id, role)
  VALUES (target_user_id, new_role)
  ON CONFLICT (user_id) DO UPDATE SET role = new_role;
END;
$$ LANGUAGE plpgsql;
