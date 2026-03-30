"use client";

import { useState } from "react";
import { PhotoCard } from "./photo-card";
import { MultiSelectBar } from "./multi-select-bar";
import { MediaViewer } from "@/components/viewer/media-viewer";
import type { Photo } from "@/data/mock";

interface PhotoGridProps {
  photos: Photo[];
  groupTitle?: string;
  viewMode?: "grid" | "list";
}

export function PhotoGrid({ photos, groupTitle, viewMode = "grid" }: PhotoGridProps) {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [viewerPhoto, setViewerPhoto] = useState<Photo | null>(null);
  const [viewerIndex, setViewerIndex] = useState(0);

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const openViewer = (photo: Photo) => {
    const idx = photos.findIndex((p) => p.id === photo.id);
    setViewerIndex(idx);
    setViewerPhoto(photo);
  };

  return (
    <>
      {groupTitle && (
        <div className="flex items-center gap-3 mb-4 mt-8 first:mt-0">
          <h3 className="text-[15px] font-semibold">{groupTitle}</h3>
          <div className="flex-1 h-px bg-[var(--border)]" />
          <span className="text-[11px] text-[var(--muted-foreground)] font-medium bg-[var(--muted)] px-2 py-0.5 rounded-full">{photos.length}</span>
        </div>
      )}
      <div className={
        viewMode === "list"
          ? "flex flex-col gap-1"
          : "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-1.5 sm:gap-2.5"
      }>
        {photos.map((photo, i) => (
          <PhotoCard
            key={photo.id}
            photo={photo}
            index={i}
            selected={selectedIds.has(photo.id)}
            onSelect={toggleSelect}
            onClick={openViewer}
            viewMode={viewMode}
          />
        ))}
      </div>

      <MultiSelectBar
        count={selectedIds.size}
        onClear={() => setSelectedIds(new Set())}
        onDelete={() => setSelectedIds(new Set())}
      />

      {viewerPhoto && (
        <MediaViewer
          photos={photos}
          currentIndex={viewerIndex}
          onClose={() => setViewerPhoto(null)}
          onNavigate={(idx) => {
            setViewerIndex(idx);
            setViewerPhoto(photos[idx]);
          }}
        />
      )}
    </>
  );
}
