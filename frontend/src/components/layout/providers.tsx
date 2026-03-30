"use client";

import { ThemeProvider } from "next-themes";
import { ToastProvider } from "@/components/ui/toast";
import { SearchWrapper } from "@/components/search/search-wrapper";
import { AuthProvider } from "@/components/auth/auth-provider";
import { KeyboardShortcuts } from "@/components/ui/keyboard-shortcuts";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem enableColorScheme={false}>
      <AuthProvider>
        <ToastProvider>
          <SearchWrapper>
            {children}
            <KeyboardShortcuts />
          </SearchWrapper>
        </ToastProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
