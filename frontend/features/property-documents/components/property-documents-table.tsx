"use client";

import { PropertyDocument } from "../types";
import { DocumentStatusBadge } from "./document-status-badge";
import { DocumentReviewActions } from "./document-review-actions";
import { BasicDataGrid } from "@/components/table/BasicDataGridTable";
import { formatDate } from "@/lib/utils";
import { User, FileIcon, Calendar, ShieldCheck, Tag } from "lucide-react";

interface PropertyDocumentsTableProps {
  documents: PropertyDocument[];
  isLoading: boolean;
  totalItems: number;
  totalPages: number;
  currentPage: number;
  onPageChange: (page: number) => void;
  onSearch: (search: string) => void;
  onApprove: (id: string) => Promise<void>;
  onReject: (id: string, reason: string) => Promise<void>;
  onReplace: (id: string, formData: FormData) => Promise<void>;
  canReview?: boolean;
  canReplace?: boolean;
}

export function PropertyDocumentsTable({
  documents,
  isLoading,
  totalItems,
  totalPages,
  currentPage,
  onPageChange,
  onSearch,
  onApprove,
  onReject,
  onReplace,
  canReview,
  canReplace,
}: PropertyDocumentsTableProps) {
  const columns = [
    {
      header: "Document Info",
      accessorKey: "title",
      cell: (row: PropertyDocument) => (
        <div className="flex flex-col gap-1">
          <span className="font-semibold text-foreground">{row.title}</span>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Tag className="h-3 w-3" />
            <span className="capitalize">{row.documentType?.toLowerCase().replace('_', ' ') || "Uncategorized"}</span>
          </div>
        </div>
      ),
    },
    {
      header: "File Details",
      accessorKey: "fileName",
      cell: (row: PropertyDocument) => (
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-1.5 text-sm">
            <FileIcon className="h-3.5 w-3.5 text-primary" />
            <span className="truncate max-w-[150px]">{row.fileName}</span>
          </div>
          {row.fileSize && (
            <span className="text-xs text-muted-foreground">
              {(row.fileSize / 1024 / 1024).toFixed(2)} MB
            </span>
          )}
        </div>
      ),
    },
    {
      header: "Status",
      accessorKey: "status",
      cell: (row: PropertyDocument) => (
        <div className="flex flex-col gap-1.5">
          <DocumentStatusBadge status={row.status} />
          {row.status === "REJECTED" && row.rejectionReason && (
            <span className="text-[10px] text-rose-600 font-medium italic max-w-[150px] leading-tight">
              Reason: {row.rejectionReason}
            </span>
          )}
        </div>
      ),
    },
    {
      header: "Reviewer",
      accessorKey: "reviewedBy",
      cell: (row: PropertyDocument) => (
        row.reviewedBy ? (
          <div className="flex flex-col gap-1 text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <ShieldCheck className="h-3 w-3" />
              <span>{row.reviewedBy.name}</span>
            </div>
            <div className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              <span>{row.reviewedAt ? formatDate(row.reviewedAt) : "-"}</span>
            </div>
          </div>
        ) : (
          <span className="text-xs text-muted-foreground italic">Pending</span>
        )
      ),
    },
    {
      header: "Actions",
      accessorKey: "actions",
      cell: (row: PropertyDocument) => (
        <DocumentReviewActions 
          document={row}
          onApprove={onApprove}
          onReject={onReject}
          onReplace={onReplace}
          canReview={canReview}
          canReplace={canReplace}
        />
      ),
    },
  ];

  return (
    <BasicDataGrid
      columns={columns}
      data={documents}
      isLoading={isLoading}
      totalItems={totalItems}
      totalPages={totalPages}
      currentPage={currentPage}
      onPageChange={onPageChange}
      onSearch={onSearch}
      searchPlaceholder="Search documents by title or file name..."
    />
  );
}
