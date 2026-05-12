import { UserMenu } from "./user-menu";
import { MobileNav } from "./mobile-nav";
import { LanguageSwitcher } from "./language-switcher";
import { ThemeToggle } from "./theme-toggle";
import type { Dictionary } from "@/lib/get-dictionary";
import { Badge } from "@/components/ui/badge";

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
    <header className="flex h-14 items-center gap-4 border-b bg-card px-4 lg:h-[60px] lg:px-6 shadow-sm">
      <MobileNav locale={locale} dict={dict} role={user.role as any} />
      <div className="w-full flex-1 flex items-center gap-4">
        {/* Future global search can go here */}
        <div className="hidden md:flex flex-col">
            <span className="text-sm font-semibold">{dict?.common?.appName || "Hermata Tax System"}</span>
            <span className="text-xs text-muted-foreground">Official Government Portal</span>
        </div>
      </div>
      <div className="flex items-center gap-2 md:gap-4">
        <Badge variant="outline" className="hidden sm:flex bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100">Live System</Badge>
        <LanguageSwitcher currentLocale={locale} />
        <ThemeToggle labels={{ light: dict?.common?.lightMode || "Light", dark: dict?.common?.darkMode || "Dark", system: dict?.common?.systemMode || "System" }} />
        <div className="hidden sm:block w-px h-6 bg-border mx-1"></div>
        <UserMenu user={user} locale={locale} dict={dict} />
      </div>
    </header>
  );
}
