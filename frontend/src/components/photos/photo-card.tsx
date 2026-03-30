"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";
import { Heart, Play, Check, Share2, Download, Trash2 } from "lucide-react";
import { useState } from "react";
import type { Photo } from "@/data/mock";

interface PhotoCardProps {
  photo: Photo;
  selected?: boolean;
  onSelect?: (id: string) => void;
  onClick?: (photo: Photo) => void;
  index?: number;
  viewMode?: "grid" | "list";
}

export function PhotoCard({ photo, selected, onSelect, onClick, index = 0, viewMode = "grid" }: PhotoCardProps) {
  const [liked, setLiked] = useState(photo.isFavorite);
  const [heartBurst, setHeartBurst] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    setLiked(!liked);
    if (!liked) {
      setHeartBurst(true);
      setTimeout(() => setHeartBurst(false), 600);
    }
  };

  if (viewMode === "list") {
    return (
      <div
        className={cn(
          "group flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer transition-all duration-150",
          "hover:bg-[var(--hover)]",
          selected && "bg-[var(--accent)]/10 ring-1 ring-[var(--accent)]"
        )}
        onClick={() => onClick?.(photo)}
        suppressHydrationWarning
      >
        <button
          onClick={(e) => {
            e.stopPropagation();
            onSelect?.(photo.id);
          }}
          className={cn(
            "w-5 h-5 rounded flex-shrink-0 flex items-center justify-center transition-all duration-150 cursor-pointer border-2",
            selected
              ? "bg-[var(--accent)] border-[var(--accent)]"
              : "border-[var(--border)] opacity-0 group-hover:opacity-100"
          )}
        >
          {selected && <Check className="w-3 h-3 text-white" />}
        </button>

        <div className="relative w-12 h-12 rounded-md overflow-hidden flex-shrink-0">
          <Image
            src={photo.thumbnail}
            alt={photo.title}
            fill
            sizes="48px"
            className="object-cover"
          />
          {photo.isVideo && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/30">
              <Play className="w-3 h-3 text-white fill-white" />
            </div>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium truncate">{photo.title}</p>
          <p className="text-xs text-[var(--muted-foreground)]">
            {photo.date}{photo.location ? ` · ${photo.location}` : ""}
          </p>
        </div>

        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
          <button
            onClick={handleLike}
            className="p-1.5 rounded-full hover:bg-[var(--muted)] transition-colors cursor-pointer"
          >
            <Heart className={cn(
              "w-4 h-4 transition-all",
              liked ? "fill-[var(--color-rose)] text-[var(--color-rose)]" : "text-[var(--muted-foreground)]"
            )} />
          </button>
          <button
            onClick={(e) => e.stopPropagation()}
            className="p-1.5 rounded-full hover:bg-[var(--muted)] transition-colors cursor-pointer"
          >
            <Download className="w-4 h-4 text-[var(--muted-foreground)]" />
          </button>
          <button
            onClick={(e) => e.stopPropagation()}
            className="p-1.5 rounded-full hover:bg-[var(--muted)] transition-colors cursor-pointer"
          >
            <Trash2 className="w-4 h-4 text-[var(--muted-foreground)]" />
          </button>
        </div>

        {photo.isVideo && photo.duration && (
          <span className="text-[11px] text-[var(--muted-foreground)] font-mono flex-shrink-0">{photo.duration}</span>
        )}
      </div>
    );
  }

  return (
    <div
      className={cn(
        "group relative aspect-square rounded-lg overflow-hidden cursor-pointer",
        "transition-all duration-200",
        "hover:shadow-lg hover:z-10 hover:scale-[1.02]",
        selected && "ring-2 ring-[var(--accent)] ring-offset-2 ring-offset-[var(--background)] scale-[0.97]"
      )}
      style={{ animationDelay: `${index * 20}ms` }}
      onClick={() => onClick?.(photo)}
      suppressHydrationWarning
    >
      {!imageLoaded && <div className="absolute inset-0 skeleton" />}

      <Image
        src={photo.thumbnail}
        alt={photo.title}
        fill
        priority={index < 6}
        sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, (max-width: 1280px) 20vw, 16vw"
        className={cn(
          "object-cover transition-all duration-300 group-hover:scale-105",
          imageLoaded ? "opacity-100" : "opacity-0"
        )}
        onLoad={() => setImageLoaded(true)}
      />

      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />

      <button
        onClick={(e) => {
          e.stopPropagation();
          onSelect?.(photo.id);
        }}
        className={cn(
          "absolute top-2 left-2 w-6 h-6 rounded-full flex items-center justify-center transition-all duration-150 cursor-pointer",
          selected
            ? "bg-[var(--accent)] border-2 border-white opacity-100 shadow-md"
            : "bg-black/30 border-2 border-white/70 opacity-0 group-hover:opacity-100 hover:bg-black/50"
        )}
      >
        {selected && <Check className="w-3.5 h-3.5 text-white" />}
      </button>

      <div className="absolute top-2 right-2 flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        <button
          onClick={handleLike}
          className="w-7 h-7 rounded-full bg-black/40 hover:bg-black/60 flex items-center justify-center cursor-pointer transition-colors"
        >
          <Heart className={cn(
            "w-3.5 h-3.5 text-white transition-all",
            liked && "fill-[var(--color-rose)] text-[var(--color-rose)]",
            heartBurst && "heart-burst"
          )} />
        </button>
        <button
          onClick={(e) => e.stopPropagation()}
          className="w-7 h-7 rounded-full bg-black/40 hover:bg-black/60 flex items-center justify-center cursor-pointer transition-colors"
        >
          <Share2 className="w-3.5 h-3.5 text-white" />
        </button>
        <button
          onClick={(e) => e.stopPropagation()}
          className="w-7 h-7 rounded-full bg-black/40 hover:bg-black/60 flex items-center justify-center cursor-pointer transition-colors"
        >
          <Download className="w-3.5 h-3.5 text-white" />
        </button>
      </div>

      {liked && (
        <div className="absolute top-2 right-2 group-hover:opacity-0 transition-opacity duration-200">
          <Heart className="w-5 h-5 text-white fill-[var(--color-rose)] drop-shadow" />
        </div>
      )}

      {photo.isVideo && photo.duration && (
        <div className="absolute bottom-2 right-2 flex items-center gap-1 bg-black/60 rounded-md px-1.5 py-0.5" suppressHydrationWarning>
          <Play className="w-3 h-3 text-white fill-white" />
          <span className="text-[11px] text-white font-mono font-medium" suppressHydrationWarning>{photo.duration}</span>
        </div>
      )}

      <div className="absolute bottom-0 left-0 right-0 p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        <p className="text-xs text-white font-medium truncate">{photo.title}</p>
      </div>
    </div>
  );
}
