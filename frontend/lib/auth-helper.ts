import { headers } from "next/headers";

/**
 * Safely retrieves the server session using lazy loading
 * to prevent build-time static analysis failures.
 */
export async function getServerSession() {
  try {
    const { auth } = await import("./auth");
    const session = await auth.api.getSession({
      headers: await headers(),
    });
    return session;
  } catch (error) {
    console.error("Failed to get server session:", error);
    return null;
  }
}
