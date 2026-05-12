export type PaymentStatus = "PENDING" | "UNDER_REVIEW" | "VERIFIED" | "REJECTED" | "CANCELLED";
export type PaymentMethod = "ONLINE" | "SINQEE_BANK" | "CHAPA" | "CASH_MANUAL" | "OTHER";

export interface Payment {
  id: string;
  assessmentId: string;
  payerId: string | null;
  method: PaymentMethod;
  status: PaymentStatus;
  amount: number;
  paidAt: string | null;
  referenceNumber: string | null;
  bankName: string | null;
  bankBranch: string | null;
  receiptFileUrl: string | null;
  receiptFileName: string | null;
  
  // Chapa fields
  txRef: string | null;
  chapaCheckoutUrl: string | null;
  chapaTransactionId: string | null;
  chapaStatus: string | null;
  chapaPayload: any | null;
  
  verifiedById: string | null;
  verifiedAt: string | null;
  rejectionReason: string | null;
  cancellationReason: string | null;
  note: string | null;
  createdAt: string;
  updatedAt: string;

  assessment?: any; // Will be typed properly when integrated
  verifiedBy?: {
    id: string;
    name: string;
    email: string;
  } | null;
}

export interface PaymentListParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: PaymentStatus;
  method?: PaymentMethod;
  assessmentId?: string;
  payerId?: string;
  taxYear?: number;
  propertyId?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  mine?: boolean;
}

export interface SinqeeReceiptPaymentInput {
  assessmentId: string;
  amount: number;
  paidAt: string;
  referenceNumber: string;
  bankBranch?: string;
  note?: string;
  file?: File;
}

export interface RejectPaymentInput {
  rejectionReason: string;
}

export interface CancelPaymentInput {
  cancellationReason?: string;
}

export interface InitiateChapaPaymentInput {
  assessmentId: string;
  returnUrl?: string;
  callbackUrl?: string;
}
