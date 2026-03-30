"use client";

import { useState } from "react";
import {
  Bell, Upload, Heart, Trash2, FolderPlus, Share2, UserPlus,
  MapPin, Tag, Shield, Clock, Check, ChevronDown, Filter,
} from "lucide-react";

interface Activity {
  id: string;
  type: "upload" | "favorite" | "trash" | "album" | "share" | "face" | "location" | "tag" | "security";
  title: string;
  description: string;
  time: string;
  read: boolean;
  count?: number;
  thumbnail?: string;
}

const MOCK_ACTIVITIES: Activity[] = [
  {
    id: "1",
    type: "upload",
    title: "Upload complete",
    description: "24 photos from Goa Trip uploaded successfully",
    time: "2 minutes ago",
    read: false,
    count: 24,
    thumbnail: "https://picsum.photos/id/14/100/100",
  },
  {
    id: "2",
    type: "face",
    title: "New face detected",
    description: "Found 3 new faces in your recent uploads. Would you like to name them?",
    time: "15 minutes ago",
    read: false,
    count: 3,
  },
  {
    id: "3",
    type: "album",
    title: "Auto-album created",
    description: "\"Weekend in Rishikesh\" — 18 photos grouped by location and date",
    time: "1 hour ago",
    read: false,
    count: 18,
    thumbnail: "https://picsum.photos/id/15/100/100",
  },
  {
    id: "4",
    type: "share",
    title: "Album shared",
    description: "Priya accepted your invite to \"College Farewell\" album",
    time: "3 hours ago",
    read: true,
  },
  {
    id: "5",
    type: "location",
    title: "New place discovered",
    description: "12 photos geotagged to Nainital Lake added to Places",
    time: "5 hours ago",
    read: true,
    count: 12,
    thumbnail: "https://picsum.photos/id/20/100/100",
  },
  {
    id: "6",
    type: "favorite",
    title: "Memories ready",
    description: "\"1 Year Ago Today\" — 8 photos from Marine Drive, Mumbai",
    time: "8 hours ago",
    read: true,
    count: 8,
    thumbnail: "https://picsum.photos/id/11/100/100",
  },
  {
    id: "7",
    type: "security",
    title: "New device login",
    description: "Your account was accessed from Chrome on Windows 11",
    time: "1 day ago",
    read: true,
  },
  {
    id: "8",
    type: "tag",
    title: "Auto-tagging complete",
    description: "42 photos tagged with: sunset, food, selfie, trip",
    time: "1 day ago",
    read: true,
    count: 42,
  },
  {
    id: "9",
    type: "trash",
    title: "Trash auto-cleanup",
    description: "6 items permanently deleted after 30 days in trash",
    time: "2 days ago",
    read: true,
    count: 6,
  },
  {
    id: "10",
    type: "upload",
    title: "Upload complete",
    description: "12 screenshots imported from device backup",
    time: "3 days ago",
    read: true,
    count: 12,
  },
];

const ICON_MAP: Record<string, { icon: typeof Bell; color: string; bg: string }> = {
  upload: { icon: Upload, color: "text-[var(--color-electric-blue)]", bg: "bg-[var(--color-electric-blue)]/10" },
  favorite: { icon: Heart, color: "text-[var(--color-rose)]", bg: "bg-[var(--color-rose)]/10" },
  trash: { icon: Trash2, color: "text-[var(--text-tertiary)]", bg: "bg-[var(--bg-tertiary)]" },
  album: { icon: FolderPlus, color: "text-[var(--color-royal-purple)]", bg: "bg-[var(--color-royal-purple)]/10" },
  share: { icon: Share2, color: "text-[var(--color-teal)]", bg: "bg-[var(--color-teal)]/10" },
  face: { icon: UserPlus, color: "text-[var(--color-indigo)]", bg: "bg-[var(--color-indigo)]/10" },
  location: { icon: MapPin, color: "text-[var(--color-amber)]", bg: "bg-[var(--color-amber)]/10" },
  tag: { icon: Tag, color: "text-[var(--color-cyan)]", bg: "bg-[var(--color-cyan)]/10" },
  security: { icon: Shield, color: "text-[var(--color-rose)]", bg: "bg-[var(--color-rose)]/10" },
};

