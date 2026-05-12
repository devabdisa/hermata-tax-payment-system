import { AppSidebar } from "./app-sidebar";
import { AppHeader } from "./app-header";
import type { Dictionary } from "@/lib/get-dictionary";

interface DashboardShellProps {
  children: React.ReactNode;
  user: {
    name: string;
    email: string;
    image?: string | null;
    role: string;
  };
  locale: string;
  dict: Dictionary;
}

export function DashboardShell({ children, user, locale, dict }: DashboardShellProps) {
  return (
    <div className="grid min-h-screen w-full md:grid-cols-[256px_1fr] lg:grid-cols-[256px_1fr]">
      <AppSidebar locale={locale} dict={dict} role={user.role as any} />
      <div className="flex flex-col">
        <AppHeader user={user} locale={locale} dict={dict} />
        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6 bg-muted/10">
          {children}
        </main>
      </div>
    </div>
  );
}
