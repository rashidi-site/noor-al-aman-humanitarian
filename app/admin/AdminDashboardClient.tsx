"use client";

import dynamic from "next/dynamic";
import type { ContentPage } from "../cms-content";
import type { AdminDashboardData } from "@/lib/supabase-cms";

type AdminDashboardClientProps = {
  initialData: AdminDashboardData;
  contentPages: ContentPage[];
  userName: string;
  userEmail: string;
  signOutPath: string;
};

const AdminDashboard = dynamic(() => import("./AdminDashboard"), {
  ssr: false,
  loading: () => (
    <main className="admin-access" dir="ltr">
      <div className="admin-access__card">
        <p className="admin-kicker">Noor Al-Aman Humanitarian</p>
        <h1>Opening dashboard…</h1>
      </div>
    </main>
  ),
});

export default function AdminDashboardClient(
  props: AdminDashboardClientProps,
) {
  return <AdminDashboard {...props} />;
}
