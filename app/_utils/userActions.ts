"use server";

import { cookies } from "next/headers";
import { validateSession } from "./auth";

export async function getCurrentUser() {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get("session_id")?.value;

  if (!sessionId) {
    return null;
  }

  const user = await validateSession(sessionId);
  if (!user) {
    return null;
  }

  return { id: user.id, name: user.name, email: user.email };
}
