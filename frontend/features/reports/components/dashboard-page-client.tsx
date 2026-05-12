"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Home, 
  Calculator, 
  CreditCard, 
  Clock, 
  TrendingUp, 
  AlertTriangle, 
  ShieldCheck,
  CheckCircle,
  FileText,
  DollarSign,
  ChevronRight,
  Plus,
  ArrowUpRight,
  RefreshCw
} from "lucide-react";
import { reportsApi } from "../api";
import { DashboardReport } from "../types";
import { type Dictionary } from "@/lib/get-dictionary";
import { Skeleton } from "@/components/ui/skeleton";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { MetricCard } from "@/components/ui/metric-card";
import { calculateMetricChange, formatETB, formatCompactNumber } from "@/lib/metrics";

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
      <div className="space-y-8">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-40 w-full rounded-2xl" />
          ))}
        </div>
        <div className="grid gap-6 md:grid-cols-7">
           <Skeleton className="col-span-full lg:col-span-4 h-[450px] rounded-2xl" />
           <Skeleton className="col-span-full lg:col-span-3 h-[450px] rounded-2xl" />
        </div>
      </div>
    );
  }

  if (!data) return null;

  // Mock previous data for trend calculation (in real app, this would come from API)
  const previousData = {
    propertiesTotal: data.propertiesTotal * 0.95,
    assessmentsIssued: data.assessmentsIssued * 0.92,
    paymentsVerified: data.paymentsVerified * 0.88,
    totalCollectedAmount: data.totalCollectedAmount * 0.85
  };

  const metrics = [
    {
      title: dict.reports.totalProperties,
      value: data.propertiesTotal,
      previousValue: previousData.propertiesTotal,
      unit: '',
      icon: Home,
      description: `${data.propertiesApproved} ${dict.reports.approvedProperties}`,
      href: `/${lang}/properties`,
      variant: 'default' as const
    },
    {
      title: dict.reports.issuedAssessments,
      value: data.assessmentsIssued,
      previousValue: previousData.assessmentsIssued,
      unit: '',
      icon: Calculator,
      description: `${data.assessmentsPaid} ${dict.reports.paidAssessments}`,
      href: `/${lang}/assessments`,
      variant: 'info' as const
    },
    {
      title: 'Payments Verified', // Should use dictionary
      value: data.paymentsVerified,
      previousValue: previousData.paymentsVerified,
      unit: '',
      icon: CheckCircle,
      description: `${data.paymentsPendingReview} pending review`,
      href: `/${lang}/payments`,
      variant: 'success' as const
    },
    {
      title: dict.reports.totalCollected,
      value: data.totalCollectedAmount,
      previousValue: previousData.totalCollectedAmount,
      unit: 'ETB',
      icon: DollarSign,
      description: `Target: ${formatCompactNumber(data.totalAssessedAmount)}`,
      href: `/${lang}/payments`,
      variant: 'default' as const,
      isCurrency: true
    }
  ];

  return (
    <div className="space-y-8">
      {/* Premium Metric Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {metrics.map((metric, i) => {
          const trend = calculateMetricChange(metric.value, metric.previousValue);
          return (
            <MetricCard
              key={i}
              title={metric.title}
              value={metric.isCurrency ? formatCompactNumber(metric.value) : metric.value.toLocaleString()}
              unit={metric.unit}
              icon={metric.icon}
              description={metric.description}
              trend={{
                value: trend.percentage,
                isPositive: trend.isPositive,
                label: 'vs last month'
              }}
              href={metric.href}
              variant={metric.variant}
            />
          );
        })}
      </div>

      <div className="grid gap-6 md:grid-cols-7">
        <Card className="col-span-full lg:col-span-4 border-border/50 shadow-sm rounded-2xl overflow-hidden bg-card/50 backdrop-blur-sm">
          <CardHeader className="border-b border-border/50 bg-muted/20">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-xl flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-amber-500" />
                  {dict.reports.pendingWork}
                </CardTitle>
                <CardDescription>{dict.reports.overview}</CardDescription>
              </div>
              <Button variant="outline" size="sm" onClick={() => router.push(`/${lang}/reports`)}>
                View Reports
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { label: dict.reports.pendingPropertyReviews, value: data.propertiesPendingReview, icon: Home, color: "text-blue-600", bg: "bg-blue-50 dark:bg-blue-900/20" },
                { label: dict.reports.pendingDocumentReviews, value: data.documentsPendingReview, icon: FileText, color: "text-emerald-600", bg: "bg-emerald-50 dark:bg-emerald-900/20" },
                { label: dict.reports.pendingPaymentVerifications, value: data.paymentsPendingReview, icon: CreditCard, color: "text-amber-600", bg: "bg-amber-50 dark:bg-amber-900/20" },
                { label: dict.reports.paidWithoutConfirmation, value: data.paidWithoutConfirmation, icon: ShieldCheck, color: "text-indigo-600", bg: "bg-indigo-50 dark:bg-indigo-900/20" }
              ].map((item, i) => (
                <div key={i} className="flex items-center p-4 rounded-2xl bg-muted/30 border border-border/50 hover:bg-muted/50 transition-colors">
                  <div className={`p-3 rounded-xl ${item.bg} ${item.color} mr-4`}>
                    <item.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{item.label}</p>
                    <p className="text-2xl font-bold text-foreground">{item.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-full lg:col-span-3 border-border/50 shadow-sm rounded-2xl overflow-hidden bg-card/50 backdrop-blur-sm">
          <CardHeader className="border-b border-border/50 bg-muted/20">
            <CardTitle className="text-xl">{dict.dashboardCards.quickActions}</CardTitle>
            <CardDescription>Common shortcuts</CardDescription>
          </CardHeader>
          <CardContent className="p-6 space-y-3">
             {[
               { label: "Register Property", sub: "Add house record", icon: Home, color: "text-blue-600", bg: "bg-blue-50 dark:bg-blue-900/20", link: `/${lang}/properties` },
               { label: "Issue Assessment", sub: "Calculate tax", icon: Calculator, color: "text-emerald-600", bg: "bg-emerald-50 dark:bg-emerald-900/20", link: `/${lang}/assessments` },
               { label: "Verify Payment", sub: "Check receipts", icon: CheckCircle, color: "text-amber-600", bg: "bg-amber-50 dark:bg-amber-900/20", link: `/${lang}/payments` },
               { label: "Issue Confirmation", sub: "Final receipt", icon: ShieldCheck, color: "text-indigo-600", bg: "bg-indigo-50 dark:bg-indigo-900/20", link: `/${lang}/confirmations` }
             ].map((action, i) => (
               <button 
                 key={i} 
                 onClick={() => router.push(action.link)} 
                 className="w-full flex items-center p-4 rounded-2xl border border-border/50 bg-background hover:bg-muted/50 transition-all cursor-pointer group shadow-sm active:scale-[0.98]"
               >
                  <div className={`p-3 rounded-xl ${action.bg} ${action.color} mr-4 group-hover:scale-110 transition-transform`}>
                      <action.icon className="h-5 w-5" />
                  </div>
                  <div className="text-left">
                      <p className="text-sm font-bold text-foreground">{action.label}</p>
                      <p className="text-xs text-muted-foreground">{action.sub}</p>
                  </div>
                  <ChevronRight className="ml-auto h-4 w-4 text-muted-foreground/50 group-hover:text-primary group-hover:translate-x-1 transition-all" />
               </button>
             ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
