"use client";

import { Header } from "@/components/layout/header";
import { PhotoGrid } from "@/components/photos/photo-grid";
import { Film, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { api } from "@/lib/api";
import { formatPhoto } from "@/utils/format";
import type { Photo } from "@/data/mock";

export default function VideosPage() {
  const [videoPhotos, setVideoPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.photos.list({ is_video: true, limit: 100 }).then(res => {
      setVideoPhotos(res.items.map(formatPhoto));
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  if (loading) return <div className="flex p-12 justify-center"><Loader2 className="animate-spin w-8 h-8 text-[var(--muted-foreground)]" /></div>;

  return (
    <>
      <Header
        title="Videos"
        subtitle={`${videoPhotos.length} videos`}
        showSort
      />
      <div className="p-4 lg:p-8">
        {videoPhotos.length > 0 ? (
          <PhotoGrid photos={videoPhotos} />
        ) : (
          <div className="flex flex-col items-center justify-center min-h-[50vh] text-center">
            <Film className="w-14 h-14 text-[var(--muted-foreground)]/25 mb-3" />
            <h3 className="text-base font-semibold mb-1">No videos</h3>
            <p className="text-sm text-[var(--muted-foreground)]">
              Videos you upload will show up here
            </p>
          </div>
        )}
      </div>
    </>
  );
}
