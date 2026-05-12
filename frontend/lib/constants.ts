import { UserRole } from "../config/roles";

export const SUPPORTED_LOCALES = ['en', 'am', 'om'] as const;
export type Locale = (typeof SUPPORTED_LOCALES)[number];

export const DEFAULT_LOCALE: Locale = 'en';

export const USER_ROLES = UserRole;

export const APP_METADATA = {
  name: 'Hermata Kebele House Tax System',
  description: 'Kebele House Tax and Property Payment Management System',
};
