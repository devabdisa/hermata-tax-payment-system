"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { propertiesApi } from "../api";
import { Property, PropertyStatus, OwnershipType } from "../types";
import { PropertiesTable } from "./properties-table";
import { Button } from "@/components/ui/button";
import { Plus, Filter } from "lucide-react";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuCheckboxItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";

export function PropertiesPageClient() {
  const router = useRouter();
  const [data, setData] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<PropertyStatus | "">("");

  const fetchProperties = async () => {
    setIsLoading(true);
    try {
      const response = await propertiesApi.getProperties({
        page: currentPage,
        search,
        status: statusFilter || undefined,
      });
      setData(response.data);
      setTotalItems(response.meta.total);
      setTotalPages(response.meta.totalPages);
    } catch (error: any) {
      toast.error(error.message || "Failed to fetch properties");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, [currentPage, search, statusFilter]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Properties</h1>
          <p className="text-muted-foreground">
            Manage house/property records, file numbers, and approval status.
          </p>
        </div>
        <div className="flex gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="gap-2">
                <Filter className="h-4 w-4" />
                Filter
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuCheckboxItem
                checked={statusFilter === ""}
                onCheckedChange={() => setStatusFilter("")}
              >
                All Statuses
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={statusFilter === "DRAFT"}
                onCheckedChange={() => setStatusFilter("DRAFT")}
              >
                Draft
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={statusFilter === "SUBMITTED"}
                onCheckedChange={() => setStatusFilter("SUBMITTED")}
              >
                Submitted
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={statusFilter === "UNDER_REVIEW"}
                onCheckedChange={() => setStatusFilter("UNDER_REVIEW")}
              >
                Under Review
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={statusFilter === "APPROVED"}
                onCheckedChange={() => setStatusFilter("APPROVED")}
              >
                Approved
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={statusFilter === "REJECTED"}
                onCheckedChange={() => setStatusFilter("REJECTED")}
              >
                Rejected
              </DropdownMenuCheckboxItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button onClick={() => router.push("/properties/new")} className="gap-2">
            <Plus className="h-4 w-4" />
            Add Property
          </Button>
        </div>
      </div>

      <PropertiesTable
        data={data}
        isLoading={isLoading}
        totalItems={totalItems}
        totalPages={totalPages}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
        onSearch={setSearch}
        onView={(p) => router.push(`/properties/${p.id}`)}
        onEdit={(p) => router.push(`/properties/${p.id}/edit`)}
      />
    </div>
  );
}
