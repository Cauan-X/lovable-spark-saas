// Sanitiza mensagens vindas do Supabase / rede antes de mostrar ao usuário.
// Evita vazamento de detalhes internos (stack, códigos, chaves).

const KNOWN: Record<string, string> = {
  "Invalid login credentials": "Credenciais inválidas.",
  "Email not confirmed": "Confirme seu email antes de entrar.",
  "User already registered": "Este email já está cadastrado.",
  "Password should be at least 6 characters.": "A senha deve ter pelo menos 8 caracteres.",
  "New password should be different from the old password.": "A nova senha deve ser diferente da atual.",
  "Signup requires a valid password": "Informe uma senha válida.",
  "For security purposes, you can only request this after 60 seconds.":
    "Aguarde alguns segundos antes de tentar novamente.",
};

export function prettyError(error: unknown, fallback = "Ocorreu um erro. Tente novamente."): string {
  if (!error) return fallback;
  const raw = error instanceof Error ? error.message : String(error);
  if (KNOWN[raw]) return KNOWN[raw];
  // Bloqueia payloads que aparentam stack trace / JSON interno.
  if (raw.length > 160 || raw.includes("\n") || raw.startsWith("{")) return fallback;
  return raw;
}