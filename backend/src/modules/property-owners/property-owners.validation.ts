import { z } from "zod";

export const createPropertyOwnerSchema = z.object({
  userId: z.string().optional(),
  fullName: z.string().min(2, "Full name is required"),
  phone: z.string().min(9, "Valid phone number is required"),
  nationalId: z.string().optional(),
  kebeleIdNumber: z.string().optional(),
  address: z.string().optional(),
});

export const updatePropertyOwnerSchema = z.object({
  fullName: z.string().min(2).optional(),
  phone: z.string().min(9).optional(),
  nationalId: z.string().optional(),
  kebeleIdNumber: z.string().optional(),
  address: z.string().optional(),
});

export const upsertMyPropertyOwnerSchema = z.object({
  fullName: z.string().min(2, "Full name is required"),
  phone: z.string().min(9, "Valid phone number is required"),
  nationalId: z.string().optional(),
  kebeleIdNumber: z.string().optional(),
  address: z.string().optional(),
});

export const propertyOwnerQuerySchema = z.object({
  search: z.string().optional(),
});
