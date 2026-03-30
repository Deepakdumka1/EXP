"use client";

import { Header } from "@/components/layout/header";
import { usePhotosList } from "@/hooks/use-photos";
import { PhotoGrid } from "@/components/photos/photo-grid";
import { Loader2 } from "lucide-react";

export default function RecentPage() {
  const { photos: recentPhotos, loading } = usePhotosList({ limit: 50 });

  return (
    <>
      <Header
        title="Recently added"
        subtitle={loading ? "Loading..." : `${recentPhotos.length} photos`}
        showSort
      />
      <div className="p-4 lg:p-8">
        {loading ? (
          <div className="flex p-12 justify-center"><Loader2 className="animate-spin w-8 h-8 text-[var(--muted-foreground)]" /></div>
        ) : (
          <PhotoGrid photos={recentPhotos} />
        )}
      </div>
    </>
  );
}
