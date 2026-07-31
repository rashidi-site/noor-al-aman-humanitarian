import { requireAdminApi } from "@/app/admin-auth";
import {
  deleteContactSubmission,
  updateContactSubmissionStatus,
  type ContactSubmissionStatus,
} from "@/lib/supabase-cms";

export const dynamic = "force-dynamic";

type RouteContext = { params: Promise<{ id: string }> };

function apiError(error: unknown): Response {
  return Response.json(
    {
      error:
        error instanceof Error ? error.message : "The message could not be updated.",
    },
    { status: 400 },
  );
}

export async function PATCH(request: Request, context: RouteContext) {
  const denied = await requireAdminApi();
  if (denied) return denied;

  try {
    const { id } = await context.params;
    const payload = (await request.json()) as { status?: string };
    if (payload.status !== "new" && payload.status !== "read") {
      return Response.json({ error: "Invalid message status." }, { status: 400 });
    }
    const message = await updateContactSubmissionStatus(
      id,
      payload.status as ContactSubmissionStatus,
    );
    return Response.json({ message });
  } catch (error) {
    return apiError(error);
  }
}

export async function DELETE(_request: Request, context: RouteContext) {
  const denied = await requireAdminApi();
  if (denied) return denied;

  try {
    const { id } = await context.params;
    await deleteContactSubmission(id);
    return Response.json({ deleted: true });
  } catch (error) {
    return apiError(error);
  }
}
