import { requireAdminApi } from "@/app/admin-auth";
import {
  getUploadedMedia,
  uploadMediaFile,
} from "@/lib/supabase-cms";

export const dynamic = "force-dynamic";

const IMAGE_TYPES = new Set([
  "image/avif",
  "image/gif",
  "image/jpeg",
  "image/png",
  "image/webp",
]);
const VIDEO_TYPES = new Set(["video/mp4", "video/webm"]);
const IMAGE_FILE_LIMIT = 25 * 1024 * 1024;
const VIDEO_FILE_LIMIT = 50 * 1024 * 1024;

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

    const fileLimit = isVideo ? VIDEO_FILE_LIMIT : IMAGE_FILE_LIMIT;
    if (file.size > fileLimit) {
      return apiError(
        new Error(
          isVideo
            ? "Videos must be 50 MB or smaller on the free storage plan."
            : "Images must be 25 MB or smaller on the free storage plan.",
        ),
        413,
      );
    }

    const media = await uploadMediaFile({
      file,
      altText,
    });
    return Response.json({ media }, { status: 201 });
  } catch (error) {
    return apiError(error);
  }
}
