import { IssueConfirmationPageClient } from "@/features/confirmations/components/issue-confirmation-page-client";
import { getDictionary } from "@/lib/get-dictionary";
import { type Locale } from "@/lib/constants";

export default async function IssueConfirmationPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const dict = await getDictionary(lang as Locale);
  return <IssueConfirmationPageClient dict={dict} />;
}
