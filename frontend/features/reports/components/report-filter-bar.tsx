"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { type Dictionary } from "@/lib/get-dictionary";
import { ReportFilters } from "../types";
import { locationCategoriesApi } from "@/features/location-categories/api";
import { LocationCategory } from "@/features/location-categories/types";
import { Button } from "@/components/ui/button";
import { RotateCcw } from "lucide-react";

interface ReportFilterBarProps {
  filters: ReportFilters;
  setFilters: (filters: ReportFilters) => void;
  dict: Dictionary;
}

export function ReportFilterBar({ filters, setFilters, dict }: ReportFilterBarProps) {
  const [categories, setCategories] = useState<LocationCategory[]>([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await locationCategoriesApi.getAll();
        setCategories(response.data);
      } catch (error) {
        console.error("Failed to fetch location categories", error);
      }
    };
    fetchCategories();
  }, []);

  const handleReset = () => {
    setFilters({
      taxYear: new Date().getFullYear().toString(),
    });
  };

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 10 }, (_, i) => (currentYear - i).toString());

  return (
    <div className="flex flex-wrap items-end gap-4 bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex-1">
      <div className="space-y-2 min-w-[120px]">
        <Label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{dict.reports.taxYear}</Label>
        <Select 
          value={filters.taxYear || ""} 
          onValueChange={(val) => setFilters({ ...filters, taxYear: val })}
        >
          <SelectTrigger className="h-11 rounded-xl border-slate-200">
            <SelectValue placeholder={dict.reports.taxYear} />
          </SelectTrigger>
          <SelectContent>
            {years.map(year => (
              <SelectItem key={year} value={year}>{year}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2 min-w-[200px] flex-1">
        <Label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{dict.reports.locationCategory}</Label>
        <Select 
          value={filters.locationCategoryId || "all"} 
          onValueChange={(val) => setFilters({ ...filters, locationCategoryId: val === "all" ? undefined : val })}
        >
          <SelectTrigger className="h-11 rounded-xl border-slate-200">
            <SelectValue placeholder={dict.reports.locationCategory} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{dict.status.ALL}</SelectItem>
            {categories.map(cat => (
              <SelectItem key={cat.id} value={cat.id!}>{cat.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{dict.reports.fromDate}</Label>
        <Input 
          type="date" 
          value={filters.fromDate || ""} 
          onChange={(e) => setFilters({ ...filters, fromDate: e.target.value })}
          className="h-11 rounded-xl border-slate-200"
        />
      </div>

      <div className="space-y-2">
        <Label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{dict.reports.toDate}</Label>
        <Input 
          type="date" 
          value={filters.toDate || ""} 
          onChange={(e) => setFilters({ ...filters, toDate: e.target.value })}
          className="h-11 rounded-xl border-slate-200"
        />
      </div>

      <Button variant="ghost" onClick={handleReset} className="h-11 px-4 rounded-xl text-slate-500 hover:text-slate-900">
         <RotateCcw className="h-4 w-4 mr-2" />
         {dict.reports.resetFilters}
      </Button>
    </div>
  );
}
