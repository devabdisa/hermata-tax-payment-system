import { z } from "zod";
import { PaymentStatus, PaymentMethod } from "@prisma/client";

export const paymentIdParamSchema = z.object({
  id: z.string().min(1, "Payment ID is required"),
});

export const txRefParamSchema = z.object({
  txRef: z.string().min(1, "txRef is required"),
});

export const listPaymentsQuerySchema = z.object({
  page: z.coerce.number().int().positive().optional(),
  limit: z.coerce.number().int().positive().max(100).optional(),
  search: z.string().optional(),
  status: z.nativeEnum(PaymentStatus).optional(),
  method: z.nativeEnum(PaymentMethod).optional(),
  assessmentId: z.string().optional(),
  payerId: z.string().optional(),
  taxYear: z.coerce.number().int().optional(),
  propertyId: z.string().optional(),
  sortBy: z.string().optional(),
  sortOrder: z.enum(["asc", "desc"]).optional(),
  mine: z.coerce.boolean().optional(),
});

export const createSinqeeReceiptPaymentSchema = z.object({
  assessmentId: z.string().min(1, "Assessment ID is required"),
  amount: z.coerce.number().positive("Amount must be positive"),
  paidAt: z.string().min(1, "Payment date is required"),
  referenceNumber: z.string().min(2, "Reference number must be at least 2 characters"),
  bankBranch: z.string().optional(),
  note: z.string().optional(),
});

export const rejectPaymentSchema = z.object({
  rejectionReason: z.string().min(3, "Rejection reason must be at least 3 characters"),
});

export const cancelPaymentSchema = z.object({
  cancellationReason: z.string().optional(),
});

export const initiateChapaPaymentSchema = z.object({
  assessmentId: z.string().min(1, "Assessment ID is required"),
  returnUrl: z.string().url().optional(),
  callbackUrl: z.string().url().optional(),
});

export const chapaWebhookSchema = z.object({
  trx_ref: z.string().optional(),
  tx_ref: z.string().optional(),
  status: z.string().optional(),
}).passthrough();
