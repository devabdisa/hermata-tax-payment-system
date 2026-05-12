"use client";

import { BasicDataGrid } from "@/components/table/BasicDataGridTable";
import { KebeleConfirmation } from "../types";
import { ConfirmationStatusBadge } from "./confirmation-status-badge";
import { formatCurrency, formatDate } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { PaymentMethodBadge } from "@/features/payments/components/payment-method-badge";

import { type Dictionary } from "@/lib/get-dictionary";

interface ConfirmationsTableProps {
  data: KebeleConfirmation[];
  meta: any;
  isLoading: boolean;
  onPageChange: (page: number) => void;
  onSearch: (query: string) => void;
  dict: Dictionary;
}

export function ConfirmationsTable({
  data,
  meta,
  isLoading,
  onPageChange,
  onSearch,
  dict,
}: ConfirmationsTableProps) {
  const router = useRouter();

  const columns = [
    {
      id: "confirmationNumber",
      header: dict.confirmations.confirmationNumber,
      accessorKey: "confirmationNumber",
      sortable: true,
      cell: (row: KebeleConfirmation) => (
        <span className="font-mono font-bold text-primary">
          {row.confirmationNumber}
        </span>
      ),
    },
    {
      id: "status",
      header: dict.confirmations.confirmationStatus,
      accessorKey: "status",
      sortable: true,
      cell: (row: KebeleConfirmation) => <ConfirmationStatusBadge status={row.status} dict={dict} />,
    },
    {
      id: "property",
      header: dict.common.properties,
      accessorKey: "payment.assessment.property.houseNumber",
      sortable: true,
      cell: (row: KebeleConfirmation) => (
        <div className="flex flex-col">
          <span className="text-sm font-medium">{row.payment?.assessment?.property?.houseNumber || "N/A"}</span>
          <span className="text-[10px] text-muted-foreground uppercase tracking-tighter">
            File: {row.payment?.assessment?.property?.fileNumber || "N/A"}
          </span>
        </div>
      ),
    },
    {
      id: "owner",
      header: dict.common.propertyOwners || "Owner",
      accessorKey: "payment.assessment.property.owner.fullName",
      sortable: true,
      cell: (row: KebeleConfirmation) => (
        <span className="text-sm">{row.payment?.assessment?.property?.owner?.fullName || "N/A"}</span>
      ),
    },
    {
      id: "amount",
      header: dict.dashboardCards.totalPayments,
      accessorKey: "payment.amount",
      sortable: true,
      cell: (row: KebeleConfirmation) => (
        <span className="font-mono text-slate-700">
          {formatCurrency(Number(row.payment?.amount || 0))}
        </span>
      ),
    },
    {
      id: "method",
      header: dict.payments.paymentMethod,
      accessorKey: "payment.method",
      sortable: false,
      cell: (row: KebeleConfirmation) => row.payment?.method ? <PaymentMethodBadge method={row.payment.method} dict={dict} /> : null,
    },
    {
      id: "issuedAt",
      header: dict.confirmations.issuedAt,
      accessorKey: "issuedAt",
      sortable: true,
      cell: (row: KebeleConfirmation) => (
        <span className="text-xs text-muted-foreground">
          {formatDate(row.issuedAt)}
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
      onView={(row: KebeleConfirmation) => router.push(`/confirmations/${row.id}`)}
      searchPlaceholder={dict.common?.search || "Search..."}
      showAddButton={false}
    />
  );
}
