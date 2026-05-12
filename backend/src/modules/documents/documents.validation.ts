import { z } from 'zod';
import { DocumentStatus } from '@prisma/client';

export const uploadDocumentSchema = z.object({
  propertyId: z.string().min(1, 'Property ID is required'),
  title: z.string().min(2, 'Title must be at least 2 characters'),
  documentType: z.string().optional(),
  note: z.string().optional(),
});

export const updateDocumentSchema = z.object({
  title: z.string().min(2).optional(),
  documentType: z.string().optional(),
  note: z.string().optional(),
});

export const rejectDocumentSchema = z.object({
  rejectionReason: z.string().min(3, 'Rejection reason must be at least 3 characters'),
});

export const documentQuerySchema = z.object({
  page: z.coerce.number().int().positive().optional().default(1),
  limit: z.coerce.number().int().positive().optional().default(10),
  search: z.string().optional(),
  propertyId: z.string().optional(),
  status: z.nativeEnum(DocumentStatus).optional(),
  uploadedById: z.string().optional(),
  reviewedById: z.string().optional(),
  mine: z.coerce.boolean().optional(),
  sortBy: z.string().optional().default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).optional().default('desc'),
});

export const documentIdParamSchema = z.object({
  id: z.string(),
});
