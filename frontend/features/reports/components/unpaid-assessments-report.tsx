"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { reportsApi } from "../api";
import { UnpaidReport, ReportFilters } from "../types";
import { type Dictionary } from "@/lib/get-dictionary";
import { formatCurrency } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ArrowRight, AlertTriangle } from "lucide-react";
import { useRouter } from "next/navigation";
import { AssessmentStatusBadge } from "@/features/assessments/components/assessment-status-badge";

interface UnpaidAssessmentsReportProps {
  filters: ReportFilters;
  dict: Dictionary;
  lang: string;
}

export function UnpaidAssessmentsReport({ filters, dict, lang }: UnpaidAssessmentsReportProps) {
  const [data, setData] = useState<UnpaidReport | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchUnpaid = async () => {
      setIsLoading(true);
      try {
        const response = await reportsApi.getUnpaid(filters);
        setData(response.data);
      } catch (error) {
        console.error("Failed to fetch unpaid assessments", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchUnpaid();
  }, [filters]);

  if (isLoading) {
    return <Skeleton className="h-[500px] w-full rounded-2xl" />;
  }

  if (!data) return null;

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-3">
        <Card className="border-none shadow-md rounded-2xl bg-rose-50">
          <CardHeader className="pb-2">
             <CardTitle className="text-sm font-bold text-rose-700 uppercase tracking-wider">{dict.reports.totalUnpaid}</CardTitle>
          </CardHeader>
          <CardContent>
             <div className="text-3xl font-black text-rose-900 italic">{formatCurrency(data.summary.totalUnpaidAmount)}</div>
          </CardContent>
        </Card>
        <Card className="border-none shadow-md rounded-2xl">
          <CardHeader className="pb-2">
             <CardTitle className="text-sm font-bold text-slate-500 uppercase tracking-wider">{dict.reports.unpaidAssessments}</CardTitle>
          </CardHeader>
          <CardContent>
             <div className="text-3xl font-black text-slate-900 italic">{data.summary.unpaidCount}</div>
          </CardContent>
        </Card>
        <Card className="border-none shadow-md rounded-2xl bg-amber-50">
          <CardHeader className="pb-2">
             <CardTitle className="text-sm font-bold text-amber-700 uppercase tracking-wider">{dict.status.OVERDUE}</CardTitle>
          </CardHeader>
          <CardContent>
             <div className="text-3xl font-black text-amber-900 italic flex items-center gap-2">
                <AlertTriangle className="h-6 w-6" />
                {data.summary.overdueCount}
             </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-none shadow-md rounded-2xl overflow-hidden">
        <CardHeader className="bg-slate-50/50 border-b border-slate-100">
           <CardTitle className="text-xl font-black italic uppercase tracking-tight">{dict.reports.unpaidReport}</CardTitle>
           <CardDescription>Assessments awaiting payment</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
           <Table>
              <TableHeader>
                 <TableRow className="bg-slate-50/30">
                    <TableHead className="font-bold text-slate-500 uppercase text-xs">{dict.reports.taxYear}</TableHead>
                    <TableHead className="font-bold text-slate-500 uppercase text-xs">Property / Owner</TableHead>
                    <TableHead className="font-bold text-slate-500 uppercase text-xs">{dict.reports.locationCategory}</TableHead>
                    <TableHead className="font-bold text-slate-500 uppercase text-xs">Amount</TableHead>
                    <TableHead className="font-bold text-slate-500 uppercase text-xs">Due Date</TableHead>
                    <TableHead className="font-bold text-slate-500 uppercase text-xs">Status</TableHead>
                    <TableHead className="text-right"></TableHead>
                 </TableRow>
              </TableHeader>
              <TableBody>
                 {data.items.length === 0 ? (
                   <TableRow>
                      <TableCell colSpan={7} className="h-32 text-center text-slate-500 font-medium">
                         {dict.reports.noReportData}
                      </TableCell>
                   </TableRow>
                 ) : (
                   data.items.map((item: any) => (
                     <TableRow key={item.id} className="hover:bg-slate-50/50 transition-colors">
                        <TableCell className="font-bold text-slate-900 italic">{item.taxYear}</TableCell>
                        <TableCell>
                           <div className="flex flex-col">
                              <span className="font-bold text-slate-900">{item.property?.houseNumber}</span>
                              <span className="text-xs text-slate-500 font-medium">{item.property?.owner?.fullName}</span>
                           </div>
                        </TableCell>
                        <TableCell>
                           <span className="text-xs font-bold text-slate-600 bg-slate-100 px-2 py-1 rounded-lg uppercase tracking-tighter">
                              {item.property?.locationCategory?.name}
                           </span>
                        </TableCell>
                        <TableCell className="font-black text-slate-900">{formatCurrency(Number(item.totalAmount))}</TableCell>
                        <TableCell className="text-slate-600 font-medium">
                           {item.dueDate ? new Date(item.dueDate).toLocaleDateString() : "-"}
                        </TableCell>
                        <TableCell>
                           <AssessmentStatusBadge status={item.status} dict={dict} />
                        </TableCell>
                        <TableCell className="text-right">
                           <Button 
                              variant="ghost" 
                              size="sm" 
                              className="rounded-xl group" 
                              onClick={() => router.push(`/${lang}/assessments/${item.id}`)}
                           >
                              {dict.reports.viewDetails}
                              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                           </Button>
                        </TableCell>
                     </TableRow>
                   ))
                 )}
              </TableBody>
           </Table>
        </CardContent>
      </Card>
    </div>
  );
}
