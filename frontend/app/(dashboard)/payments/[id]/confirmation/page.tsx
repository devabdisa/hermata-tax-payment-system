import { PaymentConfirmationPageClient } from "@/features/confirmations/components/payment-confirmation-page-client";

export default function PaymentConfirmationPage({ params }: { params: { id: string } }) {
  return <PaymentConfirmationPageClient paymentId={params.id} />;
}
