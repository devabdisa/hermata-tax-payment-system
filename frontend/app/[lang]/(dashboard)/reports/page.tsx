import { getDictionary } from "@/lib/get-dictionary";
import { type Locale } from "@/lib/constants";
import { ReportsPageClient } from "@/features/reports/components/reports-page-client";
import { getServerSession } from "@/lib/auth-helper";
import { hasPermission } from "@/lib/rbac";
import { PERMISSIONS } from "@/config/permissions";
import { AccessDenied } from "@/components/auth/access-denied";

export default async function ReportsPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const dict = await getDictionary(lang as Locale);

  const session = await getServerSession();
  const role = (session?.user as any)?.role || "USER";

  if (!hasPermission(role, PERMISSIONS.REPORTS_VIEW)) {
    return <AccessDenied dict={dict} lang={lang} />;
  }

  return (
    <div className="space-y-6">

      <ReportsPageClient dict={dict} lang={lang} />
    </div>
  );
}
