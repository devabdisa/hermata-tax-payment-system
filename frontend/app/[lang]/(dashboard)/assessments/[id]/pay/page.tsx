import { AssessmentPaymentPageClient } from "@/features/payments/components/assessment-payment-page-client";
import { getDictionary } from "@/lib/get-dictionary";
import { type Locale } from "@/lib/constants";

export const dynamic = "force-dynamic";

export default async function AssessmentPaymentPage({ params }: { params: Promise<{ id: string; lang: string }> }) {
  const { id, lang } = await params;
  const dict = await getDictionary(lang as Locale);
  return <AssessmentPaymentPageClient assessmentId={id} dict={dict} />;
}
