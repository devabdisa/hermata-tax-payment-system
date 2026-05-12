import { Request, Response, NextFunction, RequestHandler } from "express";
import { z } from "zod";
import { ApiError } from "../utils/api-error";

/**
 * Validation middleware using Zod
 */
export const validate = (schema: {
  body?: z.ZodTypeAny;
  query?: z.ZodTypeAny;
  params?: z.ZodTypeAny;
}): RequestHandler => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (schema.params) {
        req.params = (await schema.params.parseAsync(req.params)) as any;
      }
      if (schema.query) {
        req.query = (await schema.query.parseAsync(req.query)) as any;
      }
      if (schema.body) {
        req.body = await schema.body.parseAsync(req.body);
      }
      return next();
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        const errorDetails = error.issues.map((issue: any) => ({
          field: issue.path.join("."),
          message: issue.message,
        }));
        return next(new ApiError(400, "Validation failed", errorDetails));
      }
      return next(error);
    }
  };
};

export default validate;
