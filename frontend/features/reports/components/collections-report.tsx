"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { reportsApi } from "../api";
import { CollectionSummary, ReportFilters } from "../types";
import { type Dictionary } from "@/lib/get-dictionary";
import { formatCurrency } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

interface CollectionsReportProps {
  filters: ReportFilters;
  dict: Dictionary;
}

const COLORS = ["#0ea5e9", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"];

export function CollectionsReport({ filters, dict }: CollectionsReportProps) {
  const [data, setData] = useState<CollectionSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCollections = async () => {
      setIsLoading(true);
      try {
        const response = await reportsApi.getCollections(filters);
        setData(response.data);
      } catch (error) {
        console.error("Failed to fetch collections", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCollections();
  }, [filters]);

  if (isLoading) {
    return (
      <div className="grid gap-6">
        <div className="grid gap-6 md:grid-cols-2">
          <Skeleton className="h-32 w-full rounded-2xl" />
          <Skeleton className="h-32 w-full rounded-2xl" />
        </div>
        <Skeleton className="h-[400px] w-full rounded-2xl" />
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="border-none shadow-md rounded-2xl bg-emerald-50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-bold text-emerald-700 uppercase tracking-wider">{dict.reports.totalCollected}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-black text-emerald-900 italic">{formatCurrency(data.totalCollectedAmount)}</div>
            <p className="text-xs text-emerald-600 mt-2 font-bold uppercase">{data.totalVerifiedPayments} {dict.reports.verifiedPayments}</p>
          </CardContent>
        </Card>
        
        <Card className="border-none shadow-md rounded-2xl">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-bold text-slate-500 uppercase tracking-wider">{dict.reports.collectionByMethod}</CardTitle>
          </CardHeader>
          <CardContent>
             <div className="space-y-3">
                {data.collectionByMethod.map((item, i) => (
                  <div key={item.method} className="flex items-center justify-between">
                     <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                        <span className="text-sm font-bold text-slate-700 uppercase italic">{item.method}</span>
                     </div>
                     <span className="text-sm font-black text-slate-900">{formatCurrency(item.total)}</span>
                  </div>
                ))}
             </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="border-none shadow-md rounded-2xl overflow-hidden">
          <CardHeader className="bg-slate-50/50 border-b border-slate-100">
            <CardTitle className="text-sm font-bold text-slate-500 uppercase tracking-wider">{dict.reports.collectionByCategory}</CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="h-[250px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.collectionByLocationCategory}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="category" axisLine={false} tickLine={false} tick={{ fill: "#94a3b8", fontSize: 10 }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: "#94a3b8", fontSize: 10 }} />
                  <Tooltip 
                    contentStyle={{ borderRadius: "16px", border: "none", boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)" }}
                    formatter={(val: any) => formatCurrency(val)}
                  />
                  <Bar dataKey="total" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-md rounded-2xl overflow-hidden">
          <CardHeader className="bg-slate-50/50 border-b border-slate-100">
            <CardTitle className="text-sm font-bold text-slate-500 uppercase tracking-wider">{dict.reports.collectionByYear}</CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="h-[250px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.collectionByTaxYear}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="taxYear" axisLine={false} tickLine={false} tick={{ fill: "#94a3b8", fontSize: 10 }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: "#94a3b8", fontSize: 10 }} />
                  <Tooltip 
                    contentStyle={{ borderRadius: "16px", border: "none", boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)" }}
                    formatter={(val: any) => formatCurrency(val)}
                  />
                  <Bar dataKey="total" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-none shadow-md rounded-2xl overflow-hidden">
        <CardHeader className="bg-slate-50/50 border-b border-slate-100">
          <CardTitle className="text-xl font-black italic uppercase tracking-tight">{dict.reports.collectionByMethod}</CardTitle>
          <CardDescription>{dict.reports.overview}</CardDescription>
        </CardHeader>
        <CardContent className="pt-10">
          <div className="h-[400px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.collectionByMethod}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis 
                  dataKey="method" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: "#94a3b8", fontSize: 12, fontWeight: 700 }}
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: "#94a3b8", fontSize: 12, fontWeight: 700 }}
                />
                <Tooltip 
                  cursor={{ fill: "#f8fafc" }}
                  contentStyle={{ borderRadius: "16px", border: "none", boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)" }}
                  formatter={(value: any) => [formatCurrency(value), dict.reports.totalCollected]}
                />
                <Bar 
                  dataKey="total" 
                  fill="#0ea5e9" 
                  radius={[8, 8, 0, 0]} 
                  barSize={60}
                >
                  {data.collectionByMethod.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
