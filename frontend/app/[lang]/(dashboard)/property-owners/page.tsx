import { getDictionary } from "@/lib/get-dictionary";
import { Locale } from "@/lib/constants";
import { OwnerListClient } from "@/features/property-owners/components/owner-list-client";

export default async function PropertyOwnersPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const dict = await getDictionary(lang as Locale);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Property Owners</h1>
        <p className="text-muted-foreground">
          Manage identity profiles for house and property owners in the kebele.
        </p>
      </div>

      <OwnerListClient lang={lang} dict={dict} />
    </div>
  );
}
