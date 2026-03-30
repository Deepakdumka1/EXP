"use client";

import { Header } from "@/components/layout/header";
import { PhotoGrid } from "@/components/photos/photo-grid";
import { Heart, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { api } from "@/lib/api";
import { formatPhoto } from "@/utils/format";
import type { Photo } from "@/data/mock";

export default function FavoritesPage() {
  const [favoritePhotos, setFavoritePhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.photos.list({ favorite: true, limit: 100 }).then(res => {
      setFavoritePhotos(res.items.map(formatPhoto));
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  if (loading) return <div className="flex p-12 justify-center"><Loader2 className="animate-spin w-8 h-8 text-[var(--muted-foreground)]" /></div>;

  return (
    <>
      <Header
        title="Favourites"
        subtitle={`${favoritePhotos.length} photos`}
      />
      <div className="p-4 lg:p-8">
        {favoritePhotos.length > 0 ? (
          <PhotoGrid photos={favoritePhotos} />
        ) : (
          <div className="flex flex-col items-center justify-center min-h-[50vh]">
            <Heart className="w-14 h-14 text-[var(--color-rose)]/30 mb-4" />
            <h3 className="text-lg font-semibold mb-1">No favourites yet</h3>
            <p className="text-sm text-[var(--muted-foreground)]">
              Heart a photo to save it here
            </p>
          </div>
        )}
      </div>
    </>
  );
}
