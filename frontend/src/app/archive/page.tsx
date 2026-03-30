"use client";

import { Header } from "@/components/layout/header";
import { usePhotosList } from "@/hooks/use-photos";
import { PhotoGrid } from "@/components/photos/photo-grid";
import { Archive, Loader2 } from "lucide-react";
import { useState } from "react";

export default function ArchivePage() {
  const { photos: archivedPhotos, loading } = usePhotosList({ archived: true, limit: 100 });

  return (
    <>
      <Header
        title="Archive"
        subtitle={`${archivedPhotos.length} items`}
        showViewToggle={false}
        showSort={false}
      />
      <div className="p-4 lg:p-8">
        <p className="flex items-center gap-2 mb-6 text-sm text-[var(--muted-foreground)] bg-[var(--muted)] px-4 py-3 rounded-lg border border-[var(--border)]">
          <Archive className="w-4 h-4 shrink-0" />
          These items won&apos;t show in your main photos
        </p>
        {loading ? (
          <div className="flex p-12 justify-center"><Loader2 className="animate-spin w-8 h-8 text-[var(--muted-foreground)]" /></div>
        ) : archivedPhotos.length > 0 ? (
          <PhotoGrid photos={archivedPhotos} />
        ) : (
          <div className="flex flex-col items-center justify-center min-h-[50vh]">
            <Archive className="w-14 h-14 text-[var(--muted-foreground)]/25 mb-3" />
            <p className="text-sm text-[var(--muted-foreground)]">Nothing archived</p>
          </div>
        )}
      </div>
    </>
  );
}
