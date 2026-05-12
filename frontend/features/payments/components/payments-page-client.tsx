"use client";

import { useState, useEffect } from "react";
import { paymentsApi } from "../api";
import { Payment, PaymentStatus, PaymentMethod } from "../types";
import { PaymentsTable } from "./payments-table";
import { Button } from "@/components/ui/button";
import { Filter, RefreshCw } from "lucide-react";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuCheckboxItem, 
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { type Dictionary } from "@/lib/get-dictionary";

interface PaymentsPageClientProps {
  dict: Dictionary;
}

export function PaymentsPageClient({ dict }: PaymentsPageClientProps) {
  const [data, setData] = useState<Payment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [meta, setMeta] = useState<any>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<PaymentStatus | "">("");
  const [methodFilter, setMethodFilter] = useState<PaymentMethod | "">("");

  const fetchPayments = async () => {
    setIsLoading(true);
    try {
      const response = await paymentsApi.getMany({
        page: currentPage,
        search,
        status: statusFilter || undefined,
        method: methodFilter || undefined,
      });
      setData(response.data);
      setMeta(response.meta);
    } catch (error: any) {
      toast.error(error.message || "Failed to fetch payments");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, [currentPage, search, statusFilter, methodFilter]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">{dict.payments.title}</h1>
          <p className="text-muted-foreground mt-1">
            {dict.payments.paymentProcessing || "Track tax payments and verify transactions."}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="icon" onClick={fetchPayments} disabled={isLoading}>
            <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="gap-2">
                <Filter className="h-4 w-4" />
                {dict.common?.filter || "Filter"}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>{dict.payments.paymentStatus}</DropdownMenuLabel>
              <DropdownMenuCheckboxItem
                checked={statusFilter === ""}
                onCheckedChange={() => setStatusFilter("")}
              >
                {dict.status?.ALL || "All Statuses"}
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={statusFilter === "PENDING"}
                onCheckedChange={() => setStatusFilter("PENDING")}
              >
                {dict.status.PENDING}
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={statusFilter === "UNDER_REVIEW"}
                onCheckedChange={() => setStatusFilter("UNDER_REVIEW")}
              >
                {dict.status.UNDER_REVIEW}
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={statusFilter === "VERIFIED"}
                onCheckedChange={() => setStatusFilter("VERIFIED")}
              >
                {dict.status.VERIFIED}
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={statusFilter === "REJECTED"}
                onCheckedChange={() => setStatusFilter("REJECTED")}
              >
                {dict.status.REJECTED}
              </DropdownMenuCheckboxItem>

              <DropdownMenuSeparator />
              <DropdownMenuLabel>{dict.payments.paymentMethod}</DropdownMenuLabel>
              <DropdownMenuCheckboxItem
                checked={methodFilter === ""}
                onCheckedChange={() => setMethodFilter("")}
              >
                {dict.status?.ALL || "All Methods"}
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={methodFilter === "SINQEE_BANK"}
                onCheckedChange={() => setMethodFilter("SINQEE_BANK")}
              >
                Sinqee Bank
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={methodFilter === "CHAPA"}
                onCheckedChange={() => setMethodFilter("CHAPA")}
              >
                Chapa (Online)
              </DropdownMenuCheckboxItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <PaymentsTable
        data={data}
        meta={meta}
        isLoading={isLoading}
        onPageChange={setCurrentPage}
        onSearch={setSearch}
        dict={dict}
      />
    </div>
  );
}
