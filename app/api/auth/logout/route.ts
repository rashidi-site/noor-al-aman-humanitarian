import { cookies } from "next/headers";
import { adminCookies } from "@/app/admin-auth";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const cookieStore = await cookies();
  cookieStore.delete(adminCookies.access);
  cookieStore.delete(adminCookies.refresh);
  return Response.redirect(new URL("/", request.url), 303);
}
