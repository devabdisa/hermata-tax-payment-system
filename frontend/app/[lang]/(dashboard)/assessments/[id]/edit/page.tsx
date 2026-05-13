"use client";

import { AssessmentForm } from "@/features/assessments/components/assessment-form";
import { assessmentsApi } from "@/features/assessments/api";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { TaxAssessment } from "@/features/assessments/types";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function EditAssessmentPage() {
  const { id, lang } = useParams();
  const router = useRouter();
  const [assessment, setAssessment] = useState<TaxAssessment | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchAssessment = async () => {
    setIsLoading(true);
    try {
      const res = await assessmentsApi.getAssessment(id as string);
      if (res.data.status !== "DRAFT") {
        toast.error("Only draft assessments can be edited");
        router.push(`/${lang as string}/assessments/${id}`);
        return;
      }
      setAssessment(res.data);
    } catch (error: any) {
      toast.error(error.message || "Failed to fetch assessment");
      router.push(`/${lang as string}/assessments`);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchAssessment();
  }, [id]);

  const handleSubmit = async (data: any) => {
    setIsSubmitting(true);
    try {
      await assessmentsApi.updateAssessment(id as string, data);
      toast.success("Assessment updated successfully");
      router.push(`/${lang as string}/assessments/${id}`);
    } catch (error: any) {
      toast.error(error.message || "Failed to update assessment");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-[400px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!assessment) return null;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Edit Assessment</h1>
          <p className="text-muted-foreground">
            Adjust penalty and balance for House #{assessment.property?.houseNumber} ({assessment.taxYear}).
          </p>
        </div>
      </div>

      <AssessmentForm 
        isEdit 
        initialData={assessment} 
        onSubmit={handleSubmit} 
        isLoading={isSubmitting} 
        onCancel={() => router.back()}
      />
    </div>
  );
}
