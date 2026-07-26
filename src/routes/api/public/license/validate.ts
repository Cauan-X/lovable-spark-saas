import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

// Endpoint público consumido pela extensão Chrome para validar a chave de
// licença e registrar (ou reutilizar) o dispositivo do usuário.

const MAX_DEVICES = 3;

const InputSchema = z.object({
  key: z.string().min(8).max(64),
  device_id: z.string().min(6).max(128),
  label: z.string().max(80).optional(),
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

export const Route = createFileRoute("/api/public/license/validate")({
  server: {
    handlers: {
      OPTIONS: async () => new Response(null, { status: 204, headers: CORS }),
      POST: async ({ request }) => {
        let input: z.infer<typeof InputSchema>;
        try {
          input = InputSchema.parse(await request.json());
        } catch {
          return json({ valid: false, reason: "invalid_request" }, 400);
        }

        const key = input.key.trim().toUpperCase();
        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

        const { data: license } = await supabaseAdmin
          .from("licenses")
          .select("id, user_id, status, expires_at")
          .eq("key", key)
          .maybeSingle();

        if (!license) return json({ valid: false, reason: "not_found" }, 404);
        if (license.status !== "active") return json({ valid: false, reason: license.status }, 403);
        if (license.expires_at && new Date(license.expires_at).getTime() < Date.now()) {
          return json({ valid: false, reason: "expired" }, 403);
        }

        const { data: devices } = await (supabaseAdmin as any)
          .from("devices")
          .select("id, device_id, blocked")
          .eq("license_id", license.id);

        const list: Array<{ id: string; device_id: string; blocked: boolean }> = devices ?? [];
        const existing = list.find((d) => d.device_id === input.device_id);

        if (existing?.blocked) return json({ valid: false, reason: "device_blocked" }, 403);

        if (!existing && list.length >= MAX_DEVICES) {
          return json({ valid: false, reason: "device_limit", max_devices: MAX_DEVICES }, 403);
        }

        await (supabaseAdmin as any).from("devices").upsert(
          {
            license_id: license.id,
            user_id: license.user_id,
            device_id: input.device_id,
            label: input.label ?? null,
            user_agent: request.headers.get("user-agent")?.slice(0, 300) ?? null,
            last_seen_at: new Date().toISOString(),
          },
          { onConflict: "license_id,device_id" },
        );

        return json({
          valid: true,
          expires_at: license.expires_at,
          devices_used: existing ? list.length : list.length + 1,
          max_devices: MAX_DEVICES,
        });
      },
    },
  },
});