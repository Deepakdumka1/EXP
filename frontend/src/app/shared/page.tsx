"use client";

import { Header } from "@/components/layout/header";
import { Button } from "@/components/ui/button";
import { Plus, Users, Lock, Globe } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const sharedAlbums = [
  {
    id: "s1",
    title: "Goa Trip Dec 2024",
    cover: "https://picsum.photos/id/11/600/450",
    members: [
      { name: "Priya", avatar: "https://i.pravatar.cc/64?img=1" },
      { name: "Arjun", avatar: "https://i.pravatar.cc/64?img=3" },
      { name: "Sneha", avatar: "https://i.pravatar.cc/64?img=9" },
    ],
    photoCount: 47,
    lastActivity: "2 hours ago",
    visibility: "shared" as const,
  },
  {
    id: "s2",
    title: "Diwali @ Home",
    cover: "https://picsum.photos/id/22/600/450",
    members: [
      { name: "Rahul", avatar: "https://i.pravatar.cc/64?img=12" },
      { name: "Ananya", avatar: "https://i.pravatar.cc/64?img=16" },
    ],
    photoCount: 32,
    lastActivity: "1 day ago",
    visibility: "shared" as const,
  },
  {
    id: "s3",
    title: "Office Outing",
    cover: "https://picsum.photos/id/36/600/450",
    members: [
      { name: "Vikram", avatar: "https://i.pravatar.cc/64?img=68" },
      { name: "Neha", avatar: "https://i.pravatar.cc/64?img=25" },
      { name: "Rohan", avatar: "https://i.pravatar.cc/64?img=33" },
      { name: "Kavya", avatar: "https://i.pravatar.cc/64?img=5" },
    ],
    photoCount: 89,
    lastActivity: "3 days ago",
    visibility: "link" as const,
  },
];

export default function SharedPage() {
  return (
    <>
      <Header
        title="Shared albums"
        showViewToggle={false}
        showSort={false}
        actions={
          <Button size="sm">
            <Plus className="w-4 h-4" />
            New shared album
          </Button>
        }
      />
      <div className="p-4 lg:p-8 max-w-5xl mx-auto">
        {sharedAlbums.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {sharedAlbums.map((album) => (
              <Link
                key={album.id}
                href={`/albums/${album.id}`}
                className="group block rounded-xl overflow-hidden bg-[var(--card)] border border-[var(--border)] hover:shadow-lg transition-all duration-200 cursor-pointer"
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                  <Image
                    src={album.cover}
                    alt={album.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute top-3 right-3 flex items-center gap-1 bg-black/50 rounded-full px-2 py-1">
                    {album.visibility === "shared" ? (
                      <Users className="w-3 h-3 text-white" />
                    ) : album.visibility === "link" ? (
                      <Globe className="w-3 h-3 text-white" />
                    ) : (
                      <Lock className="w-3 h-3 text-white" />
                    )}
                    <span className="text-[10px] text-white font-medium capitalize">{album.visibility}</span>
                  </div>
                </div>
                <div className="p-4">
                  <h4 className="text-sm font-semibold truncate group-hover:text-[var(--accent)] transition-colors">{album.title}</h4>
                  <p className="text-xs text-[var(--muted-foreground)] mt-0.5">{album.photoCount} photos &middot; {album.lastActivity}</p>
                  <div className="flex items-center mt-3">
                    <div className="flex -space-x-2">
                      {album.members.slice(0, 4).map((member, i) => (
                        <div key={i} className="w-7 h-7 rounded-full overflow-hidden border-2 border-[var(--card)]">
                          <Image src={member.avatar} alt={member.name} width={28} height={28} className="w-full h-full object-cover" />
                        </div>
                      ))}
                      {album.members.length > 4 && (
                        <div className="w-7 h-7 rounded-full bg-[var(--muted)] border-2 border-[var(--card)] flex items-center justify-center">
                          <span className="text-[9px] font-bold">+{album.members.length - 4}</span>
                        </div>
                      )}
                    </div>
                    <span className="text-[11px] text-[var(--muted-foreground)] ml-2">{album.members.length} members</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center min-h-[50vh]">
            <Users className="w-14 h-14 text-[var(--muted-foreground)]/25 mb-3" />
            <h3 className="text-base font-semibold mb-1">No shared albums</h3>
            <p className="text-sm text-[var(--muted-foreground)] mb-4">
              Share an album with friends or family
            </p>
            <Button size="sm">Create Shared Album</Button>
          </div>
        )}
      </div>
    </>
  );
}
