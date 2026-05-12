import { apiClient } from "@/lib/api-client";
import { 
  ConfirmationsResponse, 
  ConfirmationResponse, 
  ConfirmationListParams, 
  CreateConfirmationInput, 
  CancelConfirmationInput 
} from "./types";

export const confirmationsApi = {
  getConfirmations: (params: ConfirmationListParams) => {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) query.append(key, value.toString());
    });
    return apiClient.get<ConfirmationsResponse>(`/confirmations?${query.toString()}`);
  },

  getConfirmation: (id: string) => {
    return apiClient.get<ConfirmationResponse>(`/confirmations/${id}`);
  },

  createConfirmation: (data: CreateConfirmationInput) => {
    return apiClient.post<ConfirmationResponse>("/confirmations", data);
  },

  createConfirmationForPayment: (paymentId: string, data: Partial<CreateConfirmationInput>) => {
    return apiClient.post<ConfirmationResponse>(`/confirmations/payment/${paymentId}`, data);
  },

  getConfirmationByPayment: (paymentId: string) => {
    return apiClient.get<ConfirmationResponse>(`/confirmations/payment/${paymentId}`);
  },

  cancelConfirmation: (id: string, data: CancelConfirmationInput) => {
    return apiClient.patch<ConfirmationResponse>(`/confirmations/${id}/cancel`, data);
  },

  markAsPrinted: (id: string) => {
    return apiClient.patch<ConfirmationResponse>(`/confirmations/${id}/print`, {});
  },
};
