import { getChatGPTUser, requireChatGPTUser, type ChatGPTUser } from "./chatgpt-auth";

const ADMIN_EMAIL = "roarwhd@gmail.com";

export function isAdminUser(user: ChatGPTUser | null): user is ChatGPTUser {
  return user?.email.toLowerCase() === ADMIN_EMAIL;
}

export async function requireAdminPageUser(): Promise<ChatGPTUser | null> {
  const user = await requireChatGPTUser("/admin");
  return isAdminUser(user) ? user : null;
}

export async function requireAdminApi(): Promise<Response | null> {
  const user = await getChatGPTUser();
  if (!user) {
    return Response.json(
      { error: "Please sign in before using the admin dashboard." },
      { status: 401 },
    );
  }
  if (!isAdminUser(user)) {
    return Response.json(
      { error: "This account does not have admin access." },
      { status: 403 },
    );
  }
  return null;
}
