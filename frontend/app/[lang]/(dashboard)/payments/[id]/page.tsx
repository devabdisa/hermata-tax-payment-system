import { PaymentDetailPageClient } from "@/features/payments/components/payment-detail-page-client";
import { getDictionary } from "@/lib/get-dictionary";
import { type Locale } from "@/lib/constants";

export default async function PaymentDetailPage({ params }: { params: Promise<{ id: string; lang: string }> }) {
  const { id, lang } = await params;
  const dict = await getDictionary(lang as Locale);
  return <PaymentDetailPageClient paymentId={id} dict={dict} />;
}
