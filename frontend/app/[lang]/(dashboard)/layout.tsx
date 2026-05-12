import { Metadata } from "next";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { AppHeader } from "@/components/layout/app-header";
import { getDictionary } from "@/lib/get-dictionary";
import { type Locale } from "@/lib/constants";
import { getServerSession } from "@/lib/auth-helper";
import { redirect } from "next/navigation";
import ErrorBoundary from "@/components/feedback/error-boundary";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Kebele House Tax and Property Payment Management System",
};

export const dynamic = "force-dynamic";

export default async function DashboardLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const dict = await getDictionary(lang as Locale);

  // 1. Get real session from Better Auth using resilient helper
  const session = await getServerSession();

  // 2. Protect Route: Redirect to login if no session
  if (!session) {
    redirect(`/${lang}/login`);
  }

  const user = {
    id: session.user.id,
    name: session.user.name,
    email: session.user.email,
    image: session.user.image,
    role: (session.user as any).role || "USER",
  };

  return (
    <div className="flex min-h-screen bg-background transition-colors duration-300">
      <AppSidebar locale={lang} role={user.role as any} dict={dict} />
      <div className="flex flex-1 flex-col overflow-hidden">
        <AppHeader user={user} locale={lang} dict={dict} />
        <main className="flex-1 overflow-y-auto bg-muted/10">
          <div className="p-4 md:p-6 lg:p-8 max-w-7xl mx-auto animate-in-fade">
            <ErrorBoundary>
              {children}
            </ErrorBoundary>
          </div>
        </main>
      </div>
    </div>
  );
}
