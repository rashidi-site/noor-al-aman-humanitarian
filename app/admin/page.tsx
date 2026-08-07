import { requireAdminPageUser } from "../admin-auth";
import { contentPages } from "../cms-content";
import {
  getAdminDashboardData,
  type AdminDashboardData,
} from "@/lib/supabase-cms";
import AdminDashboardClient from "./AdminDashboardClient";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const user = await requireAdminPageUser();

  // Supabase responses can carry runtime-specific object prototypes. Converting
  // the dashboard payload to JSON guarantees a plain React Server Component
  // boundary before the client-only dashboard receives it.
  const data = JSON.parse(
    JSON.stringify(await getAdminDashboardData()),
  ) as AdminDashboardData;

  return (
    <AdminDashboardClient
      initialData={data}
      contentPages={contentPages}
      userName={user.displayName}
      userEmail={user.email}
      signOutPath="/api/auth/logout"
    />
  );
}