export default function ActivityPage() {
  const [activities, setActivities] = useState(MOCK_ACTIVITIES);
  const [filter, setFilter] = useState<string>("all");

  const unreadCount = activities.filter((a) => !a.read).length;
  const filtered = filter === "all" ? activities : activities.filter((a) => a.type === filter);

  const markAllRead = () => {
    setActivities((prev) => prev.map((a) => ({ ...a, read: true })));
  };

  const markRead = (id: string) => {
    setActivities((prev) => prev.map((a) => (a.id === id ? { ...a, read: true } : a)));
  };

  const filterOptions = [
    { value: "all", label: "All" },
    { value: "upload", label: "Uploads" },
    { value: "album", label: "Albums" },
    { value: "face", label: "Faces" },
    { value: "share", label: "Shared" },
    { value: "security", label: "Security" },
  ];

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)] flex items-center gap-3">
            <Bell className="w-6 h-6" />
            Activity
            {unreadCount > 0 && (
              <span className="px-2.5 py-0.5 bg-[var(--color-electric-blue)] text-white text-xs font-semibold rounded-full">
                {unreadCount}
              </span>
            )}
          </h1>
          <p className="text-sm text-[var(--text-secondary)] mt-1">Recent activity and notifications</p>
        </div>
        {unreadCount > 0 && (
          <button
            onClick={markAllRead}
            className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-[var(--color-electric-blue)] hover:bg-[var(--color-electric-blue)]/10 rounded-lg transition-colors"
          >
            <Check className="w-4 h-4" />
            Mark all read
          </button>
        )}
      </div>

      {/* Filter pills */}
      <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-2">
        <Filter className="w-4 h-4 text-[var(--text-tertiary)] flex-shrink-0" />
        {filterOptions.map((opt) => (
          <button
            key={opt.value}
            onClick={() => setFilter(opt.value)}
            className={`px-3 py-1.5 text-xs font-medium rounded-full whitespace-nowrap transition-all ${
              filter === opt.value
                ? "bg-[var(--color-electric-blue)] text-white"
                : "bg-[var(--bg-secondary)] text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)]"
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {/* Activity List */}
      <div className="space-y-2">
        {filtered.map((activity, i) => {
          const { icon: Icon, color, bg } = ICON_MAP[activity.type] || ICON_MAP.upload;
          return (
            <div
              key={activity.id}
              onClick={() => markRead(activity.id)}
              className={`flex items-start gap-4 p-4 rounded-xl border transition-all duration-200 cursor-pointer hover:shadow-sm animate-[fadeIn_0.3s_ease-out] ${
                activity.read
                  ? "border-transparent hover:bg-[var(--bg-secondary)]"
                  : "border-[var(--color-electric-blue)]/20 bg-[var(--color-electric-blue)]/5 hover:bg-[var(--color-electric-blue)]/8"
              }`}
              style={{ animationDelay: `${i * 40}ms` }}
            >
              {/* Icon */}
              <div className={`w-10 h-10 rounded-xl ${bg} flex items-center justify-center flex-shrink-0`}>
                <Icon className={`w-5 h-5 ${color}`} />
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className={`text-sm font-semibold ${activity.read ? "text-[var(--text-primary)]" : "text-[var(--text-primary)]"}`}>
                    {activity.title}
                  </h3>
                  {!activity.read && (
                    <div className="w-2 h-2 bg-[var(--color-electric-blue)] rounded-full flex-shrink-0" />
                  )}
                </div>
                <p className="text-sm text-[var(--text-secondary)] mt-0.5 line-clamp-1">{activity.description}</p>
                <div className="flex items-center gap-3 mt-1.5">
                  <span className="text-xs text-[var(--text-tertiary)] flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {activity.time}
                  </span>
                  {activity.count && (
                    <span className="text-xs text-[var(--text-tertiary)] px-1.5 py-0.5 bg-[var(--bg-tertiary)] rounded">
                      {activity.count} items
                    </span>
                  )}
                </div>
              </div>

              {/* Thumbnail */}
              {activity.thumbnail && (
                <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
                  <img src={activity.thumbnail} alt="" className="w-full h-full object-cover" />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16 text-[var(--text-tertiary)]">
          <Bell className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p className="font-medium">No activity yet</p>
          <p className="text-sm mt-1">Activity and notifications will appear here</p>
        </div>
      )}
    </div>
  );
}
