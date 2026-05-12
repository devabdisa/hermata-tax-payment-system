export type PropertyStatus = 
  | "DRAFT"
  | "SUBMITTED"
  | "UNDER_REVIEW"
  | "APPROVED"
  | "REJECTED"
  | "ARCHIVED";

export type OwnershipType = 
  | "LEASE"
  | "OLD_POSSESSION"
  | "RENTAL"
  | "OTHER";

export interface Property {
  id: string;
  ownerId: string;
  houseNumber: string;
  fileNumber: string;
  landSizeKare: number | string;
  locationDescription?: string | null;
  locationCategoryId?: string | null;
  ownershipType: OwnershipType;
  status: PropertyStatus;
  createdAt: string;
  updatedAt: string;
  
  owner?: {
    id: string;
    fullName: string;
    phone: string;
    nationalId?: string | null;
  };
  
  locationCategory?: {
    id: string;
    name: string;
    code: string;
  };
  
  reviewedBy?: {
    id: string;
    name: string;
    email: string;
  } | null;
  
  reviewedAt?: string | null;
  
  approvedBy?: {
    id: string;
    name: string;
    email: string;
  } | null;
  
  approvedAt?: string | null;
  
  rejectionReason?: string | null;
  
  _count?: {
    documents: number;
  };
}

export interface PropertyListParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: PropertyStatus;
  ownershipType?: OwnershipType;
  locationCategoryId?: string;
  ownerId?: string;
  mine?: boolean;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface CreatePropertyInput {
  houseNumber: string;
  fileNumber: string;
  landSizeKare: number;
  ownershipType: OwnershipType;
  locationCategoryId?: string;
  locationDescription?: string;
  ownerId?: string;
  saveAsDraft?: boolean;
}

export interface UpdatePropertyInput extends Partial<CreatePropertyInput> {
  status?: PropertyStatus;
}

export interface RejectPropertyInput {
  rejectionReason: string;
}
