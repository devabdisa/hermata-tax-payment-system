"use client";

import { AssessmentsPageClient } from "@/features/assessments/components/assessments-page-client";
import { Suspense } from "react";
import { Loader2 } from "lucide-react";

export default function AssessmentsPage() {
  return (
    <Suspense fallback={<div className="flex h-[400px] items-center justify-center"><Loader2 className="h-8 w-8 animate-spin" /></div>}>
      <AssessmentsPageClient />
    </Suspense>
  );
}
