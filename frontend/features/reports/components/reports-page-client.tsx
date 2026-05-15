"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { type Dictionary } from "@/lib/get-dictionary";
import { CollectionsReport } from "./collections-report";
import { UnpaidAssessmentsReport } from "./unpaid-assessments-report";
import { PendingWorkReport } from "./pending-work-report";
import { PropertyDistributionReport } from "./property-distribution-report";
import { AssessmentSummaryReport } from "./assessment-summary-report";
import { PaymentSummaryReport } from "./payment-summary-report";
import { ReportFilterBar } from "./report-filter-bar";
import { ReportFilters } from "../types";
import { Button } from "@/components/ui/button";
import { Printer } from "lucide-react";

import { PageShell } from "@/components/ui/page-shell";
import { PageHeader } from "@/components/ui/page-header";
import { BarChart3 } from "lucide-react";

interface ReportsPageClientProps {
  dict: Dictionary;
  lang: string;
}

export function ReportsPageClient({ dict, lang }: ReportsPageClientProps) {
  const [filters, setFilters] = useState<ReportFilters>({
    taxYear: new Date().getFullYear().toString(),
  });

  const handlePrint = () => {
    window.print();
  };

  return (
    <PageShell>
      <PageHeader
        title={dict.common.reports}
        description="Comprehensive analytics and operational monitoring for the kebele house tax system."
        icon={BarChart3}
        breadcrumbs={[
          { label: dict.common.dashboard, href: `/${lang}/dashboard` },
          { label: dict.common.reports, href: `/${lang}/reports` }
        ]}
      />
      <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 print:hidden">
        <ReportFilterBar filters={filters} setFilters={setFilters} dict={dict} />
        <Button variant="outline" onClick={handlePrint} className="h-11 rounded-xl gap-2 border-slate-200">
           <Printer className="h-4 w-4" />
           {dict.reports.printReport}
        </Button>
      </div>

      <Tabs defaultValue="collections" className="space-y-6">
        <TabsList className="bg-slate-100 p-1 rounded-2xl h-14 print:hidden overflow-x-auto justify-start md:justify-center">
          <TabsTrigger value="collections" className="rounded-xl px-6 font-bold data-[state=active]:bg-white data-[state=active]:shadow-sm transition-all">
            {dict.reports.collections}
          </TabsTrigger>
          <TabsTrigger value="unpaid" className="rounded-xl px-6 font-bold data-[state=active]:bg-white data-[state=active]:shadow-sm transition-all">
            {dict.reports.unpaidReport}
          </TabsTrigger>
          <TabsTrigger value="pending" className="rounded-xl px-6 font-bold data-[state=active]:bg-white data-[state=active]:shadow-sm transition-all">
            {dict.reports.pendingWork}
          </TabsTrigger>
          <TabsTrigger value="properties" className="rounded-xl px-6 font-bold data-[state=active]:bg-white data-[state=active]:shadow-sm transition-all">
            {dict.reports.propertyDistribution}
          </TabsTrigger>
          <TabsTrigger value="assessments" className="rounded-xl px-6 font-bold data-[state=active]:bg-white data-[state=active]:shadow-sm transition-all">
            {dict.reports.assessmentSummary}
          </TabsTrigger>
          <TabsTrigger value="payments" className="rounded-xl px-6 font-bold data-[state=active]:bg-white data-[state=active]:shadow-sm transition-all">
            {dict.reports.paymentSummary}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="collections" className="space-y-6 focus-visible:outline-none">
          <CollectionsReport filters={filters} dict={dict} />
        </TabsContent>
        
        <TabsContent value="unpaid" className="space-y-6 focus-visible:outline-none">
          <UnpaidAssessmentsReport filters={filters} dict={dict} lang={lang} />
        </TabsContent>

        <TabsContent value="pending" className="space-y-6 focus-visible:outline-none">
          <PendingWorkReport dict={dict} lang={lang} />
        </TabsContent>

        <TabsContent value="properties" className="space-y-6 focus-visible:outline-none">
          <PropertyDistributionReport filters={filters} dict={dict} />
        </TabsContent>

        <TabsContent value="assessments" className="space-y-6 focus-visible:outline-none">
          <AssessmentSummaryReport filters={filters} dict={dict} />
        </TabsContent>

        <TabsContent value="payments" className="space-y-6 focus-visible:outline-none">
          <PaymentSummaryReport filters={filters} dict={dict} />
        </TabsContent>
      </Tabs>
    </div>
    </PageShell>
  );
}
