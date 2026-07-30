import Link from "next/link";
import { redirect } from "next/navigation";
import { getAdminUser } from "@/app/admin-auth";
import AdminLoginForm from "./AdminLoginForm";

export const dynamic = "force-dynamic";

export default async function AdminLoginPage() {
  if (await getAdminUser()) redirect("/admin");

  return (
    <main className="admin-access" dir="ltr">
      <div className="admin-access__card">
        <img src="/media/noor-al-aman-mark.webp" alt="" />
        <p className="admin-kicker">Noor Al-Aman Humanitarian</p>
        <h1>Admin sign in</h1>
        <p>Sign in with the authorised Supabase administrator account.</p>
        <AdminLoginForm />
        <Link className="admin-login-home" href="/">
          Return to website
        </Link>
      </div>
    </main>
  );
}
