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
      <main className="admin-access" dir="rtl">
        <div className="admin-access__card">
          <img src="/media/noor-al-aman-mark.webp" alt="" />
          <p className="admin-kicker">Noor Al-Aman Humanitarian</p>
          <h1>رسائی دستیاب نہیں</h1>
          <p>
            یہ Admin Dashboard صرف ویب سائٹ کے مالک کے ChatGPT اکاؤنٹ کے لیے
            محفوظ ہے۔
          </p>
          <Link className="admin-button admin-button--primary" href="/">
            ویب سائٹ پر واپس جائیں
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
