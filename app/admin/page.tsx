import Link from "next/link";
import { chatGPTSignOutPath } from "../chatgpt-auth";
import { requireAdminPageUser } from "../admin-auth";
import { contentPages } from "../cms-content";
import { getAdminDashboardData } from "@/lib/cms";
import AdminDashboard from "./AdminDashboard";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const user = await requireAdminPageUser();

  if (!user) {
    return (
      <main className="admin-access" dir="ltr">
        <div className="admin-access__card">
          <img src="/media/noor-al-aman-mark.webp" alt="" />
          <p className="admin-kicker">Noor Al-Aman Humanitarian</p>
          <h1>Access unavailable</h1>
          <p>
            This Admin Dashboard is protected and can only be accessed through
            the website owner&apos;s authorised ChatGPT account.
          </p>
          <Link className="admin-button admin-button--primary" href="/">
            Return to website
          </Link>
        </div>
      </main>
    );
  }

  const data = await getAdminDashboardData();

  return (
    <AdminDashboard
      initialData={data}
      contentPages={contentPages}
      userName={user.displayName}
      userEmail={user.email}
      signOutPath={chatGPTSignOutPath("/")}
    />
  );
}
