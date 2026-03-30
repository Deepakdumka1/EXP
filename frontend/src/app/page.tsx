"use client";

import { useState, useEffect } from "react";
import { Header } from "@/components/layout/header";
import { PhotoGrid } from "@/components/photos/photo-grid";
import { MemoriesCarousel } from "@/components/photos/memories-carousel";
import { WelcomeHero } from "@/components/photos/welcome-hero";
import type { Photo } from "@/data/mock";
import { Camera, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { api, type PhotoResponse } from "@/lib/api";
import { useAuth } from "@/components/auth/auth-provider";

function formatPhoto(p: PhotoResponse): Photo {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
  return {
    id: p.id,
    src: p.src?.startsWith("http") ? p.src : `${baseUrl}${p.src}`,
    thumbnail: p.thumbnail?.startsWith("http") ? p.thumbnail : `${baseUrl}${p.thumbnail}`,
    width: p.width || 800,
    height: p.height || 600,
    title: p.title,
    date: p.date ? p.date.split("T")[0] : "",
    size: `${(p.size / 1024 / 1024).toFixed(1)} MB`,
    location: p.location || undefined,
    camera: p.camera || undefined,
    isFavorite: p.is_favorite,
    isVideo: p.is_video,
    duration: p.duration || undefined,
    lat: p.lat || undefined,
    lng: p.lng || undefined,
    tags: p.tags || [],
    person: p.person_id || undefined,
  };
}

export default function PhotosPage() {
  const { isAuthenticated } = useAuth();
  const [groups, setGroups] = useState<{ month: string; photos: Photo[] }[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  useEffect(() => {
    if (!isAuthenticated) return;
    async function loadData() {
      try {
        const data = await api.photos.byMonth();
        const formattedGroups = data.map((g) => ({
          month: g.month,
          photos: g.photos.map(formatPhoto)
        }));
        setGroups(formattedGroups);
      } catch (err) {
        console.error("Failed to load photos", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [isAuthenticated]);

  if (loading) {
    return (
      <>
        <Header title="Photos" />
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <Loader2 className="w-10 h-10 animate-spin text-[var(--muted-foreground)]" />
        </div>
      </>
    );
  }

  if (groups.length === 0) {
    return (
      <>
        <Header title="Photos" />
        <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
          <Camera className="w-16 h-16 text-[var(--muted-foreground)]/30 mb-4" />
          <h3 className="text-lg font-semibold mb-2">No photos yet</h3>
          <p className="text-[var(--muted-foreground)] mb-6 text-center max-w-sm text-sm">
            Get started by uploading some photos
          </p>
          <Link href="/upload">
            <Button>Upload Photos</Button>
          </Link>
        </div>
      </>
    );
  }

  return (
    <>
      <Header
        title="Photos"
        subtitle={`${groups.reduce((sum, g) => sum + g.photos.length, 0)} photos`}
        onViewModeChange={(mode) => setViewMode(mode)}
      />
      <div className="p-4 lg:p-8 space-y-2">
        <WelcomeHero />
        <MemoriesCarousel />
        {groups.map((group) => (
          <PhotoGrid
            key={group.month}
            photos={group.photos}
            groupTitle={group.month}
            viewMode={viewMode}
          />
        ))}
      </div>
    </>
  );
}
