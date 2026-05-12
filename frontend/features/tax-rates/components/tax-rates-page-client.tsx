"use client";

import { useEffect, useState } from "react";
import { TaxRate } from "../types";
import { taxRatesApi } from "../api";
import { TaxRatesTable } from "./tax-rates-table";
import { TaxRateFormDialog } from "./tax-rate-form-dialog";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useDebounce } from "@/hooks/use-debounce";

export function TaxRatesPageClient() {
  const [taxRates, setTaxRates] = useState<TaxRate[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchYear, setSearchYear] = useState("");
  
  const debouncedSearch = useDebounce(searchYear, 500);

  const fetchTaxRates = async () => {
    setIsLoading(true);
    try {
      const query = debouncedSearch ? { taxYear: parseInt(debouncedSearch, 10) } : {};
      const response = await taxRatesApi.getAll(query);
      setTaxRates(response.data);
    } catch (error) {
      console.error("Failed to fetch tax rates", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTaxRates();
  }, [debouncedSearch]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Tax Rates</h1>
          <p className="text-muted-foreground">
            Manage official yearly rate per kare for each location category.
          </p>
        </div>
        <TaxRateFormDialog onSuccess={fetchTaxRates} />
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center space-x-2">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by Tax Year..."
                type="number"
                className="pl-8"
                value={searchYear}
                onChange={(e) => setSearchYear(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <TaxRatesTable 
            taxRates={taxRates} 
            isLoading={isLoading} 
            onRefresh={fetchTaxRates} 
          />
        </CardContent>
      </Card>
    </div>
  );
}
