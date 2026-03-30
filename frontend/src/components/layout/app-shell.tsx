"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { Sidebar } from "@/components/layout/sidebar";
import { MobileNav } from "@/components/layout/mobile-nav";
import { PageTransition } from "@/components/layout/page-transition";
import { useAuth } from "@/components/auth/auth-provider";
import { Loader2 } from "lucide-react";

const PUBLIC_ROUTES = ["/login", "/register", "/landing"];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();
  const isPublicPage = PUBLIC_ROUTES.some((r) => pathname.startsWith(r));

  useEffect(() => {
    if (isLoading) return;

    // Redirect unauthenticated users to /landing for protected routes
    if (!isAuthenticated && !isPublicPage) {
      router.replace("/landing");
      return;
    }

    // Redirect authenticated users away from auth/landing pages
    if (isAuthenticated && isPublicPage) {
      router.replace("/");
      return;
    }
  }, [isAuthenticated, isLoading, isPublicPage, pathname, router]);

  // Show loading spinner while auth state is being determined
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[var(--bg-primary)]">
        <Loader2 className="w-8 h-8 animate-spin text-[var(--color-electric-blue)]" />
      </div>
    );
  }

  // Public pages (login, register, landing) — no sidebar
  if (isPublicPage) {
    if (isAuthenticated) return null; // Will redirect in useEffect
    return <>{children}</>;
  }

  // Protected pages — require auth
  if (!isAuthenticated) return null; // Will redirect in useEffect

  return (
    <>
      <div className="flex min-h-screen" suppressHydrationWarning>
        <Sidebar />
        <main className="flex-1 lg:ml-[260px] pb-20 lg:pb-0">
          <PageTransition>{children}</PageTransition>
        </main>
      </div>
      <MobileNav />
    </>
  );
}
