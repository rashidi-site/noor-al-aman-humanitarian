import { requireAdminApi } from "@/app/admin-auth";
import {
  createMediaRecord,
  getMediaBucket,
  getUploadedMedia,
} from "@/lib/cms";

export const dynamic = "force-dynamic";

const IMAGE_TYPES = new Set([
  "image/avif",
  "image/gif",
  "image/jpeg",
  "image/png",
  "image/webp",
]);
const VIDEO_TYPES = new Set(["video/mp4", "video/webm"]);
const IMAGE_LIMIT = 25 * 1024 * 1024;
const VIDEO_LIMIT = 80 * 1024 * 1024;

function safeFileName(name: string): string {
  const cleaned = name
    .normalize("NFKD")
    .replace(/[^\w.-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(-120);
  return cleaned || "upload";
}

function apiError(error: unknown, status = 400): Response {
  return Response.json(
    {
      error:
        error instanceof Error ? error.message : "The file could not be uploaded.",
    },
    { status },
  );
}

export async function GET() {
  const denied = await requireAdminApi();
  if (denied) return denied;

  try {
    return Response.json({ media: await getUploadedMedia() });
  } catch (error) {
    return apiError(error);
  }
}

export async function POST(request: Request) {
  const denied = await requireAdminApi();
  if (denied) return denied;

  let objectKey: string | null = null;
  try {
    const form = await request.formData();
    const file = form.get("file");
    const altText =
      typeof form.get("altText") === "string"
        ? String(form.get("altText")).trim().slice(0, 250)
        : "";

    if (!(file instanceof File) || file.size === 0) {
      return apiError(new Error("Please choose an image or video."));
    }

    const contentType = file.type.toLowerCase().split(";")[0];
    const isImage = IMAGE_TYPES.has(contentType);
    const isVideo = VIDEO_TYPES.has(contentType);
    if (!isImage && !isVideo) {
      return apiError(
        new Error("Use JPG, PNG, WebP, AVIF, GIF, MP4, or WebM files."),
      );
    }

    const limit = isVideo ? VIDEO_LIMIT : IMAGE_LIMIT;
    if (file.size > limit) {
      return apiError(
        new Error(
          isVideo
            ? "Videos must be 80 MB or smaller."
            : "Images must be 25 MB or smaller.",
        ),
        413,
      );
    }

    const id = crypto.randomUUID();
    objectKey = `uploads/${id}/${safeFileName(file.name)}`;
    const bucket = getMediaBucket();
    await bucket.put(objectKey, file.stream(), {
      httpMetadata: { contentType },
      customMetadata: {
        originalName: file.name.slice(0, 250),
      },
    });

    const media = await createMediaRecord({
      id,
      objectKey,
      name: file.name.slice(0, 250),
      contentType,
      size: file.size,
      altText: altText || file.name.replace(/\.[^.]+$/, ""),
    });
    return Response.json({ media }, { status: 201 });
  } catch (error) {
    if (objectKey) {
      await getMediaBucket().delete(objectKey).catch(() => undefined);
    }
    return apiError(error);
  }
}
