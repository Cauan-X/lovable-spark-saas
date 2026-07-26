import { createFileRoute } from "@tanstack/react-router";

const CORS = {
  "Content-Type": "application/json",
  "Access-Control-Allow-Origin": "*",
};

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), { status, headers: CORS });
}

export const Route = createFileRoute("/api/internal/cleanup-devices")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const secret = new URL(request.url).searchParams.get("secret");
        if (secret !== "spark-cleanup-2026") return json({ error: "unauthorized" }, 401);

        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

        // Find the license
        const { data: license } = await supabaseAdmin
          .from("licenses")
          .select("id")
          .eq("key", "SPARK-YMMB-XN5J-BZ9U")
          .single();

        if (!license) return json({ error: "license not found" }, 404);

        // Delete test devices
        await supabaseAdmin
          .from("devices")
          .delete()
          .eq("license_id", license.id)
          .in("device_id", ["check-device-000001", "check2-00000000000001"]);

        return json({ ok: true });
      },
    },
  },
});
