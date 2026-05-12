import { ConfirmationDetailPageClient } from "@/features/confirmations/components/confirmation-detail-page-client";

export default function ConfirmationDetailPage({ params }: { params: { id: string } }) {
  return <ConfirmationDetailPageClient confirmationId={params.id} />;
}
