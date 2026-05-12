import { z } from 'zod';
import { AssessmentStatus } from '@prisma/client';

export const createAssessmentSchema = z.object({
  propertyId: z.string().min(1, 'Property ID is required'),
  taxYear: z.coerce.number().int().min(2000).max(2100),
  penaltyAmount: z.coerce.number().min(0).optional().default(0),
  previousBalance: z.coerce.number().min(0).optional().default(0),
  dueDate: z.string().optional(),
  note: z.string().optional(),
  saveAsDraft: z.coerce.boolean().optional().default(true),
  issueNow: z.coerce.boolean().optional().default(false),
});

export const updateAssessmentSchema = z.object({
  penaltyAmount: z.coerce.number().min(0).optional(),
  previousBalance: z.coerce.number().min(0).optional(),
  dueDate: z.string().optional(),
  note: z.string().optional(),
});

export const cancelAssessmentSchema = z.object({
  cancellationReason: z.string().min(3, 'Cancellation reason must be at least 3 characters'),
});

export const assessmentQuerySchema = z.object({
  page: z.coerce.number().int().positive().optional().default(1),
  limit: z.coerce.number().int().positive().optional().default(10),
  search: z.string().optional(),
  status: z.nativeEnum(AssessmentStatus).optional(),
  taxYear: z.coerce.number().int().optional(),
  propertyId: z.string().optional(),
  ownerId: z.string().optional(),
  locationCategoryId: z.string().optional(),
  mine: z.coerce.boolean().optional(),
  sortBy: z.string().optional().default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).optional().default('desc'),
});

export const assessmentIdParamSchema = z.object({
  id: z.string(),
});

export const propertyYearParamSchema = z.object({
  propertyId: z.string(),
  taxYear: z.coerce.number().int(),
});
