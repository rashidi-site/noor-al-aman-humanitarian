import { requireAdminApi } from "@/app/admin-auth";
import { deleteMediaRecord } from "@/lib/supabase-cms";

export const dynamic = "force-dynamic";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function DELETE(_request: Request, context: RouteContext) {
  const denied = await requireAdminApi();
  if (denied) return denied;

  try {
    const { id } = await context.params;
    await deleteMediaRecord(id);
    return Response.json({ deleted: true });
  } catch (error) {
    return Response.json(
      {
        error:
          error instanceof Error ? error.message : "The file could not be deleted.",
      },
      { status: 400 },
    );
  }
}
