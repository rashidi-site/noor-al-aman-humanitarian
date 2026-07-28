import { requireAdminApi } from "@/app/admin-auth";
import {
  deleteProgram,
  saveProgram,
  type ProgramInput,
  type ProgramSaveAction,
} from "@/lib/cms";

export const dynamic = "force-dynamic";

type RouteContext = {
  params: Promise<{ id: string }>;
};

function apiError(error: unknown): Response {
  const message =
    error instanceof Error ? error.message : "The request could not be completed.";
  const isDuplicate =
    message.includes("UNIQUE constraint failed") || message.includes("programs.slug");

  return Response.json(
    {
      error: isDuplicate
        ? "Another project already uses this URL name. Please choose a different one."
        : message,
    },
    { status: isDuplicate ? 409 : 400 },
  );
}

export async function PATCH(request: Request, context: RouteContext) {
  const denied = await requireAdminApi();
  if (denied) return denied;

  try {
    const { id } = await context.params;
    const payload = (await request.json()) as {
      program?: ProgramInput;
      action?: ProgramSaveAction;
    };
    const action: ProgramSaveAction =
      payload.action === "publish" || payload.action === "unpublish"
        ? payload.action
        : "draft";
    const program = await saveProgram(
      { ...(payload.program ?? {}), id },
      action,
    );
    return Response.json({ program });
  } catch (error) {
    return apiError(error);
  }
}

export async function DELETE(_request: Request, context: RouteContext) {
  const denied = await requireAdminApi();
  if (denied) return denied;

  try {
    const { id } = await context.params;
    await deleteProgram(id);
    return Response.json({ deleted: true });
  } catch (error) {
    return apiError(error);
  }
}
