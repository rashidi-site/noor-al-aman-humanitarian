import { requireAdminApi } from "@/app/admin-auth";
import { getContactSubmissions } from "@/lib/supabase-cms";

export const dynamic = "force-dynamic";

export async function GET() {
  const denied = await requireAdminApi();
  if (denied) return denied;

  try {
    return Response.json({ messages: await getContactSubmissions() });
  } catch (error) {
    return Response.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Messages could not be loaded.",
      },
      { status: 400 },
    );
  }
}
