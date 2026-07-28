import { getMediaBucket, getMediaRecord } from "@/lib/cms";

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

  const object = await getMediaBucket().get(record.object_key);
  if (!object) {
    return new Response("Media not found", { status: 404 });
  }

  const headers = new Headers();
  object.writeHttpMetadata(headers);
  headers.set("Content-Type", record.content_type);
  headers.set("Content-Length", String(record.size));
  headers.set("Cache-Control", "public, max-age=31536000, immutable");
  headers.set("ETag", object.httpEtag);
  headers.set("Accept-Ranges", "bytes");
  headers.set(
    "Content-Disposition",
    `inline; filename="${record.name.replace(/["\r\n]/g, "")}"`,
  );

  if (request.method === "HEAD") {
    return new Response(null, { headers });
  }

  return new Response(object.body, { headers });
}

export async function HEAD(request: Request, context: RouteContext) {
  return GET(request, context);
}
