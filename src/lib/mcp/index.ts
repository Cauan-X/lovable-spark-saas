import { auth, defineMcp } from "@lovable.dev/mcp-js";
import getLicenseTool from "./tools/get-license";
import getSubscriptionTool from "./tools/get-subscription";
import getProfileTool from "./tools/get-profile";

// The OAuth issuer must be the direct Supabase host (RFC 8414 issuer match).
// The proxied `.lovable.cloud` URL is rejected by mcp-js token verification.
const projectRef = import.meta.env.VITE_SUPABASE_PROJECT_ID ?? "project-ref-unset";

export default defineMcp({
  name: "lovable-spark-mcp",
  title: "Lovable Spark",
  version: "0.1.0",
  instructions:
    "Ferramentas do Lovable Spark. Consultam licença, assinatura e perfil do usuário autenticado.",
  auth: auth.oauth.issuer({
    issuer: `https://${projectRef}.supabase.co/auth/v1`,
    acceptedAudiences: "authenticated",
  }),
  tools: [getLicenseTool, getSubscriptionTool, getProfileTool],
});