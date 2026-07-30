import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
  getSupabaseAuth,
  getSupabaseConfig,
  isSupabaseConfigured,
} from "@/lib/supabase";

export type AdminUser = {
  email: string;
  displayName: string;
};

const ACCESS_COOKIE = "noor_admin_access";
const REFRESH_COOKIE = "noor_admin_refresh";

export const adminCookies = {
  access: ACCESS_COOKIE,
  refresh: REFRESH_COOKIE,
};

export async function getAdminUser(): Promise<AdminUser | null> {
  if (!isSupabaseConfigured()) return null;

  const cookieStore = await cookies();
  const accessToken = cookieStore.get(ACCESS_COOKIE)?.value;
  if (!accessToken) return null;

  const { data, error } = await getSupabaseAuth().auth.getUser(accessToken);
  if (error || !data.user?.email) return null;

  const email = data.user.email.toLowerCase();
  if (email !== getSupabaseConfig().adminEmail) return null;

  const fullName =
    typeof data.user.user_metadata?.full_name === "string"
      ? data.user.user_metadata.full_name.trim()
      : "";

  return {
    email,
    displayName: fullName || email.split("@")[0],
  };
}

export async function requireAdminPageUser(): Promise<AdminUser> {
  const user = await getAdminUser();
  if (!user) redirect("/admin/login");
  return user;
}

export async function requireAdminApi(): Promise<Response | null> {
  if (!isSupabaseConfigured()) {
    return Response.json(
      { error: "The admin service has not been configured yet." },
      { status: 503 },
    );
  }

  const user = await getAdminUser();
  if (!user) {
    return Response.json(
      { error: "Please sign in before using the admin dashboard." },
      { status: 401 },
    );
  }
  return null;
}
