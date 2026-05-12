import { Request, Response, NextFunction } from "express";
import { ApiError } from "../utils/api-error";
import { catchAsync } from "../utils/catch-async";
import { ROLE_PERMISSIONS } from "../constants/permissions";

/**
 * Better Auth Session Interface (Partial)
 */
export interface UserSession {
  user: {
    id: string;
    email: string;
    role: string;
    name?: string;
  };
  session: {
    id: string;
    expiresAt: Date;
  };
}

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
        role: string;
        permissions: string[];
      };
    }
  }
}

/**
 * Middleware to verify Better Auth session.
 * For now, this is a placeholder that documents where verification should happen.
 * It also supports a development bypass if needed.
 */
export const authMiddleware = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    // 1. Get session from Better Auth (e.g. using auth.api.getSession({ headers: req.headers }))
    // For now, we'll look for a dummy header or cookie in dev, or just fail with 401.
    
    // TODO: Final integration with Better Auth server instance
    // const session = await auth.api.getSession({ headers: req.headers });
    
    const isDevelopment = process.env.NODE_ENV === "development";
    const authHeader = req.headers.authorization;
    
    let session: UserSession | null = null;
    
    // Dummy bypass for development testing if enabled
    if (isDevelopment && authHeader?.startsWith("Bearer dev-")) {
      const role = authHeader.replace("Bearer dev-", "").toUpperCase();
      session = {
        user: {
          id: "dev-user-id",
          email: "dev@example.com",
          role: role || "USER",
          name: "Dev User",
        },
        session: {
          id: "dev-session-id",
          expiresAt: new Date(Date.now() + 1000 * 60 * 60),
        },
      };
    }

    if (!session) {
      throw new ApiError(401, "Please authenticate");
    }

    req.user = {
      id: session.user.id,
      email: session.user.email,
      role: session.user.role,
      permissions: ROLE_PERMISSIONS[session.user.role] || [],
    };

    next();
  }
);
