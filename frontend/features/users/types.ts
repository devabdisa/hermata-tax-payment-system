export type UserRole = 'ADMIN' | 'MANAGER' | 'ASSIGNED_WORKER' | 'USER';
export type UserStatus = 'ACTIVE' | 'SUSPENDED' | 'DISABLED';

export interface User {
  id: string;
  name: string;
  email: string;
  image?: string;
  role: UserRole;
  status: UserStatus;
  createdAt: string;
  updatedAt: string;
  ownerProfile?: { id: string } | null;
  _count?: {
    issuedAssessments: number;
    verifiedPayments: number;
  };
}

export interface UserFormData {
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  image?: string;
}
