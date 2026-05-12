"use client";

import { BasicDataGrid } from "@/components/table/BasicDataGridTable";
import { Property } from "../types";
import { PropertyStatusBadge } from "./property-status-badge";
import { formatDate } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { type Dictionary } from "@/lib/get-dictionary";

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
  totalItems,
  totalPages,
  currentPage,
  onPageChange,
  onSearch,
  onView,
  onEdit,
  dict,
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
      header: dict.common.propertyOwners || "Owner",
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
      cell: (row: Property) => <PropertyStatusBadge status={row.status} dict={dict} />,
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
      title={dict.common.properties}
      searchPlaceholder={dict.common?.search || "Search..."}
    />
  );
}
