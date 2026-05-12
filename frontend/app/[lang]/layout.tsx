import type { Metadata } from "next";
import "../globals.css";
import { SUPPORTED_LOCALES } from "@/lib/constants";
import { ThemeProvider } from "@/components/theme-provider";

export async function generateStaticParams() {
  return SUPPORTED_LOCALES.map((lang) => ({ lang }));
}

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Hermata Kebele House Tax System",
  description: "Kebele House Tax and Property Payment Management System",
};

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}>) {
  const { lang } = await params;
  return (
    <html
      lang={lang}
      className="h-full antialiased"
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col font-sans">
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
