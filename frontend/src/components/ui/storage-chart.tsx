"use client";

import { Camera, Film, FileText, MonitorSmartphone, Archive, Trash2 } from "lucide-react";

interface StorageItem {
  label: string;
  size: string;
  bytes: number;
  color: string;
  icon: typeof Camera;
}

const STORAGE_DATA: StorageItem[] = [
  { label: "Photos", size: "3.2 GB", bytes: 3.2, color: "var(--color-electric-blue)", icon: Camera },
  { label: "Videos", size: "1.8 GB", bytes: 1.8, color: "var(--color-royal-purple)", icon: Film },
  { label: "Documents", size: "420 MB", bytes: 0.42, color: "var(--color-teal)", icon: FileText },
  { label: "Screenshots", size: "280 MB", bytes: 0.28, color: "var(--color-amber)", icon: MonitorSmartphone },
  { label: "Archive", size: "180 MB", bytes: 0.18, color: "var(--color-indigo)", icon: Archive },
  { label: "Trash", size: "20 MB", bytes: 0.02, color: "var(--color-rose)", icon: Trash2 },
];

const TOTAL = STORAGE_DATA.reduce((acc, d) => acc + d.bytes, 0);
const MAX = 15;

export function StorageChart() {
  return (
    <div className="space-y-4">
      {/* Visual bar */}
      <div className="h-4 rounded-full overflow-hidden bg-[var(--muted)] flex">
        {STORAGE_DATA.map((item) => (
          <div
            key={item.label}
            className="h-full transition-all duration-700 ease-out first:rounded-l-full last:rounded-r-full"
            style={{
              width: `${(item.bytes / MAX) * 100}%`,
              backgroundColor: item.color,
            }}
            title={`${item.label}: ${item.size}`}
          />
        ))}
      </div>

      {/* Legend */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {STORAGE_DATA.map((item) => {
          const Icon = item.icon;
          return (
            <div key={item.label} className="flex items-center gap-2.5">
              <div
                className="w-3 h-3 rounded-full flex-shrink-0"
                style={{ backgroundColor: item.color }}
              />
              <div className="flex items-center gap-1.5 min-w-0">
                <Icon className="w-3.5 h-3.5 text-[var(--muted-foreground)]" />
                <span className="text-xs text-[var(--foreground)] truncate">{item.label}</span>
              </div>
              <span className="text-xs text-[var(--muted-foreground)] ml-auto whitespace-nowrap">{item.size}</span>
            </div>
          );
        })}
      </div>

      <div className="flex items-center justify-between pt-2 border-t border-[var(--border)]">
        <span className="text-sm font-medium text-[var(--foreground)]">{TOTAL.toFixed(1)} GB used</span>
        <span className="text-sm text-[var(--muted-foreground)]">of {MAX} GB</span>
      </div>
    </div>
  );
}
