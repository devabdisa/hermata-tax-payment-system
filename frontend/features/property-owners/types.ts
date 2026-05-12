import { User } from "../users/types";

export interface PropertyOwner {
  id: string;
  userId?: string;
  fullName: string;
  phone: string;
  nationalId?: string;
  kebeleIdNumber?: string;
  address?: string;
  createdAt: string;
  updatedAt: string;
  user?: User;
  properties?: any[]; // Replace with Property type if available
  _count?: {
    properties: number;
  };
}

export interface PropertyOwnerFormData {
  fullName: string;
  phone: string;
  nationalId?: string;
  kebeleIdNumber?: string;
  address?: string;
  userId?: string;
}
