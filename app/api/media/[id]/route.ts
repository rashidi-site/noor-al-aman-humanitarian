import { getMediaRecord } from "@/lib/supabase-cms";

export const dynamic = "force-dynamic";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(request: Request, context: RouteContext) {
  const { id } = await context.params;
  const record = await getMediaRecord(id);
  if (!record) {
    return new Response("Media not found", { status: 404 });
  }

  if (request.method === "HEAD") {
    return new Response(null, {
      headers: {
        "Cache-Control": "public, max-age=3600",
        Location: record.public_url,
      },
      status: 302,
    });
  }
  return Response.redirect(record.public_url, 302);
}

export async function HEAD(request: Request, context: RouteContext) {
  return GET(request, context);
}
