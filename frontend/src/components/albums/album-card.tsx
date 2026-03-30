"use client";

import Image from "next/image";
import Link from "next/link";
import { ImageIcon } from "lucide-react";
import type { Album } from "@/data/mock";

interface AlbumCardProps {
  album: Album;
  index?: number;
}

export function AlbumCard({ album, index = 0 }: AlbumCardProps) {
  return (
    <Link
      href={`/albums/${album.id}`}
      className="group block rounded-xl overflow-hidden bg-[var(--card)] border border-[var(--border)] hover:shadow-lg transition-all duration-200 cursor-pointer"
      style={{ animationDelay: `${index * 30}ms` }}
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <Image
          src={album.coverSrc}
          alt={album.title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
        <div className="absolute bottom-2.5 left-2.5 flex items-center gap-1.5 bg-black/50 rounded-md px-2 py-1">
          <ImageIcon className="w-3.5 h-3.5 text-white/80" />
          <span className="text-xs text-white font-medium">{album.photoCount}</span>
        </div>
      </div>
      <div className="p-3.5">
        <h4 className="text-sm font-semibold truncate group-hover:text-[var(--accent)] transition-colors">{album.title}</h4>
        <p className="text-xs text-[var(--muted-foreground)] mt-0.5">{album.photoCount} photos</p>
      </div>
    </Link>
  );
}
