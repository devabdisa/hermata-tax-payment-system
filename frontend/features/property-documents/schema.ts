import { z } from "zod";

export const uploadDocumentSchema = z.object({
  title: z.string().min(2, "Title must be at least 2 characters"),
  documentType: z.string().optional(),
  note: z.string().optional(),
  file: z.any().refine((file) => file instanceof File, "File is required"),
});

export const updateDocumentSchema = z.object({
  title: z.string().min(2, "Title must be at least 2 characters").optional(),
  documentType: z.string().optional(),
  note: z.string().optional(),
});

export const rejectDocumentSchema = z.object({
  rejectionReason: z.string().min(3, "Rejection reason must be at least 3 characters"),
});

export const replaceDocumentSchema = z.object({
  file: z.any().refine((file) => file instanceof File, "Replacement file is required"),
});
