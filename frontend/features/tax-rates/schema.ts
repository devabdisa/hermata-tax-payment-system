import { z } from "zod";

export const taxRateSchema = z.object({
  id: z.string().optional(),
  taxYear: z.coerce.number().int().min(2000).max(2100),
  locationCategoryId: z.string().min(1, "Location Category is required"),
  ratePerKare: z.coerce.number().positive("Rate per kare must be positive"),
  penaltyType: z.string().optional(),
  penaltyValue: z.coerce.number().nonnegative().optional(),
  dueDate: z.string().optional(),
  isActive: z.boolean().default(true),
});

export const taxRateQuerySchema = z.object({
  page: z.number().optional(),
  limit: z.number().optional(),
  search: z.string().optional(),
  taxYear: z.number().optional(),
  locationCategoryId: z.string().optional(),
  isActive: z.boolean().optional(),
  sortBy: z.string().optional(),
  sortOrder: z.enum(["asc", "desc"]).optional(),
});
