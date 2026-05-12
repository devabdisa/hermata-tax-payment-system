import { UserRole } from "../config/roles";
import { PERMISSIONS, Permission } from "../config/permissions";

export interface NavItem {
  title: string;
  href: string;
  iconKey: string;
  permission?: Permission;
  allowedRoles?: UserRole[];
}

export const NAVIGATION_ITEMS: NavItem[] = [
  {
    title: "Dashboard",
    href: "/dashboard",
    iconKey: "layout-dashboard",
    permission: PERMISSIONS.DASHBOARD_VIEW,
  },
  {
    title: "Users",
    href: "/users",
    iconKey: "users",
    permission: PERMISSIONS.USERS_MANAGE,
  },
  {
    title: "Property Owners",
    href: "/property-owners",
    iconKey: "user-square-2",
    permission: PERMISSIONS.PROPERTY_OWNERS_VIEW,
  },
  {
    title: "Properties",
    href: "/properties",
    iconKey: "home",
    permission: PERMISSIONS.PROPERTIES_VIEW,
  },
  {
    title: "Property Documents",
    href: "/property-documents",
    iconKey: "file-text",
    permission: PERMISSIONS.DOCUMENTS_VIEW,
  },
  {
    title: "Location Categories",
    href: "/location-categories",
    iconKey: "map-pin",
    permission: PERMISSIONS.LOCATION_CATEGORIES_VIEW,
  },
  {
    title: "Tax Rates",
    href: "/tax-rates",
    iconKey: "percent",
    permission: PERMISSIONS.TAX_RATES_VIEW,
  },
  {
    title: "Assessments",
    href: "/assessments",
    iconKey: "calculator",
    permission: PERMISSIONS.ASSESSMENTS_VIEW,
  },
  {
    title: "Payments",
    href: "/payments",
    iconKey: "credit-card",
    permission: PERMISSIONS.PAYMENTS_VIEW,
  },
  {
    title: "Confirmations",
    href: "/confirmations",
    iconKey: "check-circle",
    permission: PERMISSIONS.CONFIRMATIONS_VIEW,
  },
  {
    title: "Reports",
    href: "/reports",
    iconKey: "bar-chart-3",
    permission: PERMISSIONS.REPORTS_VIEW,
  },
  {
    title: "Audit Logs",
    href: "/audit-logs",
    iconKey: "shield-check",
    permission: PERMISSIONS.AUDIT_LOGS_VIEW,
  },
  {
    title: "Settings",
    href: "/settings",
    iconKey: "settings",
    permission: PERMISSIONS.SETTINGS_MANAGE,
  },
];
