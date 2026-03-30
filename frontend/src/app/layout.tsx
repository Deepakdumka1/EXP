import type { Metadata } from "next";
import { Providers } from "@/components/layout/providers";
import { AppShell } from "@/components/layout/app-shell";
import { SuppressHydrationWarning } from "./suppress-hydration";
import "./globals.css";

export const metadata: Metadata = {
  title: "LensVault",
  description: "Your photos, organized and safe.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased" suppressHydrationWarning>
        <SuppressHydrationWarning />
        <Providers>
          <AppShell>{children}</AppShell>
        </Providers>
      </body>
    </html>
  );
}
