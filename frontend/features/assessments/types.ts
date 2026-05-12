import { Property } from "../properties/types";
import { TaxRate } from "../tax-rates/types";

export type AssessmentStatus = "DRAFT" | "ISSUED" | "PAID" | "OVERDUE" | "CANCELLED";

export interface TaxAssessment {
  id: string;
  propertyId: string;
  property?: Property;
  taxRateId: string;
  taxRate?: TaxRate;
  taxYear: number;
  landSizeKare: number | string;
  ratePerKare: number | string;
  baseAmount: number | string;
  penaltyAmount: number | string;
  previousBalance: number | string;
  totalAmount: number | string;
  status: AssessmentStatus;
  
  issuedById?: string;
  issuedBy?: { id: string; name: string; email: string };
  approvedById?: string;
  approvedBy?: { id: string; name: string; email: string };
  
  issuedAt?: string;
  dueDate?: string;
  note?: string;
  
  cancelledById?: string;
  cancelledBy?: { id: string; name: string; email: string };
  cancelledAt?: string;
  cancellationReason?: string;
  
  createdAt: string;
  updatedAt: string;
}

export interface AssessmentListParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: AssessmentStatus;
  taxYear?: number;
  propertyId?: string;
  ownerId?: string;
  locationCategoryId?: string;
  mine?: boolean;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface CreateAssessmentInput {
  propertyId: string;
  taxYear: number;
  penaltyAmount?: number;
  previousBalance?: number;
  dueDate?: string;
  note?: string;
  saveAsDraft?: boolean;
  issueNow?: boolean;
}

export interface UpdateAssessmentInput {
  penaltyAmount?: number;
  previousBalance?: number;
  dueDate?: string;
  note?: string;
}

export interface CancelAssessmentInput {
  cancellationReason: string;
}

export interface AssessmentResponse {
  success: boolean;
  message: string;
  data: TaxAssessment;
}

export interface AssessmentsResponse {
  success: boolean;
  message: string;
  data: TaxAssessment[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}
