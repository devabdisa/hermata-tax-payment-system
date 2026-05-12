import "server-only";
import { prisma } from "./prisma";
import type { UserRole } from "@prisma/client";
import { headers } from "next/headers";

/**
 * Interface for audit log input.
 */
export interface AuditLogInput {
  action: string;
  entityType: string;
  entityId?: string;
  description?: string;
  metadata?: any;
  actorUserId?: string;
  actorStaffId?: string;
  actorRole?: UserRole;
}

/**
 * Central utility to record audit events.
 * This should be used in server-side contexts only.
 */
export async function logAuditEvent(input: AuditLogInput) {
  try {
    let ipAddress = null;
    let userAgent = null;

    try {
      const headerList = await headers();
      ipAddress = headerList.get("x-forwarded-for") || headerList.get("x-real-ip");
      userAgent = headerList.get("user-agent");
    } catch {
      // Headers might not be available in all contexts, ignore
    }

    // Redact sensitive information from metadata
    let metadata = input.metadata;
    if (metadata && typeof metadata === 'object') {
      metadata = { ...metadata };
      const sensitiveFields = ['password', 'confirmPassword', 'currentPassword', 'newPassword'];
      for (const field of sensitiveFields) {
        if (field in metadata) {
          metadata[field] = '[REDACTED]';
        }
      }
    }

    await prisma.auditLog.create({
      data: {
        action: input.action,
        entityType: input.entityType,
        entityId: input.entityId,
        metadata: metadata,
        userId: input.actorUserId,
        ipAddress: ipAddress,
        userAgent: userAgent,
      },
    });
  } catch (error) {
    // Audit logging should not break the main business workflow
    console.warn("Audit logging failed:", error);
  }
}

/**
 * Helper to log audit events for the current authenticated user.
 */
export async function logCurrentUserAuditEvent(
  currentUser: { 
    user: { id: string; role: UserRole }; 
    staffProfile?: { id: string } | null 
  } | null,
  input: Omit<AuditLogInput, "actorUserId" | "actorStaffId" | "actorRole">
) {
  if (!currentUser) return;

  await logAuditEvent({
    ...input,
    actorUserId: currentUser.user.id,
    actorStaffId: currentUser.staffProfile?.id,
    actorRole: currentUser.user.role,
  });
}
