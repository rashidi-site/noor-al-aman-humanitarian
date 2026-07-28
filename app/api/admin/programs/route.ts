import { requireAdminApi } from "@/app/admin-auth";
import {
  getAllPrograms,
  saveProgram,
  type ProgramInput,
  type ProgramSaveAction,
} from "@/lib/cms";

export const dynamic = "force-dynamic";

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

export async function GET() {
  const denied = await requireAdminApi();
  if (denied) return denied;

  try {
    return Response.json({ programs: await getAllPrograms() });
  } catch (error) {
    return apiError(error);
  }
}

export async function POST(request: Request) {
  const denied = await requireAdminApi();
  if (denied) return denied;

  try {
    const payload = (await request.json()) as {
      program?: ProgramInput;
      action?: ProgramSaveAction;
    };
    const action: ProgramSaveAction =
      payload.action === "publish" ? "publish" : "draft";
    const program = await saveProgram(payload.program ?? {}, action);
    return Response.json({ program }, { status: 201 });
  } catch (error) {
    return apiError(error);
  }
}
