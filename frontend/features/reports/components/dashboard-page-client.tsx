"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Home, FileText, CheckCircle, Calculator, CreditCard, Clock, TrendingUp, AlertTriangle, ShieldCheck } from "lucide-react";
import { reportsApi } from "../api";
import { DashboardReport } from "../types";
import { type Dictionary } from "@/lib/get-dictionary";
import { formatCurrency } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

interface DashboardPageClientProps {
  dict: Dictionary;
  lang: string;
}

export function DashboardPageClient({ dict, lang }: DashboardPageClientProps) {
  const [data, setData] = useState<DashboardReport | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const response = await reportsApi.getDashboard();
        setData(response.data);
      } catch (error) {
        console.error("Failed to fetch dashboard data", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-32 w-full rounded-2xl" />
          ))}
        </div>
        <div className="grid gap-6 md:grid-cols-7">
           <Skeleton className="col-span-4 h-[400px] rounded-2xl" />
           <Skeleton className="col-span-3 h-[400px] rounded-2xl" />
        </div>
      </div>
    );
  }

  if (!data) return null;

  const stats = [
    {
      title: dict.reports.totalProperties,
      value: data.propertiesTotal.toLocaleString(),
      description: `${data.propertiesApproved} ${dict.reports.approvedProperties}`,
      icon: Home,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
      link: `/${lang}/properties`
    },
    {
      title: dict.reports.pendingReviews,
      value: data.propertiesPendingReview.toLocaleString(),
      description: `${data.documentsPendingReview} ${dict.reports.pendingDocuments}`,
      icon: Clock,
      color: "text-amber-600",
      bg: "bg-amber-50",
      link: `/${lang}/properties?status=SUBMITTED`
    },
    {
      title: dict.reports.issuedAssessments,
      value: data.assessmentsIssued.toLocaleString(),
      description: `${data.assessmentsPaid} ${dict.reports.paidAssessments}`,
      icon: Calculator,
      color: "text-blue-600",
      bg: "bg-blue-50",
      link: `/${lang}/assessments`
    },
    {
      title: dict.reports.totalCollected,
      value: formatCurrency(data.totalCollectedAmount),
      description: `${formatCurrency(data.totalUnpaidAmount)} ${dict.reports.totalUnpaid}`,
      icon: CreditCard,
      color: "text-indigo-600",
      bg: "bg-indigo-50",
      link: `/${lang}/payments`
    }
  ];

  return (
    <div className="space-y-8">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, i) => (
          <Card key={i} className="border-none shadow-md rounded-2xl overflow-hidden group cursor-pointer hover:shadow-lg transition-all" onClick={() => router.push(stat.link)}>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-bold text-slate-500 uppercase tracking-wider">{stat.title}</CardTitle>
              <div className={`p-2 rounded-xl ${stat.bg} ${stat.color} group-hover:scale-110 transition-transform`}>
                <stat.icon className="h-5 w-5" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-black text-slate-900 italic tracking-tight">{stat.value}</div>
              <p className="text-xs text-slate-500 mt-2 font-medium flex items-center gap-1">
                <TrendingUp className="h-3 w-3" /> {stat.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-7">
        <Card className="col-span-4 border-none shadow-md rounded-2xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-amber-500" />
              {dict.reports.pendingWork}
            </CardTitle>
            <CardDescription>{dict.reports.overview}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
                 <p className="text-xs font-bold text-slate-400 uppercase">{dict.reports.pendingPropertyReviews}</p>
                 <p className="text-2xl font-black text-slate-800 italic">{data.propertiesPendingReview}</p>
              </div>
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
                 <p className="text-xs font-bold text-slate-400 uppercase">{dict.reports.pendingDocumentReviews}</p>
                 <p className="text-2xl font-black text-slate-800 italic">{data.documentsPendingReview}</p>
              </div>
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
                 <p className="text-xs font-bold text-slate-400 uppercase">{dict.reports.pendingPaymentVerifications}</p>
                 <p className="text-2xl font-black text-slate-800 italic">{data.paymentsPendingReview}</p>
              </div>
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
                 <p className="text-xs font-bold text-slate-400 uppercase">{dict.reports.paidWithoutConfirmation}</p>
                 <p className="text-2xl font-black text-slate-800 italic">{data.paidWithoutConfirmation}</p>
              </div>
            </div>
            <Button className="w-full h-12 rounded-xl bg-slate-900 text-white font-bold" onClick={() => router.push(`/${lang}/reports`)}>
               {dict.reports.viewDetails}
            </Button>
          </CardContent>
        </Card>

        <Card className="col-span-3 border-none shadow-md rounded-2xl">
          <CardHeader>
            <CardTitle>{dict.dashboardCards.quickActions}</CardTitle>
            <CardDescription>Common shortcuts</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
             {[
               { label: "Register Property", sub: "Add house record", icon: Home, color: "text-primary", bg: "bg-primary/10", link: `/${lang}/properties` },
               { label: "Issue Assessment", sub: "Calculate tax", icon: Calculator, color: "text-blue-600", bg: "bg-blue-50", link: `/${lang}/assessments` },
               { label: "Verify Payment", sub: "Check receipts", icon: CheckCircle, color: "text-emerald-600", bg: "bg-emerald-50", link: `/${lang}/payments` },
               { label: "Issue Confirmation", sub: "Final receipt", icon: ShieldCheck, color: "text-indigo-600", bg: "bg-indigo-50", link: `/${lang}/confirmations` }
             ].map((action, i) => (
               <div key={i} onClick={() => router.push(action.link)} className="flex items-center p-4 rounded-2xl border border-slate-100 bg-white hover:bg-slate-50 transition-all cursor-pointer group shadow-sm">
                  <div className={`p-3 rounded-xl ${action.bg} ${action.color} mr-4 group-hover:scale-110 transition-transform`}>
                      <action.icon className="h-5 w-5" />
                  </div>
                  <div>
                      <p className="text-sm font-bold text-slate-900">{action.label}</p>
                      <p className="text-xs text-slate-500">{action.sub}</p>
                  </div>
               </div>
             ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
