"use client";

import { DataTable } from "@/components/table/data-table";
import { Payment } from "../types";
import { StatusBadge } from "@/components/ui/status-badge";
import { PaymentMethodBadge } from "./payment-method-badge";
import { formatCurrency } from "@/lib/utils";
import { format } from "date-fns";
import { useRouter } from "next/navigation";
import { ColumnDef } from "@tanstack/react-table";
import { CreditCard } from "lucide-react";

import { type Dictionary } from "@/lib/get-dictionary";

interface PaymentsTableProps {
  data: Payment[];
  meta: any;
  isLoading: boolean;
  onPageChange: (page: number) => void;
  onSearch: (query: string) => void;
  dict: Dictionary;
}

export function PaymentsTable({
  data,
  isLoading,
  onView,
  dict,
}: PaymentsTableProps & { onView: (row: Payment) => void }) {
  const columns: ColumnDef<Payment>[] = [
    {
      id: "houseNumber",
      header: "House #",
      accessorKey: "assessment.property.houseNumber",
      cell: ({ row }) => (
        <span className="font-semibold text-foreground">
          {row.original.assessment?.property?.houseNumber || "N/A"}
        </span>
      ),
    },
    {
      id: "owner",
      header: dict.common.propertyOwners || "Payer/Owner",
      accessorKey: "assessment.property.owner.fullName",
      cell: ({ row }) => (
        <div className="flex flex-col">
          <span className="text-sm font-semibold text-foreground">{row.original.assessment?.property?.owner?.fullName || "N/A"}</span>
          <span className="text-xs text-muted-foreground">{row.original.assessment?.property?.fileNumber}</span>
        </div>
      ),
    },
    {
      id: "amount",
      header: dict.dashboardCards.totalPayments || "Amount",
      accessorKey: "amount",
      cell: ({ row }) => (
        <span className="font-mono font-bold text-primary">
          {formatCurrency(Number(row.original.amount))}
        </span>
      ),
    },
    {
      id: "method",
      header: dict.payments.paymentMethod,
      accessorKey: "method",
      cell: ({ row }) => <PaymentMethodBadge method={row.original.method} dict={dict} />,
    },
    {
      id: "status",
      header: dict.payments.paymentStatus,
      accessorKey: "status",
      cell: ({ row }) => <StatusBadge status={row.original.status as any} dict={dict} showIcon size="sm" />,
    },
    {
      id: "paidAt",
      header: dict.payments.paidAt,
      accessorKey: "paidAt",
      cell: ({ row }) => (
        <span className="text-xs text-muted-foreground">
          {row.original.paidAt ? format(new Date(row.original.paidAt), "MMM dd, yyyy") : "N/A"}
        </span>
      ),
    },
    {
      id: "actions",
      header: "",
      cell: ({ row }) => (
        <div className="flex justify-end">
          <button 
            onClick={() => onView(row.original)}
            className="text-primary hover:underline text-sm font-medium"
          >
            Details
          </button>
        </div>
      ),
    }
  ];

  return (
    <DataTable
      columns={columns}
      data={data}
      isLoading={isLoading}
      searchColumn="houseNumber"
      searchPlaceholder={dict.common?.search || "Search house number..."}
      emptyTitle="No payments found"
      emptyDescription="Try adjusting your search or filters."
      emptyIcon={CreditCard}
    />
  );
}
