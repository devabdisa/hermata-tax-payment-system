import { apiClient } from "@/lib/api-client";
import { 
  Payment, 
  PaymentListParams, 
  InitiateChapaPaymentInput 
} from "./types";

export const paymentsApi = {
  getMany: (params: PaymentListParams) => {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        query.append(key, value.toString());
      }
    });
    return apiClient.get<{ data: Payment[]; meta: any }>(`/payments?${query.toString()}`);
  },

  getOne: (id: string) => {
    return apiClient.get<{ data: Payment }>(`/payments/${id}`);
  },

  createSinqeeReceipt: (formData: FormData) => {
    return apiClient.post<{ data: Payment }>("/payments/sinqee-receipt", formData);
  },

  verify: (id: string) => {
    return apiClient.patch<{ data: Payment }>(`/payments/${id}/verify`, {});
  },

  reject: (id: string, rejectionReason: string) => {
    return apiClient.patch<{ data: Payment }>(`/payments/${id}/reject`, { rejectionReason });
  },

  cancel: (id: string, cancellationReason?: string) => {
    return apiClient.patch<{ data: Payment }>(`/payments/${id}/cancel`, { cancellationReason });
  },

  initiateChapa: (data: InitiateChapaPaymentInput) => {
    return apiClient.post<{ data: { payment: Payment; checkoutUrl: string; txRef: string } }>(
      "/payments/chapa/initiate", 
      data
    );
  },

  verifyChapa: (txRef: string) => {
    return apiClient.get<{ data: { payment: Payment; alreadyVerified: boolean } }>(
      `/payments/chapa/verify/${txRef}`
    );
  }
};
