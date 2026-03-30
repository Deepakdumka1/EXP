"use client";

import { Download, Heart, Share2, Trash2, X, FolderPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";

interface MultiSelectBarProps {
  count: number;
  onClear: () => void;
  onDelete?: () => void;
}

export function MultiSelectBar({ count, onClear, onDelete }: MultiSelectBarProps) {
  const { addToast } = useToast();

  if (count === 0) return null;

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 animate-[slideInUp_200ms_ease-out]">
      <div className="flex items-center gap-2 bg-[var(--card-solid)] border border-[var(--border)] rounded-full shadow-xl px-4 py-2">
        <span className="text-sm font-medium mr-2">{count} selected</span>
        <div className="w-px h-5 bg-[var(--border)]" />
        <button
          onClick={() => addToast("success", `${count} photos added to favorites`)}
          className="p-2 rounded-full hover:bg-[var(--hover)] cursor-pointer transition-colors"
          title="Favorite"
        >
          <Heart className="w-4 h-4" />
        </button>
        <button
          onClick={() => addToast("success", "Share link copied")}
          className="p-2 rounded-full hover:bg-[var(--hover)] cursor-pointer transition-colors"
          title="Share"
        >
          <Share2 className="w-4 h-4" />
        </button>
        <button
          onClick={() => addToast("success", `Downloading ${count} photos`)}
          className="p-2 rounded-full hover:bg-[var(--hover)] cursor-pointer transition-colors"
          title="Download"
        >
          <Download className="w-4 h-4" />
        </button>
        <button
          onClick={() => addToast("info", `${count} photos added to album`)}
          className="p-2 rounded-full hover:bg-[var(--hover)] cursor-pointer transition-colors"
          title="Add to album"
        >
          <FolderPlus className="w-4 h-4" />
        </button>
        <button
          onClick={() => { onDelete?.(); addToast("info", `${count} photos moved to bin`); }}
          className="p-2 rounded-full hover:bg-red-500/10 text-red-500 cursor-pointer transition-colors"
          title="Delete"
        >
          <Trash2 className="w-4 h-4" />
        </button>
        <div className="w-px h-5 bg-[var(--border)]" />
        <button
          onClick={onClear}
          className="p-2 rounded-full hover:bg-[var(--hover)] cursor-pointer transition-colors"
          title="Clear selection"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
