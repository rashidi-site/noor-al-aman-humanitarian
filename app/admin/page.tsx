import { requireAdminPageUser } from "../admin-auth";
import { contentPages } from "../cms-content";
import { getAdminDashboardData } from "@/lib/supabase-cms";
import AdminDashboard from "./AdminDashboard";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const user = await requireAdminPageUser();

  const data = await getAdminDashboardData();

  return (
    <AdminDashboard
      initialData={data}
      contentPages={contentPages}
      userName={user.displayName}
      userEmail={user.email}
      signOutPath="/api/auth/logout"
    />
  );
}
