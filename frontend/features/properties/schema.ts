import { z } from "zod";

export const createPropertySchema = z.object({
  houseNumber: z.string().min(1, "House number is required"),
  fileNumber: z.string().min(1, "File number is required"),
  landSizeKare: z.coerce.number().positive("Land size must be positive"),
  ownershipType: z.enum(["LEASE", "OLD_POSSESSION", "RENTAL", "OTHER"], {
    required_error: "Ownership type is required",
  }),
  locationCategoryId: z.string().optional(),
  locationDescription: z.string().optional(),
  ownerId: z.string().optional(),
  saveAsDraft: z.boolean().optional().default(false),
});

export const updatePropertySchema = createPropertySchema.partial().extend({
  status: z.enum(["DRAFT", "SUBMITTED", "UNDER_REVIEW", "APPROVED", "REJECTED", "ARCHIVED"]).optional(),
});

export const rejectPropertySchema = z.object({
  rejectionReason: z.string().min(3, "Rejection reason must be at least 3 characters"),
});
