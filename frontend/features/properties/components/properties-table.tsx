"use client";

import { DataTable } from "@/components/table/data-table";
import { Property } from "../types";
import { formatDate } from "@/lib/utils";
import { type Dictionary } from "@/lib/get-dictionary";
import { StatusBadge } from "@/components/ui/status-badge";
import { ColumnDef } from "@tanstack/react-table";
import { Home } from "lucide-react";

interface PropertiesTableProps {
  data: Property[];
  isLoading?: boolean;
  totalItems: number;
  totalPages: number;
  currentPage: number;
  onPageChange: (page: number) => void;
  onSearch: (search: string) => void;
  onView: (property: Property) => void;
  onEdit: (property: Property) => void;
  onDelete?: (property: Property) => void;
  dict: Dictionary;
}

export function PropertiesTable({
  data,
  isLoading,
  onView,
  onEdit,
  dict,
}: PropertiesTableProps) {
  const columns: ColumnDef<Property>[] = [
    {
      id: "houseNumber",
      header: "House No",
      accessorKey: "houseNumber",
    },
    {
      id: "fileNumber",
      header: "File No",
      accessorKey: "fileNumber",
    },
    {
      id: "owner",
      header: dict.common.propertyOwners || "Owner",
      accessorKey: "owner.fullName",
      cell: ({ row }) => (
        <div className="flex flex-col">
          <span className="font-semibold text-foreground">{row.original.owner?.fullName || "Unknown"}</span>
          <span className="text-xs text-muted-foreground">{row.original.owner?.phone}</span>
        </div>
      ),
    },
    {
      id: "landSizeKare",
      header: "Size (Kare)",
      accessorKey: "landSizeKare",
      cell: ({ row }) => <span className="font-medium">{row.original.landSizeKare} m²</span>,
    },
    {
      id: "status",
      header: "Status",
      accessorKey: "status",
      cell: ({ row }) => <StatusBadge status={row.original.status as any} dict={dict} showIcon size="sm" />,
    },
    {
      id: "updatedAt",
      header: "Last Updated",
      accessorKey: "updatedAt",
      cell: ({ row }) => <span className="text-muted-foreground">{formatDate(row.original.updatedAt)}</span>,
    },
    {
      id: "actions",
      header: "",
      cell: ({ row }) => (
        <div className="flex justify-end gap-2">
          <button 
            onClick={() => onView(row.original)}
            className="text-primary hover:underline text-sm font-medium"
          >
            View
          </button>
          <button 
            onClick={() => onEdit(row.original)}
            className="text-muted-foreground hover:text-foreground text-sm font-medium"
          >
            Edit
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
      emptyTitle="No properties found"
      emptyDescription="Try adding a new property or adjusting your search filters."
      emptyIcon={Home}
    />
  );
}
