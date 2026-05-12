import { PaymentConfirmationPageClient } from "@/features/confirmations/components/payment-confirmation-page-client";
import { getDictionary } from "@/lib/get-dictionary";
import { type Locale } from "@/lib/constants";

export default async function PaymentConfirmationPage({ params }: { params: Promise<{ id: string; lang: string }> }) {
  const { id, lang } = await params;
  const dict = await getDictionary(lang as Locale);
  return <PaymentConfirmationPageClient paymentId={id} dict={dict} />;
}
