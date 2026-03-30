"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { PhotoGrid } from "./photo-grid";
import { X } from "lucide-react";
import { api, type PhotoResponse } from "@/lib/api";

interface Memory {
  id: string;
  label: string;
  color: string;
  photos: PhotoResponse[];
}

export function MemoriesCarousel() {
  const [memories, setMemories] = useState<Memory[]>([]);
  const [expanded, setExpanded] = useState<string | null>(null);

  useEffect(() => {
    api.photos.byMonth().then((months) => {
      const mems: Memory[] = [];
      const colors = [
        "from-blue-500 to-cyan-400",
        "from-purple-500 to-pink-400",
        "from-orange-400 to-rose-400",
        "from-teal-400 to-emerald-400",
        "from-amber-400 to-orange-400",
        "from-indigo-400 to-blue-400",
        "from-rose-400 to-pink-400",
      ];
      months.slice(0, 7).forEach((group, i) => {
        if (group.photos.length > 0) {
          mems.push({
            id: group.month,
            label: new Date(group.month + "-01").toLocaleDateString("en-US", { month: "long", year: "numeric" }),
            color: colors[i % colors.length],
            photos: group.photos.slice(0, 6),
          });
        }
      });
      setMemories(mems);
    }).catch(() => {});
  }, []);

  if (memories.length === 0) return null;

  if (expanded) {
    const memory = memories.find((m) => m.id === expanded);
    if (!memory) return null;

    const gridPhotos = memory.photos.map((p) => ({
      id: p.id,
      src: p.src,
      thumbnail: p.thumbnail,
      width: p.width,
      height: p.height,
      title: p.title,
      date: p.date,
      size: String(p.size),
      isFavorite: p.is_favorite,
      isVideo: p.is_video,
      duration: p.duration || undefined,
      location: p.location || undefined,
      camera: p.camera || undefined,
      tags: p.tags,
    }));

    return (
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-bold">{memory.label}</h3>
          <button
            onClick={() => setExpanded(null)}
            className="p-1.5 rounded-full hover:bg-[var(--hover)] cursor-pointer transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        <PhotoGrid photos={gridPhotos} />
      </div>
    );
  }

  return (
    <div className="mb-6">
      <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-thin px-1">
        {memories.map((memory) => (
          <button
            key={memory.id}
            onClick={() => setExpanded(memory.id)}
            className="flex flex-col items-center gap-2 shrink-0 group cursor-pointer"
          >
            <div className={`w-[72px] h-[72px] rounded-full p-[3px] bg-gradient-to-br ${memory.color} group-hover:scale-105 transition-transform duration-200`}>
              <div className="w-full h-full rounded-full overflow-hidden border-2 border-[var(--background)]">
                <Image
                  src={memory.photos[0]?.thumbnail || ""}
                  alt={memory.label}
                  width={72}
                  height={72}
                  priority
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            <span className="text-[11px] font-medium text-[var(--muted-foreground)] group-hover:text-[var(--foreground)] transition-colors max-w-[76px] truncate">
              {memory.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
