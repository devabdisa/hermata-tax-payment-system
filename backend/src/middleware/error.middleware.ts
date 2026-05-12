import type { Request, Response, NextFunction } from "express";
import { ApiError } from "../utils/api-error";

/**
 * Handler for unknown routes
 */
export const notFoundHandler = (_req: Request, _res: Response, next: NextFunction) => {
  next(new ApiError(404, "Route not found"));
};

/**
 * Centralized error handler
 */
export const errorHandler = (err: any, req: Request, res: Response, _next: NextFunction) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || "Internal Server Error";
  let errors = err.errors || [];

  // Handle Prisma errors if needed
  if (err.code?.startsWith("P")) {
    statusCode = 400;
    message = "Database error";
    // Detailed prisma error handling could be added here
  }

  // Handle Zod validation errors
  if (err.name === "ZodError") {
    statusCode = 400;
    message = "Validation error";
    errors = err.issues;
  }

  return res.status(statusCode).json({
    success: false,
    message: message,
    errors: errors,
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
  });
};
