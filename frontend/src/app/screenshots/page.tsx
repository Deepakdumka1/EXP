"use client";

import { Header } from "@/components/layout/header";
import { usePhotosList } from "@/hooks/use-photos";
import { PhotoGrid } from "@/components/photos/photo-grid";
import { MonitorSmartphone, Loader2 } from "lucide-react";

export default function ScreenshotsPage() {
  const { photos: screenshotPhotos, loading } = usePhotosList({ is_screenshot: true, limit: 100 });

  return (
    <>
      <Header
        title="Screenshots & Recordings"
        subtitle={`${screenshotPhotos.length} items`}
        showSort
      />
      <div className="p-4 lg:p-8">
        {loading ? (
          <div className="flex p-12 justify-center"><Loader2 className="animate-spin w-8 h-8 text-[var(--muted-foreground)]" /></div>
        ) : screenshotPhotos.length > 0 ? (
          <PhotoGrid photos={screenshotPhotos} />
        ) : (
          <div className="flex flex-col items-center justify-center min-h-[50vh]">
            <MonitorSmartphone className="w-14 h-14 text-[var(--muted-foreground)]/25 mb-4" />
            <p className="text-sm text-[var(--muted-foreground)] font-medium">No screenshots yet</p>
          </div>
        )}
      </div>
    </>
  );
}
