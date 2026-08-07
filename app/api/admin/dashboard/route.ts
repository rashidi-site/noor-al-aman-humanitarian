import { getAdminUser } from "@/app/admin-auth";
import { getAdminDashboardData } from "@/lib/supabase-cms";

export const dynamic = "force-dynamic";

export async function GET() {
  const user = await getAdminUser();
  if (!user) {
    return Response.json(
      { error: "Please sign in before using the admin dashboard." },
      { status: 401 },
    );
  }

  try {
    return Response.json({
      user,
      data: await getAdminDashboardData(),
    });
  } catch (error) {
    return Response.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "The dashboard could not be loaded.",
      },
      { status: 500 },
    );
  }
}
