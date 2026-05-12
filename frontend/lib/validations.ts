import { z } from "zod";

export const propertySchema = z.object({
  houseNumber: z.string().min(1, "House number is required"),
  fileNumber: z.string().min(1, "File number is required"),
  landSizeKare: z.number().positive("Land size must be positive"),
  locationCategoryId: z.string().min(1, "Location category is required"),
  ownershipType: z.enum(["LEASE", "OLD_POSSESSION", "RENTAL", "OTHER"]),
});

export const locationCategorySchema = z.object({
  name: z.string().min(1, "Name is required"),
  code: z.string().min(1, "Code is required"),
  description: z.string().optional(),
  priority: z.number().int().default(0),
});

export const taxRateSchema = z.object({
  taxYear: z.number().int().min(2000),
  locationCategoryId: z.string().min(1, "Location category is required"),
  ratePerKare: z.number().positive(),
  penaltyType: z.string().optional(),
  penaltyValue: z.number().optional(),
  dueDate: z.string().optional(),
});

export const assessmentSchema = z.object({
  propertyId: z.string().min(1),
  taxRateId: z.string().min(1),
  taxYear: z.number().int(),
});

export const paymentSchema = z.object({
  assessmentId: z.string().min(1),
  method: z.enum(["ONLINE", "SINQEE_BANK", "CASH_MANUAL", "OTHER"]),
  amount: z.number().positive(),
  referenceNumber: z.string().optional(),
  bankName: z.string().optional(),
  bankBranch: z.string().optional(),
});
