import { LocationCategoriesPageClient } from "@/features/location-categories/components/location-categories-page-client";
import { getDictionary } from "@/lib/get-dictionary";
import { type Locale } from "@/lib/constants";

export default async function LocationCategoriesPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const dict = await getDictionary(lang as Locale);
  return <LocationCategoriesPageClient dict={dict} />;
}
