"use client";

import { Header } from "@/components/layout/header";
import { usePhotosList } from "@/hooks/use-photos";
import { PhotoGrid } from "@/components/photos/photo-grid";
import { FileText, Loader2 } from "lucide-react";

export default function DocumentsPage() {
  const { photos: docPhotos, loading } = usePhotosList({ is_document: true, limit: 100 });

  return (
    <>
      <Header
        title="Documents"
        subtitle={`${docPhotos.length} items`}
        showSort
      />
      <div className="p-4 lg:p-8">
        {loading ? (
          <div className="flex p-12 justify-center"><Loader2 className="animate-spin w-8 h-8 text-[var(--muted-foreground)]" /></div>
        ) : docPhotos.length > 0 ? (
          <PhotoGrid photos={docPhotos} />
        ) : (
          <div className="flex flex-col items-center justify-center min-h-[60vh]">
            <FileText className="w-16 h-16 text-[var(--muted-foreground)]/30 mb-4" />
            <h3 className="text-lg font-semibold mb-1">Nothing here yet</h3>
            <p className="text-sm text-[var(--muted-foreground)] text-center">
              Receipts, notes and scanned docs show up here
            </p>
          </div>
        )}
      </div>
    </>
  );
}
