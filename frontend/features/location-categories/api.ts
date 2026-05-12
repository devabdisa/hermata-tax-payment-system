import { apiClient } from "@/lib/api-client";
import { LocationCategory, LocationCategoriesResponse, LocationCategoryResponse, LocationCategoryQuery } from "./types";

export const locationCategoriesApi = {
  getAll: (query?: LocationCategoryQuery) => {
    const params = new URLSearchParams();
    if (query) {
      Object.entries(query).forEach(([key, value]) => {
        if (value !== undefined && value !== "") {
          params.append(key, String(value));
        }
      });
    }
    return apiClient.get<LocationCategoriesResponse>(`/location-categories?${params.toString()}`);
  },

  getById: (id: string) => {
    return apiClient.get<LocationCategoryResponse>(`/location-categories/${id}`);
  },

  create: (data: Partial<LocationCategory>) => {
    return apiClient.post<LocationCategoryResponse>("/location-categories", data);
  },

  update: (id: string, data: Partial<LocationCategory>) => {
    return apiClient.patch<LocationCategoryResponse>(`/location-categories/${id}`, data);
  },

  activate: (id: string) => {
    return apiClient.patch<LocationCategoryResponse>(`/location-categories/${id}/activate`, {});
  },

  deactivate: (id: string) => {
    return apiClient.patch<LocationCategoryResponse>(`/location-categories/${id}/deactivate`, {});
  },
};
