"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { NAVIGATION_ITEMS } from "@/lib/navigation";
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

export function AppSidebar({ locale, dict, role }: { locale: string, dict: Dictionary, role: UserRole }) {
  const pathname = usePathname();

  const filteredNavItems = NAVIGATION_ITEMS.filter(item => {
    // 1. Check Role-based access if defined
    if (item.allowedRoles && !item.allowedRoles.includes(role)) return false;
    
    // 2. Check Permission-based access if defined
    if (item.permission && !hasPermission(role, item.permission)) return false;
    
    return true;
  });

  return (
    <aside className="hidden w-64 flex-col border-r bg-card md:flex">
      <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
        <Link href={`/${locale}/dashboard`} className="flex items-center gap-2 font-semibold text-primary">
          <span className="text-xl font-bold">{dict?.common?.appName || "Hermata Tax"}</span>
        </Link>
      </div>
      <div className="flex-1 overflow-auto py-2">
        <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
          {filteredNavItems.map((item) => {
            const Icon = iconMap[item.iconKey];
            const localizedHref = `/${locale}${item.href}`;
            const isActive = pathname.startsWith(localizedHref);
            const label = (dict?.common as any)?.[item.dictKey] || item.title;

            return (
              <Link
                key={item.href}
                href={localizedHref}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 transition-all",
                  isActive
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                )}
              >
                {Icon && <Icon className="h-4 w-4" />}
                {label}
              </Link>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}
