"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { propertiesApi } from "../api";
import { Property, PropertyStatus } from "../types";
import { PropertiesTable } from "./properties-table";
import { toast } from "sonner";
import { type Dictionary } from "@/lib/get-dictionary";
import { PageShell } from "@/components/ui/page-shell";
import { PageHeader } from "@/components/ui/page-header";
import { Home, Plus } from "lucide-react";

interface PropertiesPageClientProps {
  dict: Dictionary;
}

export function PropertiesPageClient({ dict }: PropertiesPageClientProps) {
  const router = useRouter();
  const [data, setData] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<PropertyStatus | "">("");

  const fetchProperties = async () => {
    setIsLoading(true);
    try {
      const response = await propertiesApi.getProperties({
        page: currentPage,
        search,
        status: statusFilter || undefined,
      });
      setData(response.data);
      setTotalItems(response.meta.total);
      setTotalPages(response.meta.totalPages);
    } catch (error: any) {
      toast.error(error.message || "Failed to fetch properties");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, [currentPage, search, statusFilter]);

  return (
    <PageShell>
      <PageHeader
        title={dict.common.properties}
        description="Manage house records, file numbers, ownership type, land size, and approval status."
        icon={Home}
        breadcrumbs={[
          { label: dict.common.dashboard, href: "/dashboard" },
          { label: dict.common.properties, href: "/properties" }
        ]}
        actions={[
          {
            label: `Add ${dict.common.properties}`,
            onClick: () => router.push("/properties/new"),
            icon: Plus,
            variant: "default"
          }
        ]}
      />

      <PropertiesTable
        data={data}
        isLoading={isLoading}
        totalItems={totalItems}
        totalPages={totalPages}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
        onSearch={setSearch}
        onView={(p) => router.push(`/properties/${p.id}`)}
        onEdit={(p) => router.push(`/properties/${p.id}/edit`)}
        dict={dict}
      />
    </PageShell>
  );
}
