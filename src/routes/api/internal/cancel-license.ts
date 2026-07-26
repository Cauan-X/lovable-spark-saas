import { createFileRoute } from "@tanstack/react-router";

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
  });
}

export const Route = createFileRoute("/api/internal/cancel-license")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const secret = new URL(request.url).searchParams.get("secret");
        if (secret !== "spark-cancel-2026") return json({ error: "unauthorized" }, 401);

        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

        await supabaseAdmin
          .from("licenses")
          .update({ status: "canceled" })
          .eq("key", "SPARK-YMMB-XN5J-BZ9U")
          .eq("status", "active");

        return json({ ok: true });
      },
    },
  },
});
