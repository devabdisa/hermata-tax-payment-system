"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { confirmationsApi } from "../api";
import { KebeleConfirmation, ConfirmationStatus } from "../types";
import { ConfirmationsTable } from "./confirmations-table";
import { Button } from "@/components/ui/button";
import { Filter, RefreshCw, PlusCircle } from "lucide-react";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuCheckboxItem, 
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";

export function ConfirmationsPageClient() {
  const router = useRouter();
  const [data, setData] = useState<KebeleConfirmation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [meta, setMeta] = useState<any>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<ConfirmationStatus | "">("");

  const fetchConfirmations = async () => {
    setIsLoading(true);
    try {
      const response = await confirmationsApi.getConfirmations({
        page: currentPage,
        search,
        status: statusFilter || undefined,
      });
      setData(response.data);
      setMeta(response.meta);
    } catch (error: any) {
      toast.error(error.message || "Failed to fetch confirmations");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchConfirmations();
  }, [currentPage, search, statusFilter]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-slate-900 uppercase italic">Confirmations</h1>
          <p className="text-muted-foreground mt-1 text-lg">
            Manage official kebele stamps and payment confirmation records.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="icon" onClick={fetchConfirmations} disabled={isLoading} className="rounded-xl">
            <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="gap-2 rounded-xl border-slate-200">
                <Filter className="h-4 w-4" />
                Filter
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 rounded-xl">
              <DropdownMenuLabel>Status</DropdownMenuLabel>
              <DropdownMenuCheckboxItem
                checked={statusFilter === ""}
                onCheckedChange={() => setStatusFilter("")}
              >
                All Statuses
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={statusFilter === "ISSUED"}
                onCheckedChange={() => setStatusFilter("ISSUED")}
              >
                Issued
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={statusFilter === "CANCELLED"}
                onCheckedChange={() => setStatusFilter("CANCELLED")}
              >
                Cancelled
              </DropdownMenuCheckboxItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button onClick={() => router.push("/confirmations/new")} className="gap-2 bg-primary hover:bg-primary/90 text-white rounded-xl shadow-md">
            <PlusCircle className="h-4 w-4" />
            Issue Confirmation
          </Button>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <ConfirmationsTable
          data={data}
          meta={meta}
          isLoading={isLoading}
          onPageChange={setCurrentPage}
          onSearch={setSearch}
        />
      </div>
    </div>
  );
}
