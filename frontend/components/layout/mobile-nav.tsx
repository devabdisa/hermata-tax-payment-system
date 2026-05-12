"use client";

import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { 
  Menu, 
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
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { NAVIGATION_ITEMS } from "@/lib/navigation";
import type { Dictionary } from "@/lib/get-dictionary";
import { UserRole } from "@/config/roles";

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

export function MobileNav({ locale, dict, role }: { locale: string, dict: Dictionary, role: string }) {
  const pathname = usePathname();
  const userRole = role as UserRole;

  const filteredNavItems = NAVIGATION_ITEMS.filter(item => {
    if (item.allowedRoles && !item.allowedRoles.includes(userRole)) return false;
    return true;
  });

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="shrink-0 md:hidden">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle navigation menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="flex flex-col">
        <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
        <nav className="grid gap-2 text-lg font-medium">
          <Link href={`/${locale}/dashboard`} className="flex items-center gap-2 text-lg font-semibold text-primary mb-4">
            <span className="text-xl font-bold">{dict?.common?.appName || "Hermata Tax"}</span>
          </Link>
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
                  "mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground",
                  isActive && "bg-muted text-foreground"
                )}
              >
                {Icon && <Icon className="h-5 w-5" />}
                {label}
              </Link>
            );
          })}
        </nav>
      </SheetContent>
    </Sheet>
  );
}
