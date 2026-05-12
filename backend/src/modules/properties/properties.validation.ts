import { z } from 'zod';
import { PropertyStatus, OwnershipType } from '@prisma/client';

export const createPropertySchema = z.object({
  houseNumber: z.string().min(1, 'House number is required'),
  fileNumber: z.string().min(1, 'File number is required'),
  landSizeKare: z.coerce.number().positive('Land size must be positive'),
  ownershipType: z.nativeEnum(OwnershipType),
  locationCategoryId: z.string().optional(),
  locationDescription: z.string().optional(),
  ownerId: z.string().optional(), // For worker/admin flow
  status: z.nativeEnum(PropertyStatus).optional(),
  saveAsDraft: z.boolean().optional(),
});

export const updatePropertySchema = z.object({
  houseNumber: z.string().min(1).optional(),
  fileNumber: z.string().min(1).optional(),
  landSizeKare: z.coerce.number().positive().optional(),
  ownershipType: z.nativeEnum(OwnershipType).optional(),
  locationCategoryId: z.string().optional(),
  locationDescription: z.string().optional(),
  status: z.nativeEnum(PropertyStatus).optional(),
});

export const rejectPropertySchema = z.object({
  rejectionReason: z.string().min(3, 'Rejection reason must be at least 3 characters'),
});

export const propertyQuerySchema = z.object({
  page: z.coerce.number().int().positive().optional().default(1),
  limit: z.coerce.number().int().positive().optional().default(10),
  search: z.string().optional(),
  status: z.nativeEnum(PropertyStatus).optional(),
  ownershipType: z.nativeEnum(OwnershipType).optional(),
  locationCategoryId: z.string().optional(),
  ownerId: z.string().optional(),
  mine: z.coerce.boolean().optional(),
  sortBy: z.string().optional().default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).optional().default('desc'),
});

export const propertyIdParamSchema = z.object({
  id: z.string(),
});
