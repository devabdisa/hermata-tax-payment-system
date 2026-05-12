export enum UserRole {
  ADMIN = "ADMIN",
  MANAGER = "MANAGER",
  ASSIGNED_WORKER = "ASSIGNED_WORKER",
  USER = "USER",
}

export type Role = keyof typeof UserRole;
