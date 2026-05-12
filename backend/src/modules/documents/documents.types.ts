import { z } from "zod";
import { 
  uploadDocumentSchema, 
  updateDocumentSchema, 
  documentQuerySchema,
  rejectDocumentSchema
} from "./documents.validation";

export type UploadDocumentDto = z.infer<typeof uploadDocumentSchema>;
export type UpdateDocumentDto = z.infer<typeof updateDocumentSchema>;
export type DocumentQueryDto = z.infer<typeof documentQuerySchema>;
export type RejectDocumentDto = z.infer<typeof rejectDocumentSchema>;
