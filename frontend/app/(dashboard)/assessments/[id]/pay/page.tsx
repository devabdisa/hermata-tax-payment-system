import { AssessmentPaymentPageClient } from "@/features/payments/components/assessment-payment-page-client";

export default function AssessmentPaymentPage({ params }: { params: { id: string } }) {
  return <AssessmentPaymentPageClient assessmentId={params.id} />;
}
