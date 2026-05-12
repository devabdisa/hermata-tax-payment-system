import { PaymentsPageClient } from "@/features/payments/components/payments-page-client";
import { getDictionary } from "@/lib/get-dictionary";
import { type Locale } from "@/lib/constants";

export default async function PaymentsPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const dict = await getDictionary(lang as Locale);
  return <PaymentsPageClient dict={dict} />;
}
