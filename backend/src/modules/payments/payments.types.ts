import { PaymentMethod, PaymentStatus } from "@prisma/client";

export interface PaymentQueryDto {
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

export interface CreateSinqeeReceiptDto {
  assessmentId: string;
  amount: number;
  paidAt: string;
  referenceNumber: string;
  bankBranch?: string;
  note?: string;
}

export interface RejectPaymentDto {
  rejectionReason: string;
}

export interface CancelPaymentDto {
  cancellationReason?: string;
}

export interface InitiateChapaPaymentDto {
  assessmentId: string;
  returnUrl?: string;
  callbackUrl?: string;
}
