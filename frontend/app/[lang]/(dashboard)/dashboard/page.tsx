import { getDictionary } from "@/lib/get-dictionary";
import { type Locale } from "@/lib/constants";
import { DashboardPageClient } from "@/features/reports/components/dashboard-page-client";
import { PageHeader } from "@/components/ui/page-header";
import { PageShell } from "@/components/ui/page-shell";
import { Home } from "lucide-react";

export default async function DashboardPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const dict = await getDictionary(lang as Locale);

  return (
    <PageShell>
      <PageHeader
        title={dict.common.dashboard}
        description={`Overview of ${dict.common.appName} house tax and property metrics.`}
        icon={Home}
        breadcrumbs={[
          { label: dict.common.dashboard, href: `/${lang}/dashboard` }
        ]}
      />
      <DashboardPageClient dict={dict} lang={lang} />
    </PageShell>
  );
}
