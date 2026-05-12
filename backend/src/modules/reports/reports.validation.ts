import { z } from 'zod';

export const reportsValidation = {
  getCollections: {
    query: z.object({
      fromDate: z.string().optional(),
      toDate: z.string().optional(),
      taxYear: z.string().optional(),
      locationCategoryId: z.string().uuid().optional(),
      paymentMethod: z.string().optional(),
    }),
  },
  getUnpaid: {
    query: z.object({
      page: z.string().optional(),
      limit: z.string().optional(),
      taxYear: z.string().optional(),
      locationCategoryId: z.string().uuid().optional(),
      search: z.string().optional(),
      sortBy: z.string().optional(),
      sortOrder: z.enum(['asc', 'desc']).optional(),
    }),
  },
  getProperties: {
    query: z.object({
      locationCategoryId: z.string().uuid().optional(),
      status: z.string().optional(),
    }),
  },
  getAssessments: {
    query: z.object({
      taxYear: z.string().optional(),
      status: z.string().optional(),
      locationCategoryId: z.string().uuid().optional(),
    }),
  },
  getPayments: {
    query: z.object({
      status: z.string().optional(),
      method: z.string().optional(),
      taxYear: z.string().optional(),
      fromDate: z.string().optional(),
      toDate: z.string().optional(),
    }),
  },
};
