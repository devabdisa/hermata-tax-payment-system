"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider, useTheme } from "next-themes";
import { applyTheme } from "@/lib/theme";

/**
 * ThemeWatcher Component
 * 
 * Synchronizes next-themes state with the internal theme management utility.
 * This ensures that the manual 'applyTheme' logic (like event dispatching)
 * runs whenever next-themes updates the theme.
 */
function ThemeWatcher() {
  const { theme, resolvedTheme, mounted } = useThemeWatcher();
  
  React.useEffect(() => {
    if (mounted && theme) {
      applyTheme(theme as any);
    }
  }, [theme, resolvedTheme, mounted]);
  
  return null;
}

/**
 * Custom hook to safely access theme state
 */
function useThemeWatcher() {
  const [mounted, setMounted] = React.useState(false);
  const { theme, resolvedTheme } = useTheme();
  
  React.useEffect(() => {
    setMounted(true);
  }, []);
  
  return { theme, resolvedTheme, mounted };
}

export function ThemeProvider({
  children,
  ...props
}: React.ComponentProps<typeof NextThemesProvider>) {
  return (
    <NextThemesProvider 
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange={false}
      {...props}
    >
      <ThemeWatcher />
      {children}
    </NextThemesProvider>
  );
}
