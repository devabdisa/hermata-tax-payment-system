import { apiClient } from "@/lib/api-client";
import { TaxRate, TaxRatesResponse, TaxRateResponse, TaxRateQuery } from "./types";

export const taxRatesApi = {
  getAll: (query?: TaxRateQuery) => {
    const params = new URLSearchParams();
    if (query) {
      Object.entries(query).forEach(([key, value]) => {
        if (value !== undefined && value !== "") {
          params.append(key, String(value));
        }
      });
    }
    return apiClient.get<TaxRatesResponse>(`/tax-rates?${params.toString()}`);
  },

  getById: (id: string) => {
    return apiClient.get<TaxRateResponse>(`/tax-rates/${id}`);
  },

  create: (data: Partial<TaxRate>) => {
    return apiClient.post<TaxRateResponse>("/tax-rates", data);
  },

  update: (id: string, data: Partial<TaxRate>) => {
    return apiClient.patch<TaxRateResponse>(`/tax-rates/${id}`, data);
  },

  activate: (id: string) => {
    return apiClient.patch<TaxRateResponse>(`/tax-rates/${id}/activate`, {});
  },

  deactivate: (id: string) => {
    return apiClient.patch<TaxRateResponse>(`/tax-rates/${id}/deactivate`, {});
  },
};
