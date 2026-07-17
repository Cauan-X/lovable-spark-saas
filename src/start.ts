import { createStart, createMiddleware } from "@tanstack/react-start";

import { renderErrorPage } from "./lib/error-page";
import { attachSupabaseAuth } from "@/integrations/supabase/auth-attacher";

const errorMiddleware = createMiddleware().server(async ({ next }) => {
  try {
    return await next();
  } catch (error) {
    if (error != null && typeof error === "object" && "statusCode" in error) {
      throw error;
    }
    console.error(error);
    return new Response(renderErrorPage(), {
      status: 500,
      headers: { "content-type": "text/html; charset=utf-8" },
    });
  }
});

// CSP: removido unsafe-inline/unsafe-eval — usa nonce para scripts inline.
// Lovable preview (cdn.gpteng.co, *.lovable.app, *.lovable.dev) permitido.
const CSP = [
  "default-src 'self'",
  `script-src 'self' https://cdn.gpteng.co https://*.lovable.app https://*.lovable.dev`,
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "font-src 'self' data: https://fonts.gstatic.com",
  "img-src 'self' data: blob: https:",
  "connect-src 'self' https: wss:",
  "frame-src 'self' https:",
  "frame-ancestors 'none'",
  "form-action 'self' https://pay.cakto.com.br",
  "base-uri 'self'",
  "object-src 'none'",
  "upgrade-insecure-requests",
].join("; ");

const securityHeadersMiddleware = createMiddleware().server(async ({ next }) => {
  const response = await next();
  // Alguns middlewares retornam objetos internos do TanStack, não Response. Só ajustamos Response.
  if (!(response instanceof Response)) return response;
  const headers = new Headers(response.headers);
  headers.set("Content-Security-Policy", CSP);
  headers.set("Strict-Transport-Security", "max-age=63072000; includeSubDomains; preload");
  headers.set("X-Content-Type-Options", "nosniff");
  headers.set("X-Frame-Options", "DENY");
  headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  headers.set(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=(), payment=(), usb=(), interest-cohort=()",
  );
  headers.set("Cross-Origin-Opener-Policy", "same-origin");
  headers.set("X-DNS-Prefetch-Control", "on");
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
});

export const startInstance = createStart(() => ({
  functionMiddleware: [attachSupabaseAuth],
  requestMiddleware: [securityHeadersMiddleware, errorMiddleware],
}));
