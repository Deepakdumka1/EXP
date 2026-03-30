"use client";

import { useState, useEffect } from "react";
import { Camera, Heart, MapPin, Film } from "lucide-react";
import Link from "next/link";
import { api } from "@/lib/api";

export function WelcomeHero() {
  const [greeting, setGreeting] = useState("Welcome back");
  const [totalPhotos, setTotalPhotos] = useState(0);
  const [favorites, setFavorites] = useState(0);
  const [locations, setLocations] = useState(0);
  const [videos, setVideos] = useState(0);

  useEffect(() => {
    const hour = new Date().getHours();
    setGreeting(hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening");
  }, []);

  useEffect(() => {
    api.photos.list({ limit: 1 }).then((res) => setTotalPhotos(res.total)).catch(() => {});
    api.photos.list({ limit: 1, favorite: true }).then((res) => setFavorites(res.total)).catch(() => {});
    api.photos.list({ limit: 1, is_video: true }).then((res) => setVideos(res.total)).catch(() => {});
    api.map.clusters({ lat1: -90, lng1: -180, lat2: 90, lng2: 180, zoom: 2 })
      .then((clusters) => setLocations(clusters.length))
      .catch(() => {});
  }, []);

  const stats = [
    { icon: Camera, label: "Photos", value: totalPhotos, color: "text-[var(--accent)]", href: "/" },
    { icon: Heart, label: "Favorites", value: favorites, color: "text-[var(--color-rose)]", href: "/favorites" },
    { icon: MapPin, label: "Places", value: locations, color: "text-[var(--color-teal)]", href: "/places" },
    { icon: Film, label: "Videos", value: videos, color: "text-[var(--color-royal)]", href: "/videos" },
  ];

  return (
    <div className="mb-6 p-5 rounded-xl bg-[var(--muted)] border border-[var(--border)]">
      <h2 className="text-lg font-bold mb-1">{greeting}</h2>
      <p className="text-sm text-[var(--muted-foreground)] mb-4">Your library at a glance</p>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {stats.map(({ icon: Icon, label, value, color, href }) => (
          <Link
            key={label}
            href={href}
            className="flex items-center gap-3 p-3 rounded-lg bg-[var(--background)] border border-[var(--border)] hover:border-[var(--accent)]/30 hover:shadow-md transition-all duration-200 cursor-pointer group"
          >
            <div className={`w-9 h-9 rounded-lg bg-[var(--muted)] flex items-center justify-center ${color} group-hover:scale-110 transition-transform duration-200`}>
              <Icon className="w-4 h-4" />
            </div>
            <div>
              <p className="text-lg font-bold leading-tight">{value}</p>
              <p className="text-[11px] text-[var(--muted-foreground)]">{label}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
