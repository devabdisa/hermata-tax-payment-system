import type { Metadata } from "next";
import "../globals.css";
import { SUPPORTED_LOCALES } from "@/lib/constants";
import { ThemeProvider } from "@/components/theme-provider";

import { Inter } from "next/font/google";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export async function generateStaticParams() {
  return SUPPORTED_LOCALES.map((lang) => ({ lang }));
}

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Hermata Kebele House Tax System",
  description: "Kebele House Tax and Property Payment Management System",
};

import { GlobalCommandPalette } from "@/components/global-command-palette";

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
      className={`h-full antialiased ${inter.variable}`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col font-sans bg-mesh-light dark:bg-mesh-dark bg-fixed">
        <ThemeProvider>
          {children}
          <GlobalCommandPalette lang={lang} />
        </ThemeProvider>
      </body>
    </html>
  );
}
