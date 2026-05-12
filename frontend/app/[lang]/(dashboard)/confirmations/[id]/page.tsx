import { ConfirmationDetailPageClient } from "@/features/confirmations/components/confirmation-detail-page-client";
import { getDictionary } from "@/lib/get-dictionary";
import { type Locale } from "@/lib/constants";

export default async function ConfirmationDetailPage({ params }: { params: Promise<{ id: string; lang: string }> }) {
  const { id, lang } = await params;
  const dict = await getDictionary(lang as Locale);
  return <ConfirmationDetailPageClient confirmationId={id} dict={dict} />;
}
