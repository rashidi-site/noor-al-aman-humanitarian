import { cookies } from "next/headers";
import { adminCookies } from "@/app/admin-auth";
import {
  getSupabaseAuth,
  getSupabaseConfig,
  isSupabaseConfigured,
} from "@/lib/supabase";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  if (!isSupabaseConfigured()) {
    return Response.json(
      { error: "Admin login is not configured yet." },
      { status: 503 },
    );
  }

  const payload = (await request.json()) as {
    email?: unknown;
    password?: unknown;
  };
  const email =
    typeof payload.email === "string" ? payload.email.trim().toLowerCase() : "";
  const password =
    typeof payload.password === "string" ? payload.password : "";

  if (email !== getSupabaseConfig().adminEmail || !password) {
    return Response.json(
      { error: "The email or password is incorrect." },
      { status: 401 },
    );
  }

  const { data, error } = await getSupabaseAuth().auth.signInWithPassword({
    email,
    password,
  });
  if (error || !data.session) {
    return Response.json(
      { error: "The email or password is incorrect." },
      { status: 401 },
    );
  }

  const cookieStore = await cookies();
  const secure = new URL(request.url).protocol === "https:";
  cookieStore.set(adminCookies.access, data.session.access_token, {
    httpOnly: true,
    maxAge: data.session.expires_in,
    path: "/",
    sameSite: "lax",
    secure,
  });
  cookieStore.set(adminCookies.refresh, data.session.refresh_token, {
    httpOnly: true,
    maxAge: 60 * 60 * 24 * 30,
    path: "/",
    sameSite: "lax",
    secure,
  });

  return Response.json({ ok: true });
}
