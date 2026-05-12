import { z } from "zod";

export const createConfirmationSchema = z.object({
  paymentId: z.string().min(1, "Payment is required"),
  note: z.string().optional(),
});

export const cancelConfirmationSchema = z.object({
  cancellationReason: z.string().min(3, "Cancellation reason must be at least 3 characters"),
});
