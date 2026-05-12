"use client";

import { BasicDataGrid } from "@/components/table/BasicDataGridTable";
import { Payment } from "../types";
import { PaymentStatusBadge } from "./payment-status-badge";
import { PaymentMethodBadge } from "./payment-method-badge";
import { formatCurrency } from "@/lib/utils";
import { format } from "date-fns";
import { useRouter } from "next/navigation";

interface PaymentsTableProps {
  data: Payment[];
  meta: any;
  isLoading: boolean;
  onPageChange: (page: number) => void;
  onSearch: (query: string) => void;
  dict?: any;
}

export function PaymentsTable({
  data,
  meta,
  isLoading,
  onPageChange,
  onSearch,
  dict,
}: PaymentsTableProps) {
  const router = useRouter();

  const columns = [
    {
      id: "houseNumber",
      header: "House #",
      accessorKey: "assessment.property.houseNumber",
      sortable: true,
      cell: (row: Payment) => (
        <span className="font-medium text-slate-900">
          {row.assessment?.property?.houseNumber || "N/A"}
        </span>
      ),
    },
    {
      id: "owner",
      header: "Payer/Owner",
      accessorKey: "assessment.property.owner.fullName",
      sortable: true,
      cell: (row: Payment) => (
        <div className="flex flex-col">
          <span className="text-sm font-medium">{row.assessment?.property?.owner?.fullName || "N/A"}</span>
          <span className="text-xs text-muted-foreground">{row.assessment?.property?.fileNumber}</span>
        </div>
      ),
    },
    {
      id: "amount",
      header: "Amount",
      accessorKey: "amount",
      sortable: true,
      cell: (row: Payment) => (
        <span className="font-mono font-bold text-slate-900">
          {formatCurrency(Number(row.amount))}
        </span>
      ),
    },
    {
      id: "method",
      header: "Method",
      accessorKey: "method",
      sortable: true,
      cell: (row: Payment) => <PaymentMethodBadge method={row.method} />,
    },
    {
      id: "status",
      header: "Status",
      accessorKey: "status",
      sortable: true,
      cell: (row: Payment) => <PaymentStatusBadge status={row.status} dict={dict} />,
    },
    {
      id: "paidAt",
      header: "Paid Date",
      accessorKey: "paidAt",
      sortable: true,
      cell: (row: Payment) => (
        <span className="text-xs text-slate-500">
          {row.paidAt ? format(new Date(row.paidAt), "MMM dd, yyyy") : "N/A"}
        </span>
      ),
    },
  ];

  return (
    <BasicDataGrid
      data={data}
      columns={columns}
      isLoading={isLoading}
      currentPage={meta?.page || 1}
      totalPages={meta?.totalPages || 1}
      totalItems={meta?.total || 0}
      onPageChange={onPageChange}
      onSearch={onSearch}
      onView={(row: Payment) => router.push(`/payments/${row.id}`)}
      searchPlaceholder="Search by reference, house #, or owner..."
      showAddButton={false}
    />
  );
}
