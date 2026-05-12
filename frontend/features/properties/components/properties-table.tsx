"use client";

import { BasicDataGrid } from "@/components/table/BasicDataGridTable";
import { Property } from "../types";
import { PropertyStatusBadge } from "./property-status-badge";
import { formatDate } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

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
}

export function PropertiesTable({
  data,
  isLoading,
  totalItems,
  totalPages,
  currentPage,
  onPageChange,
  onSearch,
  onView,
  onEdit,
}: PropertiesTableProps) {
  const columns = [
    {
      id: "houseNumber",
      header: "House No",
      accessorKey: "houseNumber",
      sortable: true,
    },
    {
      id: "fileNumber",
      header: "File No",
      accessorKey: "fileNumber",
      sortable: true,
    },
    {
      id: "owner",
      header: "Owner",
      accessorKey: "owner.fullName",
      cell: (row: Property) => row.owner?.fullName || "Unknown",
    },
    {
      id: "landSizeKare",
      header: "Size (Kare)",
      accessorKey: "landSizeKare",
      cell: (row: Property) => `${row.landSizeKare} m²`,
    },
    {
      id: "status",
      header: "Status",
      accessorKey: "status",
      cell: (row: Property) => <PropertyStatusBadge status={row.status} />,
    },
    {
      id: "updatedAt",
      header: "Last Updated",
      accessorKey: "updatedAt",
      cell: (row: Property) => formatDate(row.updatedAt),
    },
  ];

  return (
    <BasicDataGrid
      data={data}
      columns={columns}
      isLoading={isLoading}
      totalItems={totalItems}
      totalPages={totalPages}
      currentPage={currentPage}
      onPageChange={onPageChange}
      onSearch={onSearch}
      onView={onView}
      onEdit={onEdit}
      showAddButton={false}
      showItemsPerPage={true}
      title="Properties"
    />
  );
}
