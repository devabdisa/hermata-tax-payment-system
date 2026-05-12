import { z } from "zod";

export const sinqeeReceiptPaymentSchema = z.object({
  assessmentId: z.string().min(1, "Assessment is required"),
  amount: z.coerce.number().positive("Amount must be positive"),
  paidAt: z.string().min(1, "Payment date is required"),
  referenceNumber: z.string().min(2, "Reference number is required"),
  bankBranch: z.string().optional(),
  note: z.string().optional(),
  file: z.any().refine((files) => files?.length > 0, "Receipt file is required"),
});

export const rejectPaymentSchema = z.object({
  rejectionReason: z.string().min(3, "Rejection reason must be at least 3 characters"),
});

export const cancelPaymentSchema = z.object({
  cancellationReason: z.string().optional(),
});

export const initiateChapaPaymentSchema = z.object({
  assessmentId: z.string().min(1, "Assessment is required"),
});
