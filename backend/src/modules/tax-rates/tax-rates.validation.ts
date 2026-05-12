import { z } from "zod";

export const createTaxRateSchema = z.object({
  taxYear: z.number().int().min(2000).max(2100),
  locationCategoryId: z.string().min(1, "Location Category is required"),
  ratePerKare: z.number().positive("Rate per kare must be positive"),
  penaltyType: z.string().optional(),
  penaltyValue: z.number().nonnegative().optional(),
  dueDate: z.string().datetime().optional(),
  isActive: z.boolean().optional(),
});

export const updateTaxRateSchema = createTaxRateSchema.partial();

export const taxRateQuerySchema = z.object({
  page: z.string().regex(/^\d+$/).optional(),
  limit: z.string().regex(/^\d+$/).optional(),
  search: z.string().optional(),
  taxYear: z.string().regex(/^\d+$/).optional(),
  locationCategoryId: z.string().optional(),
  isActive: z.string().optional(),
  sortBy: z.string().optional(),
  sortOrder: z.enum(["asc", "desc"]).optional(),
});
