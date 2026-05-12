import { KebeleConfirmation, ConfirmationStatus, Payment, TaxAssessment, Property, HouseOwnerProfile, User } from '@prisma/client';

export type ConfirmationWithDetails = KebeleConfirmation & {
  payment: Payment & {
    assessment: TaxAssessment & {
      property: Property & {
        owner: HouseOwnerProfile | null;
        locationCategory: { name: string } | null;
      } | null;
    } | null;
  };
  issuedBy?: { name: string; email: string } | null;
  cancelledBy?: { name: string; email: string } | null;
};

export interface ConfirmationListQuery {
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
  sortOrder?: 'asc' | 'desc';
  mine?: boolean;
}

export interface CreateConfirmationData {
  paymentId: string;
  note?: string;
}

export interface CancelConfirmationData {
  cancellationReason: string;
}
