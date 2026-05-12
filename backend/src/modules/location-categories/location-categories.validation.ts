import { z } from "zod";

export const createLocationCategorySchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  code: z.string().min(1, "Code must be at least 1 character"),
  description: z.string().optional(),
  priority: z.number().int().optional(),
  isActive: z.boolean().optional(),
});

export const updateLocationCategorySchema = createLocationCategorySchema.partial();

export const locationCategoryQuerySchema = z.object({
  page: z.string().regex(/^\d+$/).optional(),
  limit: z.string().regex(/^\d+$/).optional(),
  search: z.string().optional(),
  isActive: z.string().optional(), // 'true' or 'false'
  sortBy: z.string().optional(),
  sortOrder: z.enum(["asc", "desc"]).optional(),
});
