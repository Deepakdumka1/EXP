"use client";

import { Header } from "@/components/layout/header";
import { Button } from "@/components/ui/button";
import { Trash2, RotateCcw, Clock, Loader2 } from "lucide-react";
import Image from "next/image";
import { useState, useEffect } from "react";
import { api } from "@/lib/api";
import { formatPhoto } from "@/utils/format";
import type { Photo } from "@/data/mock";

export default function TrashPage() {
  const [items, setItems] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTrash = async () => {
    setLoading(true);
    try {
      const res = await api.trash.list({ limit: 100 });
      setItems(res.items.map(formatPhoto));
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrash();
  }, []);

  const handleRestore = async (id: string) => {
    try {
      await api.photos.restore(id);
      setItems(prev => prev.filter(p => p.id !== id));
    } catch (e) {
      console.error("Failed to restore", e);
    }
  };

  const handleEmptyTrash = async () => {
    try {
      await api.trash.empty();
      setItems([]);
    } catch (e) {
      console.error("Failed to empty trash", e);
    }
  };

  return (
    <>
      <Header
        title="Bin"
        showViewToggle={false}
        showSort={false}
        actions={
          items.length > 0 ? (
            <Button variant="destructive" size="sm" onClick={handleEmptyTrash}>
              <Trash2 className="w-4 h-4" />
              Empty Trash
            </Button>
          ) : undefined
        }
      />
      <div className="p-4 lg:p-8">
        {items.length > 0 && (
          <div className="flex items-center gap-2.5 mb-6 text-sm text-[var(--muted-foreground)] bg-[var(--muted)] px-4 py-3 rounded-lg border border-[var(--border)]">
            <Clock className="w-4 h-4 shrink-0 text-[var(--color-amber)]" />
            Items are automatically deleted after 30 days
          </div>
        )}

        {items.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2 sm:gap-3">
            {items.map((photo) => {
              // Calculate remaining days if trashed_at is available, standard logic:
              const daysRemaining = 30; // Backend handles cleanup, we can just say ~30
              
              return (
              <div
                key={photo.id}
                className="group relative aspect-square rounded-lg overflow-hidden border border-[var(--border)] hover:border-[var(--accent)]/30 transition-all duration-200"
              >
                <Image
                  src={photo.thumbnail}
                  alt={photo.title}
                  fill
                  sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 20vw"
                  className="object-cover opacity-40 group-hover:opacity-60 transition-opacity duration-200"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />

                <div className="absolute bottom-2.5 left-2.5 right-2.5 text-center">
                  <span className="text-xs text-white bg-black/50 px-2.5 py-1 rounded-full font-medium">
                    {daysRemaining}d left
                  </span>
                </div>

                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-black/20">
                  <Button
                    size="sm"
                    variant="secondary"
                    className="gap-1.5 shadow-md cursor-pointer pointer-events-auto"
                    onClick={() => handleRestore(photo.id)}
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    Restore
                  </Button>
                </div>
              </div>
            )})}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center min-h-[50vh]">
            <Trash2 className="w-14 h-14 text-[var(--muted-foreground)]/25 mb-3" />
            <h3 className="text-base font-semibold mb-1">Bin is empty</h3>
            <p className="text-sm text-[var(--muted-foreground)]">
              Deleted stuff stays here for 30 days
            </p>
          </div>
        )}
      </div>
    </>
  );
}
