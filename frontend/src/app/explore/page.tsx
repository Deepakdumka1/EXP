"use client";

import { Header } from "@/components/layout/header";
import Image from "next/image";
import { useState, useEffect } from "react";
import { PhotoGrid } from "@/components/photos/photo-grid";
import { ChevronRight, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { api } from "@/lib/api";
import { formatPhoto } from "@/utils/format";
import type { Photo } from "@/data/mock";

interface Category {
  id: string; title: string; icon: string; photos: Photo[];
}

export default function ExplorePage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);

  useEffect(() => {
    async function loadExploreData() {
      try {
        const res = await api.photos.list({ limit: 500 });
        const allPhotos = res.items.map(formatPhoto);
        
        const exploreCategories = [
          { id: "places", title: "Places", icon: "📍", photos: allPhotos.filter(p => p.location) },
          { id: "pets", title: "Pets", icon: "🐕", photos: allPhotos.filter(p => p.tags?.includes("pets")) },
          { id: "food", title: "Food", icon: "🍔", photos: allPhotos.filter(p => p.tags?.includes("food")) },
          { id: "trips", title: "Trips", icon: "🏖️", photos: allPhotos.filter(p => p.tags?.includes("trip") || p.tags?.includes("roadtrip")) },
          { id: "documents", title: "Documents", icon: "📄", photos: allPhotos.filter(p => p.isDocument) },
          { id: "screenshots", title: "Screenshots", icon: "📱", photos: allPhotos.filter(p => p.isScreenshot) },
        ].filter(c => c.photos.length > 0);
        
        setCategories(exploreCategories);
      } catch (err) {
        console.error("Explore load error", err);
      } finally {
        setLoading(false);
      }
    }
    loadExploreData();
  }, []);

  if (loading) return <div className="flex p-12 justify-center min-h-[50vh]"><Loader2 className="animate-spin w-8 h-8 text-[var(--muted-foreground)]" /></div>;

  return (
    <>
      <Header
        title="Explore"
        showViewToggle={false}
        showSort={false}
      />
      <div className="p-4 lg:p-8 space-y-8">
        {categories.length === 0 && (
           <p className="text-center text-[var(--muted-foreground)] py-12 border-2 border-dashed border-[var(--border)] rounded-xl mt-4 max-w-xl mx-auto">
             No explore categories detected yet! Upload photos to discover your groups.
           </p>
        )}
        {categories.map((category) => {
          const isExpanded = expandedCategory === category.id;
          return (
            <section key={category.id}>
              <button
                onClick={() =>
                  setExpandedCategory(isExpanded ? null : category.id)
                }
                className="flex items-center gap-3 mb-4 cursor-pointer group w-full text-left"
              >
                <div className="w-10 h-10 rounded-lg bg-[var(--muted)] border border-[var(--border)] flex items-center justify-center text-lg group-hover:border-[var(--accent)]/20 transition-colors duration-200">
                  {category.icon}
                </div>
                <div className="flex-1">
                  <h2 className="text-base font-bold">{category.title}</h2>
                  <p className="text-xs text-[var(--muted-foreground)]">{category.photos.length} photos</p>
                </div>
                <ChevronRight
                  className={cn(
                    "w-4 h-4 text-[var(--muted-foreground)] transition-transform duration-200",
                    isExpanded && "rotate-90"
                  )}
                />
              </button>

              {isExpanded ? (
                <div className="animate-[fadeIn_200ms_ease-out]">
                  <PhotoGrid photos={category.photos} />
                </div>
              ) : (
                <div className="flex gap-2.5 overflow-x-auto pb-2 scrollbar-thin">
                  {category.photos.slice(0, 8).map((photo) => (
                    <div
                      key={photo.id}
                      className="relative shrink-0 w-36 h-36 sm:w-44 sm:h-44 rounded-lg overflow-hidden cursor-pointer group border border-[var(--border)] hover:border-[var(--accent)]/30 transition-all duration-200"
                      onClick={() => setExpandedCategory(category.id)}
                    >
                      <Image
                        src={photo.thumbnail}
                        alt={photo.title}
                        fill
                        sizes="176px"
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    </div>
                  ))}
                  {category.photos.length > 8 && (
                    <button
                      onClick={() => setExpandedCategory(category.id)}
                      className="shrink-0 w-36 h-36 sm:w-44 sm:h-44 rounded-lg bg-[var(--muted)] flex flex-col items-center justify-center text-sm font-medium text-[var(--muted-foreground)] hover:bg-[var(--hover)] hover:text-[var(--foreground)] transition-colors duration-200 cursor-pointer border border-[var(--border)]"
                    >
                      <span className="text-2xl font-bold">+{category.photos.length - 8}</span>
                      <span className="text-xs mt-0.5">more</span>
                    </button>
                  )}
                </div>
              )}
            </section>
          );
        })}
      </div>
    </>
  );
}
