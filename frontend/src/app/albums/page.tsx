"use client";

import { Header } from "@/components/layout/header";
import { AlbumCard } from "@/components/albums/album-card";
import { Button } from "@/components/ui/button";
import { Plus, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { api } from "@/lib/api";
import { formatAlbum } from "@/utils/format";
import type { Album } from "@/data/mock";

export default function AlbumsPage() {
  const [albums, setAlbums] = useState<Album[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.albums.list().then(res => {
      setAlbums(res.map(formatAlbum));
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const systemAlbums = albums.filter((a) => a.isSystem);
  const userAlbums = albums.filter((a) => !a.isSystem);

  if (loading) return <div className="flex p-12 justify-center"><Loader2 className="animate-spin w-8 h-8 text-[var(--muted-foreground)]" /></div>;

  return (
    <>
      <Header
        title="Albums"
        showViewToggle={false}
        showSort={false}
        actions={
          <Button size="sm">
            <Plus className="w-4 h-4" />
            New Album
          </Button>
        }
      />
      <div className="p-4 lg:p-8 space-y-10">
        <section>
          <h2 className="text-sm font-semibold text-[var(--muted-foreground)] uppercase tracking-wider mb-4">System Albums</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {systemAlbums.map((album, i) => (
              <AlbumCard key={album.id} album={album} index={i} />
            ))}
          </div>
        </section>

        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-[var(--muted-foreground)] uppercase tracking-wider">My Albums</h2>
            <span className="text-xs text-[var(--muted-foreground)]">{userAlbums.length} albums</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {userAlbums.map((album, i) => (
              <AlbumCard key={album.id} album={album} index={i} />
            ))}
          </div>
        </section>
      </div>
    </>
  );
}
