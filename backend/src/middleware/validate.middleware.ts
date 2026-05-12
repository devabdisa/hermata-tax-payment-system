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
        const parsedParams = await schema.params.parseAsync(req.params);
        Object.defineProperty(req, 'params', { value: parsedParams, writable: true, configurable: true });
      }
      if (schema.query) {
        const parsedQuery = await schema.query.parseAsync(req.query);
        Object.defineProperty(req, 'query', { value: parsedQuery, writable: true, configurable: true });
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
