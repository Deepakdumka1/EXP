"use client";

import { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import { api, type PhotoResponse, type MapCluster } from "@/lib/api";
import { MediaViewer } from "@/components/viewer/media-viewer";
import Image from "next/image";
import { MapPin } from "lucide-react";
import "leaflet/dist/leaflet.css";

const defaultIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

L.Marker.prototype.options.icon = defaultIcon;

interface LocationGroup {
  lat: number;
  lng: number;
  count: number;
  photo_ids: string[];
}

export function MapView() {
  const [clusters, setClusters] = useState<LocationGroup[]>([]);
  const [selectedCluster, setSelectedCluster] = useState<LocationGroup | null>(null);
  const [clusterPhotos, setClusterPhotos] = useState<PhotoResponse[]>([]);
  const [viewerPhoto, setViewerPhoto] = useState<PhotoResponse | null>(null);
  const [viewerIndex, setViewerIndex] = useState(0);

  useEffect(() => {
    api.map.clusters({ lat1: -90, lng1: -180, lat2: 90, lng2: 180, zoom: 2 })
      .then((data) => setClusters(data))
      .catch(() => {});
  }, []);

  const handleClusterClick = (cluster: LocationGroup) => {
    setSelectedCluster(cluster);
    api.map.photos({ lat1: cluster.lat - 0.5, lng1: cluster.lng - 0.5, lat2: cluster.lat + 0.5, lng2: cluster.lng + 0.5 })
      .then(setClusterPhotos)
      .catch(() => setClusterPhotos([]));
  };

  const openViewer = (photo: PhotoResponse) => {
    const idx = clusterPhotos.findIndex((p) => p.id === photo.id);
    setViewerIndex(idx >= 0 ? idx : 0);
    setViewerPhoto(photo);
  };

  const viewerPhotos = clusterPhotos.map((p) => ({
    id: p.id,
    src: p.src,
    thumbnail: p.thumbnail,
    width: p.width,
    height: p.height,
    title: p.title,
    date: p.date,
    size: String(p.size),
    isFavorite: p.is_favorite,
    isVideo: p.is_video,
    duration: p.duration || undefined,
    location: p.location || undefined,
    camera: p.camera || undefined,
    tags: p.tags,
  }));

  if (clusters.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center p-8">
        <MapPin className="w-12 h-12 text-[var(--muted-foreground)] mb-4" />
        <h3 className="text-lg font-semibold mb-1">No locations yet</h3>
        <p className="text-sm text-[var(--muted-foreground)]">
          Upload photos with GPS data to see them on the map
        </p>
      </div>
    );
  }

  return (
    <div className="flex h-full">
      <div className="flex-1">
        <MapContainer
          center={[30, 10]}
          zoom={2}
          className="w-full h-full"
          scrollWheelZoom
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {clusters.map((cluster, i) => (
            <Marker
              key={`${cluster.lat}-${cluster.lng}-${i}`}
              position={[cluster.lat, cluster.lng]}
              eventHandlers={{
                click: () => handleClusterClick(cluster),
              }}
            >
              <Popup>
                <div className="text-center min-w-[120px]">
                  <p className="font-semibold text-sm">{cluster.count} photo{cluster.count !== 1 ? "s" : ""}</p>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>

      {selectedCluster && clusterPhotos.length > 0 && (
        <div className="hidden md:flex flex-col w-[360px] border-l border-[var(--border)] bg-[var(--card)] overflow-y-auto">
          <div className="p-4 border-b border-[var(--border)]">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">{clusterPhotos[0]?.location || "Location"}</h3>
              <button
                onClick={() => { setSelectedCluster(null); setClusterPhotos([]); }}
                className="text-sm text-[var(--muted-foreground)] hover:text-[var(--foreground)] cursor-pointer"
              >
                Close
              </button>
            </div>
            <p className="text-sm text-[var(--muted-foreground)]">
              {clusterPhotos.length} photo{clusterPhotos.length !== 1 ? "s" : ""}
            </p>
          </div>
          <div className="p-2 grid grid-cols-3 gap-1">
            {clusterPhotos.map((photo) => (
              <div
                key={photo.id}
                className="relative aspect-square rounded overflow-hidden cursor-pointer group"
                onClick={() => openViewer(photo)}
              >
                <Image
                  src={photo.thumbnail}
                  alt={photo.title}
                  fill
                  sizes="120px"
                  className="object-cover group-hover:scale-105 transition-transform"
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {viewerPhoto && (
        <MediaViewer
          photos={viewerPhotos}
          currentIndex={viewerIndex}
          onClose={() => setViewerPhoto(null)}
          onNavigate={(idx) => {
            setViewerIndex(idx);
            setViewerPhoto(clusterPhotos[idx]);
          }}
        />
      )}
    </div>
  );
}
