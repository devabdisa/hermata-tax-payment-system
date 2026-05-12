"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { assessmentsApi } from "../api";
import { TaxAssessment, AssessmentStatus } from "../types";
import { AssessmentsTable } from "./assessments-table";
import { Button } from "@/components/ui/button";
import { Plus, Calculator } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

import { Suspense } from "react";

function AssessmentsPageContent() {
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
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Tax Assessments</h1>
          <p className="text-muted-foreground">
            Manage yearly house tax assessments and official calculation snapshots.
          </p>
        </div>
        <Button asChild className="gap-2">
          <Link href="/assessments/new">
            <Calculator className="h-4 w-4" />
            Create Assessment
          </Link>
        </Button>
      </div>

      <AssessmentsTable
        data={assessments}
        isLoading={isLoading}
        totalItems={totalItems}
        totalPages={totalPages}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
        onSearch={setSearch}
        onRefresh={fetchAssessments}
      />
    </div>
  );
}


export function AssessmentsPageClient() {
  return (
    <Suspense fallback={<div className="flex h-[400px] items-center justify-center">Loading...</div>}>
      <AssessmentsPageContent />
    </Suspense>
  );
}
