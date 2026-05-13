import { apiClient } from "@/lib/api-client";
import { ApiResponse } from "@/types/api";
import { PropertyOwner, PropertyOwnerFormData } from "./types";

export const propertyOwnersApi = {
  getOwners: (params: any = {}) => {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        query.append(key, String(value));
      }
    });
    const queryString = query.toString();
    return apiClient.get<ApiResponse<PropertyOwner[]>>(`/property-owners${queryString ? `?${queryString}` : ""}`);
  },
  
  getOwner: (id: string) => 
    apiClient.get<ApiResponse<PropertyOwner>>(`/property-owners/${id}`),

  getMyOwnerProfile: () =>
    apiClient.get<ApiResponse<PropertyOwner | null>>("/property-owners/me"),

  upsertMyOwnerProfile: (data: PropertyOwnerFormData) =>
    apiClient.put<ApiResponse<PropertyOwner>>("/property-owners/me", data),
  
  createOwner: (data: PropertyOwnerFormData) => 
    apiClient.post<ApiResponse<PropertyOwner>>("/property-owners", data),
  
  updateOwner: (id: string, data: Partial<PropertyOwnerFormData>) => 
    apiClient.patch<ApiResponse<PropertyOwner>>(`/property-owners/${id}`, data),
  
  deleteOwner: (id: string) => 
    apiClient.delete<ApiResponse<null>>(`/property-owners/${id}`),
};
