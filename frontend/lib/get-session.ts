import { headers } from "next/headers";
import { auth } from "./auth";

/**
 * Reusable server-side helper to fetch the current Better Auth session.
 * Used in React Server Components, Server Actions, and Route Handlers.
 */
export async function getSession() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  return session;
}
