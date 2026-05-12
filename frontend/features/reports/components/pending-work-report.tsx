"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { reportsApi } from "../api";
import { PendingWorkReport as PendingWorkType } from "../types";
import { type Dictionary } from "@/lib/get-dictionary";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle, Clock, CheckCircle2, ShieldCheck, Home, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

interface PendingWorkReportProps {
  dict: Dictionary;
  lang: string;
}

export function PendingWorkReport({ dict, lang }: PendingWorkReportProps) {
  const [data, setData] = useState<PendingWorkType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchPending = async () => {
      setIsLoading(true);
      try {
        const response = await reportsApi.getPendingWork();
        setData(response.data);
      } catch (error) {
        console.error("Failed to fetch pending work", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchPending();
  }, []);

  if (isLoading) {
    return <Skeleton className="h-[400px] w-full rounded-2xl" />;
  }

  if (!data) return null;

  const items = [
    {
      title: dict.reports.pendingPropertyReviews,
      count: data.pendingProperties,
      icon: Home,
      color: "text-amber-600",
      bg: "bg-amber-50",
      link: `/${lang}/properties?status=SUBMITTED`
    },
    {
      title: dict.reports.pendingDocumentReviews,
      count: data.pendingDocuments,
      icon: FileText,
      color: "text-blue-600",
      bg: "bg-blue-50",
      link: `/${lang}/properties`
    },
    {
      title: dict.reports.pendingPaymentVerifications,
      count: data.pendingPayments,
      icon: Clock,
      color: "text-indigo-600",
      bg: "bg-indigo-50",
      link: `/${lang}/payments?status=PENDING`
    },
    {
      title: dict.reports.paidWithoutConfirmation,
      count: data.paidWithoutConfirmation,
      icon: ShieldCheck,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
      link: `/${lang}/payments?status=VERIFIED`
    }
  ];

  return (
    <Card className="border-none shadow-md rounded-2xl overflow-hidden">
      <CardHeader className="bg-amber-50/50 border-b border-amber-100">
        <div className="flex items-center gap-2">
          <AlertCircle className="h-5 w-5 text-amber-600" />
          <CardTitle className="text-xl font-black italic uppercase tracking-tight text-amber-900">{dict.reports.pendingWork}</CardTitle>
        </div>
        <CardDescription className="text-amber-700">Actions requiring immediate attention from management.</CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="grid gap-4 md:grid-cols-2">
          {items.map((item, i) => (
            <div key={i} className="flex items-center justify-between p-6 rounded-2xl border border-slate-100 bg-white hover:bg-slate-50 transition-all shadow-sm">
               <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-xl ${item.bg} ${item.color}`}>
                     <item.icon className="h-6 w-6" />
                  </div>
                  <div className="space-y-0.5">
                     <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">{item.title}</p>
                     <p className="text-3xl font-black text-slate-900 italic">{item.count}</p>
                  </div>
               </div>
               <Button variant="outline" size="sm" className="rounded-xl border-slate-200" onClick={() => router.push(item.link)}>
                  {dict.reports.viewDetails}
               </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
