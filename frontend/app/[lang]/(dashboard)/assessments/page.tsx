import { AssessmentsPageClient } from "@/features/assessments/components/assessments-page-client";
import { Suspense } from "react";
import { Loader2 } from "lucide-react";
import { getDictionary } from "@/lib/get-dictionary";
import { type Locale } from "@/lib/constants";

export default async function AssessmentsPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const dict = await getDictionary(lang as Locale);

  return (
    <Suspense fallback={<div className="flex h-[400px] items-center justify-center"><Loader2 className="h-8 w-8 animate-spin" /></div>}>
      <AssessmentsPageClient dict={dict} />
    </Suspense>
  );
}
