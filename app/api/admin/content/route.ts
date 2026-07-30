import { requireAdminApi } from "@/app/admin-auth";
import { getAdminContent, saveSiteContent } from "@/lib/supabase-cms";

export const dynamic = "force-dynamic";

function apiError(error: unknown): Response {
  return Response.json(
    {
      error:
        error instanceof Error
          ? error.message
          : "The website content could not be saved.",
    },
    { status: 400 },
  );
}

export async function GET() {
  const denied = await requireAdminApi();
  if (denied) return denied;

  try {
    return Response.json(await getAdminContent());
  } catch (error) {
    return apiError(error);
  }
}

export async function PUT(request: Request) {
  const denied = await requireAdminApi();
  if (denied) return denied;

  try {
    const payload = (await request.json()) as {
      values?: Record<string, unknown>;
      publish?: boolean;
    };
    const result = await saveSiteContent(
      payload.values ?? {},
      payload.publish === true,
    );
    return Response.json(result);
  } catch (error) {
    return apiError(error);
  }
}
