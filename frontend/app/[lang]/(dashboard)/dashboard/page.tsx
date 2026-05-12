import { getDictionary } from "@/lib/get-dictionary";
import { type Locale } from "@/lib/constants";
import { DashboardPageClient } from "@/features/reports/components/dashboard-page-client";

export default async function DashboardPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const dict = await getDictionary(lang as Locale);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-4xl font-black tracking-tight text-slate-900 uppercase italic">
          {dict.common.dashboard}
        </h1>
        <p className="text-slate-500 font-medium max-w-2xl">
          Overview of {dict.common.appName} house tax and property metrics.
        </p>
      </div>

      <DashboardPageClient dict={dict} lang={lang} />
    </div>
  );
}
