import { z } from "zod";

export const locationCategorySchema = z.object({
  id: z.string().optional(),
  name: z.string().min(2, "Name must be at least 2 characters"),
  code: z.string().min(1, "Code must be at least 1 character").toUpperCase(),
  description: z.string().optional(),
  priority: z.coerce.number().int().optional(),
  isActive: z.boolean().default(true),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
});

export const locationCategoryQuerySchema = z.object({
  page: z.number().optional(),
  limit: z.number().optional(),
  search: z.string().optional(),
  isActive: z.boolean().optional(),
  sortBy: z.string().optional(),
  sortOrder: z.enum(["asc", "desc"]).optional(),
});
