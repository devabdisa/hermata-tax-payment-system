"use client";

import { TaxAssessment } from "../types";
import { AssessmentStatusBadge } from "./assessment-status-badge";
import { AssessmentActions } from "./assessment-actions";
import { BasicDataGrid } from "@/components/table/BasicDataGridTable";
import { formatDate } from "@/lib/utils";
import { Home, Calendar, User, Hash } from "lucide-react";

interface AssessmentsTableProps {
  data: TaxAssessment[];
  isLoading: boolean;
  totalItems: number;
  totalPages: number;
  currentPage: number;
  onPageChange: (page: number) => void;
  onSearch: (search: string) => void;
  onRefresh?: () => void;
}

export function AssessmentsTable({
  data,
  isLoading,
  totalItems,
  totalPages,
  currentPage,
  onPageChange,
  onSearch,
  onRefresh,
}: AssessmentsTableProps) {
  const format = (val: number | string) => Number(val).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  const columns = [
    {
      header: "Assessment Info",
      accessorKey: "taxYear",
      cell: (row: TaxAssessment) => (
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-1.5 font-bold text-foreground">
            <Calendar className="h-3.5 w-3.5 text-primary" />
            Tax Year {row.taxYear}
          </div>
          <span className="text-[10px] text-muted-foreground font-mono">ID: {row.id.slice(0, 8)}...</span>
        </div>
      ),
    },
    {
      header: "Property & Owner",
      accessorKey: "property.houseNumber",
      cell: (row: TaxAssessment) => (
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-1.5 text-sm font-medium">
            <Home className="h-3.5 w-3.5 text-muted-foreground" />
            House #{row.property?.houseNumber}
          </div>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <User className="h-3 w-3" />
            {row.property?.owner?.fullName || "N/A"}
          </div>
        </div>
      ),
    },
    {
      header: "Amounts (ETB)",
      accessorKey: "totalAmount",
      cell: (row: TaxAssessment) => (
        <div className="flex flex-col gap-0.5 text-right pr-4">
          <span className="text-sm font-black text-foreground">{format(row.totalAmount)}</span>
          <div className="flex items-center justify-end gap-1 text-[10px] text-muted-foreground italic">
            <span>Base: {format(row.baseAmount)}</span>
            {Number(row.penaltyAmount) > 0 && <span className="text-rose-500">+{format(row.penaltyAmount)}</span>}
          </div>
        </div>
      ),
    },
    {
      header: "Status",
      accessorKey: "status",
      cell: (row: TaxAssessment) => (
        <div className="flex flex-col gap-1">
          <AssessmentStatusBadge status={row.status} />
          {row.dueDate && (
            <span className="text-[10px] text-muted-foreground">
              Due: {formatDate(row.dueDate)}
            </span>
          )}
        </div>
      ),
    },
    {
      header: "Actions",
      accessorKey: "actions",
      cell: (row: TaxAssessment) => (
        <AssessmentActions assessment={row} onRefresh={onRefresh} variant="dropdown" />
      ),
    },
  ];

  return (
    <BasicDataGrid
      columns={columns}
      data={data}
      isLoading={isLoading}
      totalItems={totalItems}
      totalPages={totalPages}
      currentPage={currentPage}
      onPageChange={onPageChange}
      onSearch={onSearch}
      searchPlaceholder="Search by house number, file number or owner..."
      title="Tax Assessments"
      showAddButton={false}
    />
  );
}
