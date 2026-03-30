"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import {
  Camera, FolderOpen, FileText, MonitorSmartphone, Heart,
  Users, MapPin, Film, Clock, Archive, Lock, Trash2,
  Upload, Search, Settings, HardDrive, Share2, Bell,
} from "lucide-react";
import Image from "next/image";
import { ProgressBar } from "@/components/ui/progress-bar";
import { api, type StorageInfo } from "@/lib/api";

const mainItems = [
  { href: "/", label: "Photos", icon: Camera },
];

const collectionItems = [
  { href: "/albums", label: "Albums", icon: FolderOpen },
  { href: "/shared", label: "Shared albums", icon: Share2 },
  { href: "/documents", label: "Documents", icon: FileText },
  { href: "/screenshots", label: "Screenshots and recordings", icon: MonitorSmartphone },
  { href: "/favorites", label: "Favourites", icon: Heart },
  { href: "/people", label: "People and pets", icon: Users },
  { href: "/places", label: "Places", icon: MapPin },
  { href: "/videos", label: "Videos", icon: Film },
  { href: "/recent", label: "Recently added", icon: Clock },
  { href: "/archive", label: "Archive", icon: Archive },
  { href: "/locked", label: "Locked Folder", icon: Lock },
  { href: "/trash", label: "Bin", icon: Trash2 },
];

function NavItem({ href, label, icon: Icon, pathname, badge }: { href: string; label: string; icon: React.ComponentType<{ className?: string }>; pathname: string; badge?: number }) {
  const isActive = href === "/" ? pathname === "/" : pathname.startsWith(href);
  return (
    <Link
      href={href}
      scroll={false}
      className={cn(
        "flex items-center gap-3 h-10 px-4 rounded-full text-[14px] transition-colors duration-150 cursor-pointer",
        isActive
          ? "bg-[var(--accent)]/10 text-[var(--accent)] font-semibold"
          : "text-[var(--foreground)] hover:bg-[var(--hover)]"
      )}
    >
      <Icon className={cn("w-5 h-5 shrink-0", isActive ? "text-[var(--accent)]" : "opacity-60")} />
      <span className="truncate flex-1">{label}</span>
      {badge && badge > 0 && (
        <span className="w-5 h-5 rounded-full bg-[var(--accent)] text-white text-[10px] font-bold flex items-center justify-center shrink-0">
          {badge}
        </span>
      )}
    </Link>
  );
}

export function Sidebar() {
  const pathname = usePathname();
  const [storage, setStorage] = useState<StorageInfo | null>(null);

  useEffect(() => {
    api.settings.storage().then(setStorage).catch(() => {});
  }, []);

  return (
    <aside className="hidden lg:flex flex-col w-[260px] h-screen fixed left-0 top-0 z-30 bg-[var(--background)] border-r border-[var(--border)]" suppressHydrationWarning>

      <div className="flex items-center gap-2.5 h-16 px-5 shrink-0" suppressHydrationWarning>
        <Image src="/logo.svg" alt="LensVault" width={36} height={36} className="w-9 h-9" />
        <span className="text-[16px] font-bold tracking-tight">LensVault</span>
      </div>


      <div className="px-3 mb-2" suppressHydrationWarning>
        <Link
          href="/upload"
          scroll={false}
          className="flex items-center justify-center gap-2 w-full h-10 rounded-full text-sm font-semibold bg-[var(--accent)] text-white hover:bg-[var(--accent-secondary)] active:scale-[0.98] transition-all duration-150 cursor-pointer shadow-sm"
        >
          <Upload className="w-4 h-4" />
          Upload
        </Link>
      </div>


      <div className="px-3 mb-3" suppressHydrationWarning>
        <Link
          href="/search"
          scroll={false}
          className="flex items-center gap-2.5 h-10 px-4 rounded-full bg-[var(--muted)] text-[var(--muted-foreground)] text-sm hover:bg-[var(--border)] transition-colors cursor-pointer"
        >
          <Search className="w-4 h-4 shrink-0" />
          <span className="flex-1">Search</span>
          <kbd className="text-[10px] font-mono opacity-50">⌘K</kbd>
        </Link>
      </div>


      <nav className="flex-1 px-3 overflow-y-auto" suppressHydrationWarning>
        <div className="flex flex-col gap-0.5 mb-3" suppressHydrationWarning>
          {mainItems.map((item) => (
            <NavItem key={item.href} {...item} pathname={pathname} />
          ))}
        </div>

        <p className="text-[11px] font-semibold text-[var(--muted-foreground)] uppercase tracking-wider px-4 mb-1.5 mt-2" suppressHydrationWarning>Collections</p>
        <div className="flex flex-col gap-0.5" suppressHydrationWarning>
          {collectionItems.map((item) => (
            <NavItem key={item.href} {...item} pathname={pathname} />
          ))}
        </div>
      </nav>


      <div className="p-3 space-y-2 border-t border-[var(--border)]" suppressHydrationWarning>
        <NavItem href="/activity" label="Activity" icon={Bell} pathname={pathname} badge={3} />
        <NavItem href="/settings" label="Settings" icon={Settings} pathname={pathname} />

        <div className="px-4 py-3" suppressHydrationWarning>
          <div className="flex items-center gap-1.5 mb-2" suppressHydrationWarning>
            <HardDrive className="w-3.5 h-3.5 text-[var(--muted-foreground)]" />
            <span className="text-[12px] text-[var(--muted-foreground)] font-medium">Storage</span>
          </div>
          <ProgressBar value={storage?.percentage || 0} max={100} />
          <p className="text-[11px] text-[var(--muted-foreground)] mt-1.5">{storage?.used_formatted || "0 B"} of {storage?.limit_formatted || "0 B"} used</p>
        </div>
      </div>
    </aside>
  );
}
