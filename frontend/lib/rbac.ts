import { UserRole } from "../config/roles";
import { ROLE_PERMISSIONS, Permission } from "../config/permissions";

/**
 * RBAC Utilities for the Kebele House Tax and Property Payment Management System.
 */

export { UserRole };
export type Role = keyof typeof UserRole;

/**
 * Check if a user has a specific role.
 */
export function hasRole(userRole: UserRole, allowedRoles: UserRole[]) {
  return allowedRoles.includes(userRole);
}

/**
 * Check if a role has a specific permission.
 */
export function hasPermission(userRole: UserRole, permission: Permission) {
  const permissions = ROLE_PERMISSIONS[userRole];
  return permissions.includes(permission);
}

/**
 * Check if a user can access a route based on role.
 * In this system, we prefer permission-based checks.
 */
export function canAccessRoute(userRole: UserRole, allowedRoles: UserRole[]) {
  return hasRole(userRole, allowedRoles);
}
