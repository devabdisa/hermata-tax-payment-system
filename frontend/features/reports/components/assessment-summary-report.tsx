"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { reportsApi } from "../api";
import { AssessmentsDistribution, ReportFilters } from "../types";
import { type Dictionary } from "@/lib/get-dictionary";
import { Skeleton } from "@/components/ui/skeleton";
import { formatCurrency } from "@/lib/utils";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";

interface AssessmentSummaryReportProps {
  filters: ReportFilters;
  dict: Dictionary;
}

const COLORS = ["#0ea5e9", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"];

export function AssessmentSummaryReport({ filters, dict }: AssessmentSummaryReportProps) {
  const [data, setData] = useState<AssessmentsDistribution | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await reportsApi.getAssessments(filters);
        setData(response.data);
      } catch (error) {
        console.error("Failed to fetch assessment summary", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [filters]);

  if (isLoading) {
    return <Skeleton className="h-[400px] w-full rounded-2xl" />;
  }

  if (!data) return null;

  const chartData = data.byStatus.map(s => ({
    name: (dict.status as any)?.[s.status] || s.status,
    amount: s.totalAmount
  }));

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="border-none shadow-md rounded-2xl bg-blue-50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-bold text-blue-700 uppercase tracking-wider">{dict.reports.totalAssessed}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-black text-blue-900 italic">{formatCurrency(data.totalAssessedAmount)}</div>
            <p className="text-xs text-blue-600 mt-2 font-bold uppercase">{data.totalAssessments} {dict.reports.issuedAssessments}</p>
          </CardContent>
        </Card>

        <Card className="border-none shadow-md rounded-2xl">
          <CardHeader>
            <CardTitle className="text-sm font-bold text-slate-500 uppercase tracking-wider">{dict.reports.assessmentsByStatus}</CardTitle>
          </CardHeader>
          <CardContent className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <XAxis dataKey="name" hide />
                <Tooltip 
                   contentStyle={{ borderRadius: "16px", border: "none", boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)" }}
                   formatter={(val: any) => formatCurrency(val)}
                />
                <Bar dataKey="amount" radius={[4, 4, 0, 0]}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card className="border-none shadow-md rounded-2xl">
        <CardHeader>
           <CardTitle className="text-sm font-bold text-slate-500 uppercase tracking-wider">Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
           <div className="space-y-4">
              {data.byStatus.map((s, i) => (
                <div key={s.status} className="flex items-center justify-between p-4 rounded-xl bg-slate-50 border border-slate-100">
                   <div className="flex items-center gap-3">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                      <span className="font-bold text-slate-700 uppercase italic">{(dict.status as any)?.[s.status] || s.status}</span>
                      <span className="text-xs text-slate-400 font-bold">({s.count})</span>
                   </div>
                   <span className="font-black text-slate-900">{formatCurrency(s.totalAmount)}</span>
                </div>
              ))}
           </div>
        </CardContent>
      </Card>
    </div>
  );
}
