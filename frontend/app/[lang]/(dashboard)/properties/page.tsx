import { PropertiesPageClient } from "@/features/properties/components/properties-page-client";
import { getDictionary } from "@/lib/get-dictionary";
import { type Locale } from "@/lib/constants";

export default async function PropertiesPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const dict = await getDictionary(lang as Locale);
  return <PropertiesPageClient dict={dict} />;
}
