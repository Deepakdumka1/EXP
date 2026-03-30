"use client";

import { useState, useRef, useEffect } from "react";
import { Bell, Upload, Heart, FolderPlus, UserPlus, MapPin, Clock } from "lucide-react";
import Link from "next/link";

interface Notification {
  id: string;
  icon: typeof Bell;
  color: string;
  title: string;
  time: string;
  read: boolean;
}

const NOTIFICATIONS: Notification[] = [
  { id: "1", icon: Upload, color: "text-[var(--color-electric-blue)]", title: "24 photos uploaded from Goa Trip", time: "2m ago", read: false },
  { id: "2", icon: UserPlus, color: "text-[var(--color-indigo)]", title: "3 new faces detected in uploads", time: "15m ago", read: false },
  { id: "3", icon: FolderPlus, color: "text-[var(--color-royal-purple)]", title: "Auto-album: Weekend in Rishikesh", time: "1h ago", read: false },
  { id: "4", icon: Heart, color: "text-[var(--color-rose)]", title: "Memories: 1 year ago today", time: "8h ago", read: true },
  { id: "5", icon: MapPin, color: "text-[var(--color-amber)]", title: "12 photos added to Nainital Lake", time: "5h ago", read: true },
];

export function NotificationBell() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const unreadCount = NOTIFICATIONS.filter((n) => !n.read).length;

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className="relative p-2 rounded-full text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--hover)] transition-colors cursor-pointer"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 w-4 h-4 bg-[var(--color-electric-blue)] text-white text-[9px] font-bold rounded-full flex items-center justify-center animate-[scaleIn_0.2s_ease-out]">
            {unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-1 w-80 bg-[var(--card-solid)] rounded-xl shadow-xl border border-[var(--border)] z-50 animate-[scaleIn_150ms_ease-out] overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--border)]">
            <h3 className="text-sm font-semibold">Notifications</h3>
            {unreadCount > 0 && (
              <span className="text-xs text-[var(--color-electric-blue)] font-medium">{unreadCount} new</span>
            )}
          </div>

          <div className="max-h-[320px] overflow-y-auto">
            {NOTIFICATIONS.map((notif) => {
              const Icon = notif.icon;
              return (
                <div
                  key={notif.id}
                  className={`flex items-start gap-3 px-4 py-3 hover:bg-[var(--hover)] transition-colors cursor-pointer ${
                    !notif.read ? "bg-[var(--color-electric-blue)]/5" : ""
                  }`}
                >
                  <Icon className={`w-4 h-4 mt-0.5 ${notif.color} flex-shrink-0`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-[var(--foreground)] line-clamp-1">{notif.title}</p>
                    <p className="text-xs text-[var(--muted-foreground)] mt-0.5 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {notif.time}
                    </p>
                  </div>
                  {!notif.read && (
                    <div className="w-2 h-2 bg-[var(--color-electric-blue)] rounded-full flex-shrink-0 mt-1.5" />
                  )}
                </div>
              );
            })}
          </div>

          <Link
            href="/activity"
            onClick={() => setOpen(false)}
            className="block text-center text-sm text-[var(--color-electric-blue)] font-medium py-3 border-t border-[var(--border)] hover:bg-[var(--hover)] transition-colors"
          >
            View all activity
          </Link>
        </div>
      )}
    </div>
  );
}
