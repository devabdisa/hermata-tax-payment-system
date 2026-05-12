export type DocumentStatus = "PENDING" | "APPROVED" | "REJECTED";

export interface PropertyDocument {
  id: string;
  propertyId: string;
  uploadedById: string;
  title: string;
  fileUrl: string;
  fileName: string;
  mimeType?: string;
  fileSize?: number;
  documentType?: string;
  note?: string;
  status: DocumentStatus;
  reviewedById?: string;
  reviewedBy?: {
    id: string;
    name: string;
    email: string;
  };
  reviewedAt?: string;
  rejectionReason?: string;
  createdAt: string;
  updatedAt: string;
  property?: {
    id: string;
    houseNumber: string;
    fileNumber: string;
    status: string;
  };
}

export interface DocumentListParams {
  page?: number;
  limit?: number;
  search?: string;
  propertyId?: string;
  status?: DocumentStatus;
  uploadedById?: string;
  mine?: boolean;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface UploadDocumentInput {
  propertyId: string;
  title: string;
  documentType?: string;
  note?: string;
  file: File;
}

export interface UpdateDocumentInput {
  title?: string;
  documentType?: string;
  note?: string;
}

export interface RejectDocumentInput {
  rejectionReason: string;
}

export interface DocumentResponse {
  success: boolean;
  message: string;
  data: PropertyDocument;
}

export interface DocumentsResponse {
  success: boolean;
  message: string;
  data: PropertyDocument[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}
