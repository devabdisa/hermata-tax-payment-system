"use client";

import { AssessmentForm } from "@/features/assessments/components/assessment-form";
import { assessmentsApi } from "@/features/assessments/api";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, Suspense } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Loader2 } from "lucide-react";

function NewAssessmentContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);

  const initialPropertyId = searchParams.get("propertyId") || "";

  const handleSubmit = async (data: any) => {
    setIsLoading(true);
    try {
      const res = await assessmentsApi.createAssessment(data);
      toast.success("Assessment generated successfully");
      router.push(`/assessments/${res.data.id}`);
    } catch (error: any) {
      toast.error(error.message || "Failed to create assessment");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Create Tax Assessment</h1>
          <p className="text-muted-foreground mt-1">
            Generate a yearly tax assessment for an approved property.
          </p>
        </div>
      </div>

      <AssessmentForm 
        onSubmit={handleSubmit} 
        isLoading={isLoading} 
        onCancel={() => router.back()}
        initialData={initialPropertyId ? { propertyId: initialPropertyId } as any : undefined}
      />
    </div>
  );
}

export default function NewAssessmentPage() {
  return (
    <Suspense fallback={<div className="flex h-[400px] items-center justify-center"><Loader2 className="h-8 w-8 animate-spin" /></div>}>
      <NewAssessmentContent />
    </Suspense>
  );
}
