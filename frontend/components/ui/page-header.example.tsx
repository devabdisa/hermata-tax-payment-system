/**
 * PageHeader Component Examples
 */

import { Home, Plus, FileText, Settings, Users } from 'lucide-react';
import { PageHeader } from './page-header';

/**
 * Basic page header
 */
export function BasicPageHeader() {
  return <PageHeader title="Dashboard" />;
}

/**
 * Complete page header with breadcrumbs and actions
 */
export function CompletePageHeader() {
  return (
    <PageHeader
      icon={Home}
      title="Properties"
      description="Manage all property registrations and documentation"
      breadcrumbs={[
        { label: "Management", href: "/management" },
        { label: "Properties", href: "/properties" }
      ]}
      actions={[
        {
          label: "Add Property",
          onClick: () => console.log("Add"),
          icon: Plus,
          variant: "default"
        },
        {
          label: "Settings",
          onClick: () => console.log("Settings"),
          icon: Settings,
          variant: "outline"
        }
      ]}
    />
  );
}

/**
 * Administration header
 */
export function AdminPageHeader() {
  return (
    <PageHeader
      icon={Users}
      title="Users"
      description="Manage system users and RBAC permissions."
      breadcrumbs={[
        { label: "Administration", href: "/admin" },
        { label: "Users", href: "/admin/users" }
      ]}
      actions={[
        {
          label: "Export CSV",
          onClick: () => console.log("Export"),
          icon: FileText,
          variant: "outline"
        }
      ]}
    />
  );
}
