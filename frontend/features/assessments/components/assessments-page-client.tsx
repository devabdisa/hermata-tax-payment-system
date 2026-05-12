"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { assessmentsApi } from "../api";
import { TaxAssessment, AssessmentStatus } from "../types";
import { AssessmentsTable } from "./assessments-table";
import { Calculator, Plus } from "lucide-react";
import { toast } from "sonner";
import { Suspense } from "react";
import { type Dictionary } from "@/lib/get-dictionary";
import { PageShell } from "@/components/ui/page-shell";
import { PageHeader } from "@/components/ui/page-header";

interface AssessmentsPageClientProps {
  dict: Dictionary;
}

function AssessmentsPageContent({ dict }: AssessmentsPageClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [assessments, setAssessments] = useState<TaxAssessment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<AssessmentStatus | undefined>(
    (searchParams.get("status") as AssessmentStatus) || undefined
  );

  const fetchAssessments = async () => {
    setIsLoading(true);
    try {
      const response = await assessmentsApi.getAssessments({
        page: currentPage,
        search,
        status,
        propertyId: searchParams.get("propertyId") || undefined,
      });
      setAssessments(response.data);
      setTotalItems(response.meta.total);
      setTotalPages(response.meta.totalPages);
    } catch (error: any) {
      toast.error(error.message || "Failed to fetch assessments");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAssessments();
  }, [currentPage, search, status, searchParams]);

  return (
    <PageShell>
      <PageHeader
        title={dict.common.assessments}
        description="Manage yearly house tax assessments and official calculation snapshots."
        icon={Calculator}
        breadcrumbs={[
          { label: dict.common.dashboard, href: "/dashboard" },
          { label: dict.common.assessments, href: "/assessments" }
        ]}
        actions={[
          {
            label: `Create ${dict.common.assessments}`,
            onClick: () => router.push("/assessments/new"),
            icon: Plus,
            variant: "default"
          }
        ]}
      />

      <AssessmentsTable
        data={assessments}
        isLoading={isLoading}
        totalItems={totalItems}
        totalPages={totalPages}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
        onSearch={setSearch}
        onRefresh={fetchAssessments}
        dict={dict}
      />
    </PageShell>
  );
}

export function AssessmentsPageClient({ dict }: AssessmentsPageClientProps) {
  return (
    <Suspense fallback={<div className="flex h-[400px] items-center justify-center">Loading...</div>}>
      <AssessmentsPageContent dict={dict} />
    </Suspense>
  );
}
