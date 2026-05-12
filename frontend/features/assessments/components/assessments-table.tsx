"use client";

import { DataTable } from "@/components/table/data-table";
import { TaxAssessment } from "../types";
import { StatusBadge } from "@/components/ui/status-badge";
import { AssessmentActions } from "./assessment-actions";
import { formatDate } from "@/lib/utils";
import { Home, Calendar, User, Calculator } from "lucide-react";
import { ColumnDef } from "@tanstack/react-table";
import { type Dictionary } from "@/lib/get-dictionary";

interface AssessmentsTableProps {
  data: TaxAssessment[];
  isLoading: boolean;
  totalItems: number;
  totalPages: number;
  currentPage: number;
  onPageChange: (page: number) => void;
  onSearch: (search: string) => void;
  onRefresh?: () => void;
  dict: Dictionary;
}

export function AssessmentsTable({
  data,
  isLoading,
  onRefresh,
  dict,
}: AssessmentsTableProps) {
  const format = (val: number | string) => Number(val).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  const columns: ColumnDef<TaxAssessment>[] = [
    {
      id: "taxYear",
      header: "Assessment Info",
      accessorKey: "taxYear",
      cell: ({ row }) => (
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-1.5 font-bold text-foreground">
            <Calendar className="h-3.5 w-3.5 text-primary" />
            Tax Year {row.original.taxYear}
          </div>
          <span className="text-[10px] text-muted-foreground font-mono">ID: {row.original.id.slice(0, 8)}...</span>
        </div>
      ),
    },
    {
      id: "property",
      header: "Property & Owner",
      accessorKey: "property.houseNumber",
      cell: ({ row }) => (
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-1.5 text-sm font-semibold text-foreground">
            <Home className="h-3.5 w-3.5 text-muted-foreground" />
            House #{row.original.property?.houseNumber}
          </div>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <User className="h-3 w-3" />
            {row.original.property?.owner?.fullName || "N/A"}
          </div>
        </div>
      ),
    },
    {
      id: "totalAmount",
      header: "Amount (ETB)",
      accessorKey: "totalAmount",
      cell: ({ row }) => (
        <div className="flex flex-col gap-0.5">
          <span className="text-sm font-black text-primary">{format(row.original.totalAmount)}</span>
          <div className="flex items-center gap-1 text-[10px] text-muted-foreground italic">
            <span>Base: {format(row.original.baseAmount)}</span>
            {Number(row.original.penaltyAmount) > 0 && <span className="text-rose-500">+{format(row.original.penaltyAmount)}</span>}
          </div>
        </div>
      ),
    },
    {
      id: "status",
      header: "Status",
      accessorKey: "status",
      cell: ({ row }) => (
        <div className="flex flex-col gap-1">
          <StatusBadge status={row.original.status as any} dict={dict} showIcon size="sm" />
          {row.original.dueDate && (
            <span className="text-[10px] text-muted-foreground">
              Due: {formatDate(row.original.dueDate)}
            </span>
          )}
        </div>
      ),
    },
    {
      id: "actions",
      header: "",
      cell: ({ row }) => (
        <div className="flex justify-end">
          <AssessmentActions assessment={row.original} onRefresh={onRefresh} variant="dropdown" />
        </div>
      ),
    },
  ];

  return (
    <DataTable
      columns={columns}
      data={data}
      isLoading={isLoading}
      searchColumn="taxYear"
      searchPlaceholder={dict.common?.search || "Search tax year..."}
      emptyTitle="No assessments found"
      emptyDescription="Manage yearly house tax assessments here."
      emptyIcon={Calculator}
    />
  );
}
