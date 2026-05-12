import { z } from 'zod';
import { ConfirmationStatus } from '@prisma/client';

export const listConfirmationsQuerySchema = z.object({
  page: z.string().optional().transform((val) => (val ? parseInt(val, 10) : 1)),
  limit: z.string().optional().transform((val) => (val ? parseInt(val, 10) : 10)),
  search: z.string().optional(),
  status: z.nativeEnum(ConfirmationStatus).optional(),
  paymentId: z.string().optional(),
  assessmentId: z.string().optional(),
  propertyId: z.string().optional(),
  taxYear: z.string().optional().transform((val) => (val ? parseInt(val, 10) : undefined)),
  issuedById: z.string().optional(),
  sortBy: z.string().optional().default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).optional().default('desc'),
  mine: z.string().optional().transform((val) => val === 'true'),
});

export const confirmationIdParamSchema = z.object({
  id: z.string().min(1, 'Confirmation ID is required'),
});

export const paymentIdParamSchema = z.object({
  paymentId: z.string().min(1, 'Payment ID is required'),
});

export const createConfirmationSchema = z.object({
  paymentId: z.string().min(1, 'Payment ID is required'),
  note: z.string().optional(),
});

export const cancelConfirmationSchema = z.object({
  cancellationReason: z.string().min(3, 'Cancellation reason must be at least 3 characters'),
});
