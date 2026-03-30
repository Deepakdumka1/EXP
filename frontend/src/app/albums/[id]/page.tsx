"use client";

import { use } from "react";
import { Header } from "@/components/layout/header";
import { PhotoGrid } from "@/components/photos/photo-grid";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Share2, ImageIcon, Trash2, Loader2 } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { api } from "@/lib/api";
import { formatPhoto, formatAlbum } from "@/utils/format";
import type { Photo, Album } from "@/data/mock";

export default function AlbumDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [album, setAlbum] = useState<Album | null>(null);
  const [albumPhotos, setAlbumPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        if (id === "favorites") {
          setAlbum({ id: "favorites", title: "Favourites", coverSrc: "", photoCount: 0, isSystem: true });
          const res = await api.photos.list({ favorite: true, limit: 100 });
          setAlbumPhotos(res.items.map(formatPhoto));
        } else if (id === "videos") {
          setAlbum({ id: "videos", title: "Videos", coverSrc: "", photoCount: 0, isSystem: true });
          const res = await api.photos.list({ is_video: true, limit: 100 });
          setAlbumPhotos(res.items.map(formatPhoto));
        } else {
          const res = await api.albums.get(id);
          setAlbum(formatAlbum(res));
          setAlbumPhotos(res.photos.map(formatPhoto));
        }
      } catch (err) {
        console.error("Album load error", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [id]);

  if (loading) return <div className="flex p-12 justify-center min-h-[50vh]"><Loader2 className="animate-spin w-8 h-8 text-[var(--muted-foreground)]" /></div>;

  if (!album) {
    return (
      <>
        <Header title="Album Not Found" showViewToggle={false} showSort={false} />
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <h3 className="text-xl font-bold mb-2">Album not found</h3>
          <Link href="/albums">
            <Button variant="outline">Back to Albums</Button>
          </Link>
        </div>
      </>
    );
  }

  return (
    <>
      <Header
        title={album.title}
        subtitle={`${album.photoCount} photos`}
        showViewToggle
        showSort
        actions={
          <div className="flex items-center gap-1">
            <Link href="/albums">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </Link>
            <Button variant="ghost" size="icon">
              <Share2 className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="icon">
              <ImageIcon className="w-4 h-4" />
            </Button>
            {!album.isSystem && (
              <Button variant="ghost" size="icon">
                <Trash2 className="w-4 h-4 text-[var(--color-error)]" />
              </Button>
            )}
          </div>
        }
      />
      <div className="p-4 lg:p-8">
        {albumPhotos.length > 0 ? (
          <PhotoGrid photos={albumPhotos} />
        ) : (
          <div className="flex flex-col items-center justify-center min-h-[40vh]">
            <ImageIcon className="w-14 h-14 text-[var(--muted-foreground)]/25 mb-3" />
            <p className="text-sm text-[var(--muted-foreground)] mb-4">No photos in this album yet</p>
            <Button size="sm">Add Photos</Button>
          </div>
        )}
      </div>
    </>
  );
}
