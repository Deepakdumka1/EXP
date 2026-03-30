"use client";

import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";
import { Sun, Moon, LayoutGrid, List, SlidersHorizontal, ChevronDown, Check, LogOut, User, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useState, useRef, useEffect, useCallback } from "react";
import { useAuth } from "@/components/auth/auth-provider";
import { NotificationBell } from "@/components/ui/notification-bell";

type SortOption = "newest" | "oldest" | "name-asc" | "name-desc" | "size";
type ViewMode = "grid" | "list";

interface HeaderProps {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
  showViewToggle?: boolean;
  showSort?: boolean;
  onViewModeChange?: (mode: ViewMode) => void;
  onSortChange?: (sort: SortOption) => void;
}

const sortOptions: { value: SortOption; label: string }[] = [
  { value: "newest", label: "Newest First" },
  { value: "oldest", label: "Oldest First" },
  { value: "name-asc", label: "Name (A-Z)" },
  { value: "name-desc", label: "Name (Z-A)" },
  { value: "size", label: "File Size" },
];

export function Header({ title, subtitle, actions, showViewToggle = true, showSort = true, onViewModeChange, onSortChange }: HeaderProps) {
  const { theme, setTheme } = useTheme();
  const { user, logout } = useAuth();
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [sortOpen, setSortOpen] = useState(false);
  const [currentSort, setCurrentSort] = useState<SortOption>("newest");
  const [avatarOpen, setAvatarOpen] = useState(false);
  const [themeAnimating, setThemeAnimating] = useState(false);
  const sortRef = useRef<HTMLDivElement>(null);
  const avatarRef = useRef<HTMLDivElement>(null);

  const toggleTheme = useCallback(() => {
    setThemeAnimating(true);
    setTheme(theme === "dark" ? "light" : "dark");
    setTimeout(() => setThemeAnimating(false), 400);
  }, [theme, setTheme]);

  const handleViewMode = (mode: ViewMode) => { setViewMode(mode); onViewModeChange?.(mode); };
  const handleSort = (sort: SortOption) => { setCurrentSort(sort); onSortChange?.(sort); setSortOpen(false); };

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (sortRef.current && !sortRef.current.contains(e.target as Node)) setSortOpen(false);
      if (avatarRef.current && !avatarRef.current.contains(e.target as Node)) setAvatarOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <header className="relative z-20 flex items-center justify-between h-16 px-4 lg:px-8 overflow-visible border-b border-[var(--border)]">
      <div className="flex items-center gap-3">
        {actions}
        <div>
          <h1 className="text-[18px] font-bold tracking-tight leading-tight">{title}</h1>
          {subtitle && <p className="text-[12px] text-[var(--muted-foreground)] mt-0.5">{subtitle}</p>}
        </div>
      </div>

      <div className="flex items-center gap-1">
        {showViewToggle && (
          <div className="hidden sm:flex items-center rounded-full p-[3px] bg-[var(--muted)]">
            {(["grid", "list"] as const).map((mode) => (
              <button
                key={mode}
                onClick={() => handleViewMode(mode)}
                className={cn(
                  "p-[7px] rounded-full transition-all duration-150 cursor-pointer",
                  viewMode === mode
                    ? "bg-[var(--background)] text-[var(--foreground)] shadow-sm"
                    : "text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
                )}
              >
                {mode === "grid" ? <LayoutGrid className="w-4 h-4" /> : <List className="w-4 h-4" />}
              </button>
            ))}
          </div>
        )}

        {showSort && (
          <div className="relative hidden sm:block" ref={sortRef}>
            <button
              onClick={() => setSortOpen(!sortOpen)}
              className="flex items-center gap-1.5 h-8 px-3 rounded-full text-sm text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--hover)] transition-colors cursor-pointer"
            >
              <SlidersHorizontal className="w-4 h-4" />
              Sort
              <ChevronDown className={cn("w-3 h-3 transition-transform duration-200", sortOpen && "rotate-180")} />
            </button>
            {sortOpen && (
              <div className="absolute right-0 mt-1 w-48 bg-[var(--card-solid)] rounded-xl shadow-xl border border-[var(--border)] z-50 p-1 animate-[scaleIn_150ms_ease-out]">
                {sortOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => handleSort(option.value)}
                    className={cn(
                      "flex items-center justify-between w-full px-3 py-2 text-sm rounded-lg transition-colors cursor-pointer",
                      currentSort === option.value
                        ? "bg-[var(--accent)]/10 text-[var(--accent)] font-medium"
                        : "hover:bg-[var(--hover)] text-[var(--foreground)]"
                    )}
                  >
                    {option.label}
                    {currentSort === option.value && <Check className="w-4 h-4" />}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        <NotificationBell />

        <button
          onClick={toggleTheme}
          className="p-2 rounded-full text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--hover)] transition-colors cursor-pointer"
        >
          <Sun className={cn("w-5 h-5 hidden dark:block", themeAnimating && "theme-toggle-animate")} />
          <Moon className={cn("w-5 h-5 block dark:hidden", themeAnimating && "theme-toggle-animate")} />
        </button>

        <div className="relative" ref={avatarRef}>
          <button
            onClick={() => setAvatarOpen(!avatarOpen)}
            className={cn(
              "w-8 h-8 rounded-full overflow-hidden cursor-pointer ring-2 transition-all duration-150",
              avatarOpen ? "ring-[var(--accent)]" : "ring-transparent hover:ring-[var(--border)]"
            )}
          >
            <Image src="https://i.pravatar.cc/64?img=68" alt="User" width={32} height={32} className="w-full h-full object-cover" />
          </button>
          {avatarOpen && (
            <div className="absolute right-0 mt-1 w-56 bg-[var(--card-solid)] rounded-xl shadow-xl border border-[var(--border)] z-50 p-1 animate-[scaleIn_150ms_ease-out]">
              <div className="px-3 py-2.5 border-b border-[var(--border)] mb-1">
                <p className="text-sm font-semibold">{user?.name || "Alex Morgan"}</p>
                <p className="text-xs text-[var(--muted-foreground)]">{user?.email || "alex@lensvault.com"}</p>
              </div>
              <button onClick={() => { setAvatarOpen(false); window.location.href = "/settings"; }} className="flex items-center gap-2.5 w-full px-3 py-2 text-sm hover:bg-[var(--hover)] rounded-lg transition-colors cursor-pointer">
                <Settings className="w-4 h-4 opacity-50" /> Settings
              </button>
              <button onClick={() => { setAvatarOpen(false); window.location.href = "/people"; }} className="flex items-center gap-2.5 w-full px-3 py-2 text-sm hover:bg-[var(--hover)] rounded-lg transition-colors cursor-pointer">
                <User className="w-4 h-4 opacity-50" /> Profile
              </button>
              <div className="border-t border-[var(--border)] mt-1 pt-1">
                <button onClick={() => { setAvatarOpen(false); logout(); window.location.href = "/login"; }} className="flex items-center gap-2.5 w-full px-3 py-2 text-sm text-[var(--color-error)] hover:bg-[var(--color-error)]/5 rounded-lg transition-colors cursor-pointer">
                  <LogOut className="w-4 h-4" /> Sign Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
