import { Payment } from "../payments/types";

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

export type ConfirmationStatus = "ISSUED" | "CANCELLED";

export interface KebeleConfirmation {
  id: string;
  paymentId: string;
  payment?: Payment;
  confirmationNumber: string;
  status: ConfirmationStatus;
  issuedById: string;
  issuedBy?: Partial<User>;
  issuedAt: string;
  cancelledById?: string;
  cancelledBy?: Partial<User>;
  cancelledAt?: string;
  cancellationReason?: string;
  printCount: number;
  lastPrintedAt?: string;
  fileUrl?: string;
  note?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ConfirmationListParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: ConfirmationStatus;
  paymentId?: string;
  assessmentId?: string;
  propertyId?: string;
  taxYear?: number;
  issuedById?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  mine?: boolean;
}

export interface CreateConfirmationInput {
  paymentId: string;
  note?: string;
}

export interface CancelConfirmationInput {
  cancellationReason: string;
}

export interface ConfirmationsResponse {
  data: KebeleConfirmation[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface ConfirmationResponse {
  data: KebeleConfirmation;
}
