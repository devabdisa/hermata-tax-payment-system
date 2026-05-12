"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const languages = [
  { code: "en", label: "English" },
  { code: "am", label: "አማርኛ" },
  { code: "om", label: "Afaan Oromoo" },
];

export function LanguageSwitcher({ currentLocale }: { currentLocale: string }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();

  const handleLanguageChange = (newLocale: string) => {
    // pathname might be something like "/en/dashboard" or "/am/patients"
    const pathSegments = pathname.split("/");

    // Check if the first segment (after the leading slash) is a locale
    if (pathSegments.length > 1 && ["en", "am", "om"].includes(pathSegments[1])) {
      pathSegments[1] = newLocale;
    } else {
      // Just in case it's not starting with a locale, prepend it
      pathSegments.splice(1, 0, newLocale);
    }

    const newPathname = pathSegments.join("/");
    const newUrl = searchParams.toString() ? `${newPathname}?${searchParams.toString()}` : newPathname;

    router.push(newUrl);
  };

  return (
    <Select value={currentLocale} onValueChange={handleLanguageChange}>
      <SelectTrigger className="w-[130px] h-9 text-xs sm:text-sm">
        <SelectValue placeholder="Language" />
      </SelectTrigger>
      <SelectContent>
        {languages.map((lang) => (
          <SelectItem key={lang.code} value={lang.code}>
            {lang.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
