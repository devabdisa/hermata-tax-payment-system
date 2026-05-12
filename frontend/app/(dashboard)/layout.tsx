import { Metadata } from "next";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { AppHeader } from "@/components/layout/app-header";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Kebele House Tax and Property Payment Management System",
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const dummyUser = {
    name: "Admin User",
    email: "admin@example.com",
    role: "ADMIN",
  };

  return (
    <div className="flex min-h-screen">
      <AppSidebar locale="en" role={"ADMIN" as any} dict={{} as any} />
      <div className="flex flex-1 flex-col">
        <AppHeader user={dummyUser} locale="en" dict={{} as any} />
        <main className="flex-1 p-4 md:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
