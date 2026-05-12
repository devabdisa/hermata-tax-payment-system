import { apiClient } from "@/lib/api-client";
import { 
  DocumentsResponse, 
  DocumentResponse, 
  DocumentListParams, 
  UpdateDocumentInput, 
  RejectDocumentInput 
} from "./types";

export const propertyDocumentsApi = {
  getDocuments: (params: DocumentListParams) => {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) query.append(key, value.toString());
    });
    return apiClient.get<DocumentsResponse>(`/documents?${query.toString()}`);
  },

  getDocument: (id: string) => {
    return apiClient.get<DocumentResponse>(`/documents/${id}`);
  },

  uploadDocument: (data: FormData) => {
    return apiClient.post<DocumentResponse>("/documents/upload", data);
  },

  updateDocument: (id: string, data: UpdateDocumentInput) => {
    return apiClient.patch<DocumentResponse>(`/documents/${id}`, data);
  },

  approveDocument: (id: string) => {
    return apiClient.patch<DocumentResponse>(`/documents/${id}/approve`, {});
  },

  rejectDocument: (id: string, data: RejectDocumentInput) => {
    return apiClient.patch<DocumentResponse>(`/documents/${id}/reject`, data);
  },

  replaceDocument: (id: string, data: FormData) => {
    return apiClient.patch<DocumentResponse>(`/documents/${id}/replace`, data);
  },

  deleteDocument: (id: string) => {
    return apiClient.delete<DocumentResponse>(`/documents/${id}`);
  },
};
