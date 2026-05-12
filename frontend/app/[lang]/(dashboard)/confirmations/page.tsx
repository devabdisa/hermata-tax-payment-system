import { ConfirmationsPageClient } from "@/features/confirmations/components/confirmations-page-client";
import { getDictionary } from "@/lib/get-dictionary";
import { type Locale } from "@/lib/constants";

export default async function ConfirmationsPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const dict = await getDictionary(lang as Locale);
  return <ConfirmationsPageClient dict={dict} />;
}
