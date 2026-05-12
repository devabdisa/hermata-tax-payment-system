import { UserMenu } from "./user-menu";
import { MobileNav } from "./mobile-nav";
import { LanguageSwitcher } from "./language-switcher";
import { ThemeToggle } from "./theme-toggle";
import type { Dictionary } from "@/lib/get-dictionary";

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
    <header className="flex h-14 items-center gap-4 border-b bg-background px-4 lg:h-[60px] lg:px-6">
      <MobileNav locale={locale} dict={dict} role={user.role} />
      <div className="w-full flex-1">
        {/* Future global search can go here */}
      </div>
      <div className="flex items-center gap-2">
        <LanguageSwitcher currentLocale={locale} />
        <ThemeToggle labels={{ light: dict.common.lightMode, dark: dict.common.darkMode, system: dict.common.systemMode }} />
        <UserMenu user={user} locale={locale} dict={dict} />
      </div>
    </header>
  );
}
