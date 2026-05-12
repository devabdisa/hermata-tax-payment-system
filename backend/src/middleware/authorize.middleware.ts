import { Request, Response, NextFunction } from "express";
import { ApiError } from "../utils/api-error";
import { Permission } from "../constants/permissions";

/**
 * Middleware to check if the authenticated user has the required permissions.
 */
export const authorize = (...requiredPermissions: Permission[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new ApiError(401, "Please authenticate"));
    }

    if (requiredPermissions.length === 0) {
      return next();
    }

    const hasPermission = requiredPermissions.some((permission) =>
      req.user?.permissions.includes(permission)
    );

    if (!hasPermission) {
      return next(new ApiError(403, "Forbidden: You do not have the required permissions"));
    }

    next();
  };
};
