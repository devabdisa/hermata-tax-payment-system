import { UserMenu } from "./user-menu";
import { MobileNav } from "./mobile-nav";
import { LanguageSwitcher } from "./language-switcher";
import { ThemeToggle } from "./theme-toggle";
import type { Dictionary } from "@/lib/get-dictionary";
import { Badge } from "@/components/ui/badge";
import { Activity } from "lucide-react";

interface AppHeaderProps {
  user: {
    name: string;
    email: string;
    image?: string | null;
    role: string;
  };
  locale: string;
  dict: Dictionary;
}

export function AppHeader({ user, locale, dict }: AppHeaderProps) {
  return (
    <header className="sticky top-0 z-50 flex h-14 items-center gap-4 border-b border-border/40 bg-background/80 backdrop-blur-xl px-4 lg:px-6 shadow-sm supports-[backdrop-filter]:bg-background/60">
      {/* Mobile Navigation Toggle */}
      <MobileNav locale={locale} dict={dict} role={user.role as any} />
      
      {/* Left Side: Page Context / Breadcrumb */}
      <div className="flex-1 flex items-center gap-3">
        <div className="hidden md:flex flex-col">
          <span className="text-sm font-semibold text-foreground">
            {dict?.common?.appName || "Hermata Tax System"}
          </span>
          <span className="text-xs text-muted-foreground">
            Official Government Portal
          </span>
        </div>
      </div>
      
      {/* Right Side: Controls with Elegant Separators */}
      <div className="flex items-center gap-3">
        {/* Live System Badge */}
        <Badge 
          variant="outline" 
          className="hidden sm:flex items-center gap-1.5 bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100 dark:bg-emerald-950/30 dark:text-emerald-400 dark:border-emerald-800 dark:hover:bg-emerald-950/50 transition-colors px-2.5 py-1"
        >
          <Activity className="h-3 w-3 animate-pulse" />
          <span className="text-xs font-medium">Live System</span>
        </Badge>
        
        {/* Separator */}
        <div className="hidden sm:block w-px h-5 bg-border/60" />
        
        {/* Language Switcher */}
        <LanguageSwitcher currentLocale={locale} />
        
        {/* Separator */}
        <div className="hidden sm:block w-px h-5 bg-border/60" />
        
        {/* Theme Toggle */}
        <ThemeToggle 
          labels={{ 
            light: dict?.common?.lightMode || "Light", 
            dark: dict?.common?.darkMode || "Dark", 
            system: dict?.common?.systemMode || "System" 
          }} 
        />
        
        {/* Separator */}
        <div className="hidden sm:block w-px h-5 bg-border/60" />
        
        {/* User Avatar */}
        <UserMenu user={user} locale={locale} dict={dict} />
      </div>
    </header>
  );
}
