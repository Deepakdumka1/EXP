import { PhotoResponse } from "@/lib/api";
import type { Photo } from "@/data/mock";

export function getAssetUrl(url: string | null | undefined): string {
    if (!url) return "";
    if (url.startsWith("http")) return url;
    return `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}${url}`;
}

export function formatPhoto(p: PhotoResponse): Photo {
  return {
    id: p.id,
    src: getAssetUrl(p.src),
    thumbnail: getAssetUrl(p.thumbnail),
    width: p.width || 800,
    height: p.height || 600,
    title: p.title,
    date: p.date ? p.date.split("T")[0] : "",
    size: `${(p.size / 1024 / 1024).toFixed(1)} MB`,
    location: p.location || undefined,
    camera: p.camera || undefined,
    isFavorite: p.is_favorite,
    isVideo: p.is_video,
    isDocument: p.is_document,
    isScreenshot: p.is_screenshot,
    duration: p.duration || undefined,
    lat: p.lat || undefined,
    lng: p.lng || undefined,
    tags: p.tags || [],
    person: p.person_id || undefined,
  };
}

export function formatAlbum(a: any) {
  return {
    id: a.id,
    title: a.title,
    coverSrc: getAssetUrl(a.cover_src),
    photoCount: a.photo_count || 0,
    isSystem: a.is_system || false,
  }
}
