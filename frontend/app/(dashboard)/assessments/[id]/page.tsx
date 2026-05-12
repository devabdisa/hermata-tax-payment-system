"use client";

import { AssessmentDetail } from "@/features/assessments/components/assessment-detail";
import { assessmentsApi } from "@/features/assessments/api";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { TaxAssessment } from "@/features/assessments/types";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function AssessmentDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [assessment, setAssessment] = useState<TaxAssessment | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchAssessment = async () => {
    setIsLoading(true);
    try {
      const res = await assessmentsApi.getAssessment(id as string);
      setAssessment(res.data);
    } catch (error: any) {
      toast.error(error.message || "Failed to fetch assessment");
      router.push("/assessments");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchAssessment();
  }, [id]);

  if (isLoading) {
    return (
      <div className="flex h-[400px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!assessment) return null;

  return (
    <div className="space-y-6 pb-12">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.push("/assessments")}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <span className="text-sm text-muted-foreground">Back to List</span>
      </div>

      <AssessmentDetail assessment={assessment} onRefresh={fetchAssessment} />
    </div>
  );
}
