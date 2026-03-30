"use client";

import { Header } from "@/components/layout/header";
import dynamic from "next/dynamic";

const MapView = dynamic(() => import("@/components/map/map-view").then((m) => m.MapView), {
  ssr: false,
  loading: () => (
    <div className="flex-1 flex items-center justify-center bg-[var(--muted)]">
      <p className="text-[var(--muted-foreground)]">Loading map...</p>
    </div>
  ),
});

export default function MapPage() {
  return (
    <div className="flex flex-col h-[calc(100vh-0px)] lg:h-screen">
      <Header title="Map" showViewToggle={false} showSort={false} />
      <div className="flex-1 relative">
        <MapView />
      </div>
    </div>
  );
}
