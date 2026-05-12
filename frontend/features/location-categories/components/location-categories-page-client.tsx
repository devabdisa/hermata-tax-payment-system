"use client";

import { useEffect, useState } from "react";
import { LocationCategory } from "../types";
import { locationCategoriesApi } from "../api";
import { LocationCategoriesTable } from "./location-categories-table";
import { LocationCategoryFormDialog } from "./location-category-form-dialog";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useDebounce } from "@/hooks/use-debounce";

export function LocationCategoriesPageClient() {
  const [categories, setCategories] = useState<LocationCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  
  // Assuming a generic useDebounce hook exists, or we implement a simple one:
  const debouncedSearch = useDebounce(searchQuery, 500);

  const fetchCategories = async () => {
    setIsLoading(true);
    try {
      const response = await locationCategoriesApi.getAll({ search: debouncedSearch });
      setCategories(response.data);
    } catch (error) {
      console.error("Failed to fetch location categories", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, [debouncedSearch]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Location Categories</h1>
          <p className="text-muted-foreground">
            Manage area/location levels used to calculate yearly house tax rates.
          </p>
        </div>
        <LocationCategoryFormDialog onSuccess={fetchCategories} />
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center space-x-2">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by code or name..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <LocationCategoriesTable 
            categories={categories} 
            isLoading={isLoading} 
            onRefresh={fetchCategories} 
          />
        </CardContent>
      </Card>
    </div>
  );
}
