"use client";

import { useEffect, useState } from "react";
import { contentPages } from "../cms-content";
import type { AdminDashboardData } from "@/lib/supabase-cms";
import AdminDashboard from "./AdminDashboard";

type DashboardPayload = {
  data: AdminDashboardData;
  user: {
    email: string;
    displayName: string;
  };
};

export default function AdminDashboardClient() {
  const [payload, setPayload] = useState<DashboardPayload | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    async function loadDashboard() {
      try {
        const response = await fetch("/api/admin/dashboard", {
          cache: "no-store",
        });

        if (response.status === 401) {
          window.location.replace("/admin/login");
          return;
        }

        const body = (await response.json()) as DashboardPayload & {
          error?: string;
        };
        if (!response.ok) {
          throw new Error(body.error || "The dashboard could not be loaded.");
        }

        if (active) setPayload(body);
      } catch (loadError) {
        if (active) {
          setError(
            loadError instanceof Error
              ? loadError.message
              : "The dashboard could not be loaded.",
          );
        }
      }
    }

    void loadDashboard();
    return () => {
      active = false;
    };
  }, []);

  if (!payload) {
    return (
    <main className="admin-access" dir="ltr">
      <div className="admin-access__card">
        <p className="admin-kicker">Noor Al-Aman Humanitarian</p>
        <h1>{error || "Opening dashboard…"}</h1>
        {error ? (
          <button type="button" onClick={() => window.location.reload()}>
            Try again
          </button>
        ) : null}
      </div>
    </main>
    );
  }

  return (
    <AdminDashboard
      initialData={payload.data}
      contentPages={contentPages}
      userName={payload.user.displayName}
      userEmail={payload.user.email}
      signOutPath="/api/auth/logout"
    />
  );
}
