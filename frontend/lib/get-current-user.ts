import { getSession } from "./get-session";
import { prisma } from "./prisma";
import { UserRole } from "../config/roles";

/**
 * Enhanced session helper that returns user details and profile.
 */
export async function getCurrentUser() {
  const session = await getSession();
  
  if (!session || !session.user) {
    return null;
  }

  // Fetch full user and profile from database
  const userWithProfile = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      ownerProfile: true,
    }
  });

  if (!userWithProfile) {
    return null;
  }

  return {
    session,
    user: {
      id: userWithProfile.id,
      name: userWithProfile.name,
      email: userWithProfile.email,
      role: userWithProfile.role as UserRole,
    },
    ownerProfile: userWithProfile.ownerProfile,
  };
}

/**
 * Middleware-like helper for server actions and pages to ensure authentication.
 */
export async function requireAuth() {
  const currentUser = await getCurrentUser();
  if (!currentUser) {
    throw new Error("Authentication required");
  }
  return currentUser;
}

/**
 * Middleware-like helper to ensure user has specific roles.
 */
export async function requireRole(allowedRoles: UserRole[]) {
  const currentUser = await requireAuth();
  if (!allowedRoles.includes(currentUser.user.role)) {
    throw new Error("Permission denied");
  }
  return currentUser;
}
