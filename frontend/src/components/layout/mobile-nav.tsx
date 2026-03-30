"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Camera, Search, Plus, FolderOpen, Users } from "lucide-react";

const tabs = [
  { href: "/", label: "Photos", icon: Camera },
  { href: "/explore", label: "Search", icon: Search },
  { href: "/upload", label: "Upload", icon: Plus, highlight: true },
  { href: "/albums", label: "Albums", icon: FolderOpen },
  { href: "/people", label: "People", icon: Users },
];

export function MobileNav() {
  const pathname = usePathname();

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-30 bg-[var(--background)] border-t border-[var(--border)] pb-[env(safe-area-inset-bottom)]" suppressHydrationWarning>
      <div className="flex items-center justify-around h-14" suppressHydrationWarning>
        {tabs.map((tab) => {
          const isActive = tab.href === "/" ? pathname === "/" : pathname.startsWith(tab.href);
          return (
            <Link
              key={tab.href}
              href={tab.href}
              scroll={false}
              className={cn(
                "flex flex-col items-center justify-center gap-0.5 flex-1 py-1 transition-colors duration-150",
                isActive ? "text-[var(--accent)]" : "text-[var(--muted-foreground)]"
              )}
            >
              {tab.highlight ? (
                <div className="w-10 h-10 rounded-full bg-[var(--accent)] text-white flex items-center justify-center -mt-4 shadow-md" suppressHydrationWarning>
                  <tab.icon className="w-5 h-5" strokeWidth={2.5} />
                </div>
              ) : (
                <tab.icon className={cn("w-5 h-5", isActive && "text-[var(--accent)]")} />
              )}
              <span className={cn("text-[10px]", isActive ? "font-semibold" : "font-medium")}>{tab.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
