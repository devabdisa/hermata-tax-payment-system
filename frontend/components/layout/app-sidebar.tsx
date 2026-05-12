"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { NAVIGATION_ITEMS, type NavItem } from "@/lib/navigation";
import { 
  LayoutDashboard, 
  Users, 
  UserSquare2, 
  Home, 
  FileText, 
  MapPin, 
  Percent, 
  Calculator, 
  CreditCard, 
  CheckCircle, 
  BarChart3, 
  ShieldCheck, 
  Settings 
} from "lucide-react";
import type { Dictionary } from "@/lib/get-dictionary";
import { UserRole } from "@/config/roles";
import { hasPermission } from "@/lib/rbac";

const iconMap: Record<string, React.ElementType> = {
  "layout-dashboard": LayoutDashboard,
  "users": Users,
  "user-square-2": UserSquare2,
  "home": Home,
  "file-text": FileText,
  "map-pin": MapPin,
  "percent": Percent,
  "calculator": Calculator,
  "credit-card": CreditCard,
  "check-circle": CheckCircle,
  "bar-chart-3": BarChart3,
  "shield-check": ShieldCheck,
  "settings": Settings,
};

// Navigation groups configuration
interface NavigationGroup {
  id: string;
  labelKey: string;
  defaultLabel: string;
  items: string[]; // hrefs of items in this group
}

const NAVIGATION_GROUPS: NavigationGroup[] = [
  {
    id: "overview",
    labelKey: "navGroups.overview",
    defaultLabel: "Overview",
    items: ["/dashboard", "/reports"]
  },
  {
    id: "management",
    labelKey: "navGroups.management",
    defaultLabel: "Management",
    items: ["/properties", "/property-owners", "/property-documents", "/location-categories"]
  },
  {
    id: "revenue",
    labelKey: "navGroups.revenue",
    defaultLabel: "Revenue",
    items: ["/tax-rates", "/assessments", "/payments", "/confirmations"]
  },
  {
    id: "administration",
    labelKey: "navGroups.administration",
    defaultLabel: "Administration",
    items: ["/users", "/audit-logs", "/settings"]
  }
];

export function AppSidebar({ locale, dict, role }: { locale: string, dict: Dictionary, role: UserRole }) {
  const pathname = usePathname();

  // Filter navigation items based on RBAC
  const filteredNavItems = NAVIGATION_ITEMS.filter(item => {
    // 1. Check Role-based access if defined
    if (item.allowedRoles && !item.allowedRoles.includes(role)) return false;
    
    // 2. Check Permission-based access if defined
    if (item.permission && !hasPermission(role, item.permission)) return false;
    
    return true;
  });

  // Group filtered items
  const groupedNavItems = NAVIGATION_GROUPS.map(group => ({
    ...group,
    items: filteredNavItems.filter(item => group.items.includes(item.href))
  })).filter(group => group.items.length > 0); // Only show groups with items

  return (
    <aside className="hidden sidebar-width flex-col border-r border-border bg-card md:flex shadow-soft">
      {/* Premium Brand Block */}
      <div className="flex flex-col border-b border-border px-6 py-5">
        <Link 
          href={`/${locale}/dashboard`} 
          className="flex flex-col gap-1 transition-smooth hover:opacity-80"
        >
          <span className="text-xl font-bold text-foreground tracking-tight">
            {dict?.common?.appName || "Hermata Tax System"}
          </span>
          <span className="text-xs text-muted-foreground font-medium">
            Property & Tax Management
          </span>
        </Link>
      </div>

      {/* Premium Navigation Groups */}
      <div className="flex-1 overflow-auto py-4">
        <nav className="space-y-6 px-3">
          {groupedNavItems.map((group) => (
            <div key={group.id} className="space-y-1">
              {/* Group Label */}
              <div className="px-3 py-2">
                <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  {(dict?.common as any)?.[group.labelKey] || group.defaultLabel}
                </h3>
              </div>

              {/* Group Items */}
              <div className="space-y-0.5">
                {group.items.map((item) => {
                  const Icon = iconMap[item.iconKey];
                  const localizedHref = `/${locale}${item.href}`;
                  const isActive = pathname.startsWith(localizedHref);
                  const label = (dict?.common as any)?.[item.dictKey] || item.title;

                  return (
                    <Link
                      key={item.href}
                      href={localizedHref}
                      className={cn(
                        "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-smooth relative group",
                        isActive
                          ? "bg-gradient-to-r from-primary/10 to-primary/5 text-primary shadow-sm border border-primary/20"
                          : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
                      )}
                    >
                      {/* Icon with premium styling */}
                      <div className={cn(
                        "flex items-center justify-center transition-smooth",
                        isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground"
                      )}>
                        {Icon && <Icon className="h-4 w-4" />}
                      </div>

                      {/* Label */}
                      <span className="flex-1">{label}</span>

                      {/* Active indicator - subtle glow effect */}
                      {isActive && (
                        <div className="absolute inset-0 rounded-lg shadow-glow pointer-events-none opacity-50" />
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>
      </div>

      {/* Premium Footer - Optional branding or version */}
      <div className="border-t border-border px-6 py-4">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>v1.0.0</span>
          <span className="font-medium">Hermata</span>
        </div>
      </div>
    </aside>
  );
}
