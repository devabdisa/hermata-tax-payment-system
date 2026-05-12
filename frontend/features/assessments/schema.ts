import { z } from "zod";

export const createAssessmentSchema = z.object({
  propertyId: z.string().min(1, "Property is required"),
  taxYear: z.coerce.number().int().min(2000).max(2100),
  penaltyAmount: z.coerce.number().min(0).optional().default(0),
  previousBalance: z.coerce.number().min(0).optional().default(0),
  dueDate: z.string().optional(),
  note: z.string().optional(),
  saveAsDraft: z.boolean().optional().default(true),
  issueNow: z.boolean().optional().default(false),
});

export const updateAssessmentSchema = z.object({
  penaltyAmount: z.coerce.number().min(0).optional(),
  previousBalance: z.coerce.number().min(0).optional(),
  dueDate: z.string().optional(),
  note: z.string().optional(),
});

export const cancelAssessmentSchema = z.object({
  cancellationReason: z.string().min(3, "Cancellation reason must be at least 3 characters"),
});
