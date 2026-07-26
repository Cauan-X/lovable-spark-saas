import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

// Heartbeat periódico da extensão: confirma que a licença segue válida e
// atualiza o `last_seen_at` do dispositivo.

const InputSchema = z.object({
  key: z.string().min(8).max(64),
  device_id: z.string().min(6).max(128),
});

const CORS = {
  "Content-Type": "application/json",
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "content-type",
};

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), { status, headers: CORS });
}

export const Route = createFileRoute("/api/public/license/heartbeat")({
  server: {
    handlers: {
      OPTIONS: async () => new Response(null, { status: 204, headers: CORS }),
      POST: async ({ request }) => {
        let input: z.infer<typeof InputSchema>;
        try {
          input = InputSchema.parse(await request.json());
        } catch {
          return json({ ok: false, reason: "invalid_request" }, 400);
        }

        const key = input.key.trim().toUpperCase();
        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

        const { data: license } = await supabaseAdmin
          .from("licenses")
          .select("id, status, expires_at")
          .eq("key", key)
          .maybeSingle();

        if (!license) return json({ ok: false, reason: "not_found" }, 404);
        if (license.status !== "active") return json({ ok: false, reason: license.status }, 403);
        if (license.expires_at && new Date(license.expires_at).getTime() < Date.now()) {
          return json({ ok: false, reason: "expired" }, 403);
        }

        const { data: device } = await (supabaseAdmin as any)
          .from("devices")
          .select("id, blocked")
          .eq("license_id", license.id)
          .eq("device_id", input.device_id)
          .maybeSingle();

        if (!device) return json({ ok: false, reason: "device_not_registered" }, 404);
        if (device.blocked) return json({ ok: false, reason: "device_blocked" }, 403);

        await (supabaseAdmin as any)
          .from("devices")
          .update({ last_seen_at: new Date().toISOString() })
          .eq("id", device.id);

        return json({ ok: true, expires_at: license.expires_at });
      },
    },
  },
});