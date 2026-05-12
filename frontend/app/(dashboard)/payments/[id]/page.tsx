import { PaymentDetailPageClient } from "@/features/payments/components/payment-detail-page-client";

export default function PaymentDetailPage({ params }: { params: { id: string } }) {
  return <PaymentDetailPageClient paymentId={params.id} />;
}
