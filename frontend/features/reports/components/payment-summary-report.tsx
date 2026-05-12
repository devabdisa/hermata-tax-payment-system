"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { reportsApi } from "../api";
import { PaymentsDistribution, ReportFilters } from "../types";
import { type Dictionary } from "@/lib/get-dictionary";
import { Skeleton } from "@/components/ui/skeleton";
import { formatCurrency } from "@/lib/utils";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";

interface PaymentSummaryReportProps {
  filters: ReportFilters;
  dict: Dictionary;
}

const COLORS = ["#0ea5e9", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"];

export function PaymentSummaryReport({ filters, dict }: PaymentSummaryReportProps) {
  const [data, setData] = useState<PaymentsDistribution | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await reportsApi.getPayments(filters);
        setData(response.data);
      } catch (error) {
        console.error("Failed to fetch payment summary", error);
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

  const methodData = data.byMethod.map(m => ({
    name: m.method,
    value: m.totalAmount
  }));

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card className="border-none shadow-md rounded-2xl">
        <CardHeader>
          <CardTitle className="text-sm font-bold text-slate-500 uppercase tracking-wider">{dict.reports.collectionByMethod}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={methodData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {methodData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                   contentStyle={{ borderRadius: "16px", border: "none", boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)" }}
                   formatter={(val: any) => formatCurrency(val)}
                />
                <Legend iconType="circle" wrapperStyle={{ paddingTop: "20px" }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card className="border-none shadow-md rounded-2xl">
        <CardHeader>
          <CardTitle className="text-sm font-bold text-slate-500 uppercase tracking-wider">Metrics</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
           <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-100">
              <p className="text-xs font-bold text-emerald-700 uppercase">{dict.reports.totalCollected}</p>
              <p className="text-4xl font-black text-emerald-900 italic">{formatCurrency(data.totalCollectedAmount)}</p>
           </div>
           
           <div className="space-y-4">
              {data.byMethod.map((m, i) => (
                <div key={m.method} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
                   <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                      <span className="text-xs font-bold text-slate-700 uppercase italic">{m.method}</span>
                   </div>
                   <div className="text-right">
                      <p className="text-sm font-black text-slate-900">{formatCurrency(m.totalAmount)}</p>
                      <p className="text-[10px] text-slate-400 font-bold uppercase">{m.count} Payments</p>
                   </div>
                </div>
              ))}
           </div>
        </CardContent>
      </Card>
    </div>
  );
}
