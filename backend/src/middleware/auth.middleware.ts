import { Request, Response, NextFunction } from "express";
import { ApiError } from "../utils/api-error";
import { catchAsync } from "../utils/catch-async";
import { ROLE_PERMISSIONS } from "../constants/permissions";
import { prisma } from "../config/db";
import { UserStatus } from "@prisma/client";

/**
 * Middleware to verify Better Auth session.
 * It reads the session token from cookies or authorization header.
 */
export const authMiddleware = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const isDevelopment = process.env.NODE_ENV === "development";
    const enableDevBypass = process.env.ENABLE_DEV_AUTH_BYPASS === "true";
    const authHeader = req.headers.authorization;
    const cookieHeader = req.headers.cookie;

    let userId: string | null = null;
    let userRole: string | null = null;
    let userEmail: string | null = null;

    // 1. Check for Development Bypass
    if (isDevelopment && enableDevBypass && authHeader?.startsWith("Bearer dev-")) {
      const role = authHeader.replace("Bearer dev-", "").toUpperCase();
      userId = `dev-${role.toLowerCase()}-id`;
      userRole = role;
      userEmail = `dev-${role.toLowerCase()}@example.com`;
    } 
    else {
      // 2. Real Session Verification
      // Better Auth session token is usually in a cookie named 'better-auth.session-token'
      // or passed in Authorization: Bearer <token>
      let sessionToken: string | null = null;

      if (authHeader?.startsWith("Bearer ")) {
        sessionToken = authHeader.substring(7);
      } else if (cookieHeader) {
        const cookies = cookieHeader.split(";").reduce((acc, cookie) => {
          const [name, value] = cookie.trim().split("=");
          acc[name] = decodeURIComponent(value || ""); // Add decoding
          return acc;
        }, {} as Record<string, string>);
        
        const configuredCookieName =
          process.env.BETTER_AUTH_SESSION_COOKIE_NAME || "better-auth.session-token";
        sessionToken = 
          cookies[configuredCookieName] ||
          cookies["better-auth.session-token"] || 
          cookies["better-auth.session_token"] ||
          cookies["__Secure-better-auth.session-token"] ||
          cookies["__Secure-better-auth.session_token"];
      }

      if (!sessionToken) {
        throw new ApiError(401, "Authentication required");
      }

      // Verify session in database
      const sessionData = await prisma.session.findUnique({
        where: { token: sessionToken },
        include: {
          user: true,
        },
      });

      if (!sessionData) {
        throw new ApiError(401, "Invalid or expired session");
      }

      if (sessionData.expiresAt < new Date()) {
        throw new ApiError(401, "Session expired");
      }

      const user = sessionData.user;
      
      if (user.status === UserStatus.SUSPENDED || user.status === UserStatus.DISABLED) {
        throw new ApiError(403, `Account is ${user.status.toLowerCase()}`);
      }

      userId = user.id;
      userRole = user.role;
      userEmail = user.email;
    }

    if (!userId || !userRole || !userEmail) {
      throw new ApiError(401, "Authentication failed");
    }

    (req as any).user = {
      id: userId,
      email: userEmail,
      role: userRole,
      permissions: ROLE_PERMISSIONS[userRole] || [],
    };

    next();
  }
);
