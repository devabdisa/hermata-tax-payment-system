import { apiClient } from "@/lib/api-client";
import { 
  Property, 
  PropertyListParams, 
  CreatePropertyInput, 
  UpdatePropertyInput,
  RejectPropertyInput
} from "./types";

export const propertiesApi = {
  getProperties: (params: PropertyListParams = {}) => {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        query.append(key, String(value));
      }
    });
    return apiClient.get<{ data: Property[]; meta: any }>(`/properties?${query.toString()}`);
  },

  getProperty: (id: string) => {
    return apiClient.get<{ data: Property }>(`/properties/${id}`);
  },

  createProperty: (data: CreatePropertyInput) => {
    return apiClient.post<{ data: Property }>("/properties", data);
  },

  updateProperty: (id: string, data: UpdatePropertyInput) => {
    return apiClient.patch<{ data: Property }>(`/properties/${id}`, data);
  },

  submitProperty: (id: string) => {
    return apiClient.patch<{ data: Property }>(`/properties/${id}/submit`, {});
  },

  startReviewProperty: (id: string) => {
    return apiClient.patch<{ data: Property }>(`/properties/${id}/start-review`, {});
  },

  approveProperty: (id: string) => {
    return apiClient.patch<{ data: Property }>(`/properties/${id}/approve`, {});
  },

  rejectProperty: (id: string, data: RejectPropertyInput) => {
    return apiClient.patch<{ data: Property }>(`/properties/${id}/reject`, data);
  },

  archiveProperty: (id: string) => {
    return apiClient.patch<{ data: Property }>(`/properties/${id}/archive`, {});
  },
};
