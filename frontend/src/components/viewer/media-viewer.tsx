"use client";

import { useEffect, useCallback, useState } from "react";
import Image from "next/image";
import {
  X,
  ChevronLeft,
  ChevronRight,
  Heart,
  Share2,
  Download,
  Info,
  MoreHorizontal,
  ZoomIn,
  ZoomOut,
  MapPin,
  Camera as CameraIcon,
  Calendar,
  FileText,
  Maximize2,
  Tag,
  Copy,
  Trash2,
  ExternalLink,
  Pencil,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/components/ui/toast";
import { PhotoEditor } from "./photo-editor";
import type { Photo } from "@/data/mock";

interface MediaViewerProps {
  photos: Photo[];
  currentIndex: number;
  onClose: () => void;
  onNavigate: (index: number) => void;
}

export function MediaViewer({ photos, currentIndex, onClose, onNavigate }: MediaViewerProps) {
  const [showInfo, setShowInfo] = useState(false);
  const [showEditor, setShowEditor] = useState(false);
  const [zoom, setZoom] = useState(100);
  const [isFavorited, setIsFavorited] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const { addToast } = useToast();
  const photo = photos[currentIndex];

  useEffect(() => {
    if (photo) setIsFavorited(photo.isFavorite);
  }, [photo]);

  const goPrev = useCallback(() => {
    if (currentIndex > 0) onNavigate(currentIndex - 1);
  }, [currentIndex, onNavigate]);

  const goNext = useCallback(() => {
    if (currentIndex < photos.length - 1) onNavigate(currentIndex + 1);
  }, [currentIndex, photos.length, onNavigate]);

  const handleFavorite = useCallback(() => {
    setIsFavorited((prev) => {
      const next = !prev;
      addToast(next ? "success" : "info", next ? "Added to favorites" : "Removed from favorites");
      return next;
    });
  }, [addToast]);

  const handleShare = useCallback(() => {
    if (navigator.share) {
      navigator.share({ title: photo.title, url: photo.src }).catch(() => {});
    } else {
      navigator.clipboard.writeText(photo.src);
      addToast("success", "Link copied to clipboard");
    }
  }, [photo, addToast]);

  const handleDownload = useCallback(() => {
    const link = document.createElement("a");
    link.href = photo.src;
    link.download = photo.title;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    addToast("success", `Downloading ${photo.title}`);
  }, [photo, addToast]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      switch (e.key) {
        case "Escape": onClose(); break;
        case "ArrowLeft": goPrev(); break;
        case "ArrowRight": goNext(); break;
        case "i": setShowInfo((s) => !s); break;
        case "f": handleFavorite(); break;
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose, goPrev, goNext, handleFavorite]);

  if (!photo) return null;

  const toolbarButtons = [
    {
      icon: Heart,
      label: "Favorite",
      active: isFavorited,
      action: handleFavorite,
      className: isFavorited ? "text-red-500" : "text-white",
      fill: isFavorited,
    },
    { icon: Pencil, label: "Edit", action: () => setShowEditor(true) },
    { icon: Share2, label: "Share", action: handleShare },
    { icon: Download, label: "Download", action: handleDownload },
    { icon: Info, label: "Info", active: showInfo, action: () => setShowInfo(!showInfo) },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/95 flex flex-col animate-[fadeIn_200ms_ease-out]">
      <div className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between h-14 px-4 bg-gradient-to-b from-black/60 to-transparent">
        <button onClick={onClose} className="p-2 rounded-full hover:bg-white/10 transition-colors duration-200 cursor-pointer">
          <X className="w-5 h-5 text-white" />
        </button>
        <div className="flex items-center gap-1">
          {toolbarButtons.map(({ icon: Icon, label, active, action, className: btnClass, fill }) => (
            <button
              key={label}
              onClick={action}
              title={label}
              className={cn(
                "p-2 rounded-full hover:bg-white/10 transition-colors duration-200 cursor-pointer",
                active && "bg-white/10"
              )}
            >
              <Icon className={cn("w-5 h-5", btnClass || "text-white", fill && "fill-current")} />
            </button>
          ))}

          <div className="relative">
            <button
              onClick={() => setMoreOpen(!moreOpen)}
              className={cn("p-2 rounded-full hover:bg-white/10 transition-colors duration-200 cursor-pointer", moreOpen && "bg-white/10")}
            >
              <MoreHorizontal className="w-5 h-5 text-white" />
            </button>
            {moreOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-[var(--card-solid)] border border-[var(--border)] rounded-xl shadow-xl z-50 p-1 animate-[scaleIn_200ms_ease-out]">
                <button
                  onClick={() => { navigator.clipboard.writeText(photo.src); addToast("success", "Image URL copied"); setMoreOpen(false); }}
                  className="flex items-center gap-2.5 w-full px-3 py-2 text-sm hover:bg-[var(--hover)] rounded-lg transition-colors cursor-pointer"
                >
                  <Copy className="w-4 h-4 text-[var(--muted-foreground)]" />
                  Copy Link
                </button>
                <button
                  onClick={() => { window.open(photo.src, "_blank"); setMoreOpen(false); }}
                  className="flex items-center gap-2.5 w-full px-3 py-2 text-sm hover:bg-[var(--hover)] rounded-lg transition-colors cursor-pointer"
                >
                  <ExternalLink className="w-4 h-4 text-[var(--muted-foreground)]" />
                  Open Original
                </button>
                <div className="border-t border-[var(--border)] my-1" />
                <button
                  onClick={() => { addToast("info", "Photo moved to trash"); setMoreOpen(false); onClose(); }}
                  className="flex items-center gap-2.5 w-full px-3 py-2 text-sm text-red-600 hover:bg-red-500/5 rounded-lg transition-colors cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                  Move to Bin
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center overflow-hidden" onClick={() => setMoreOpen(false)}>
        <div
          className="relative transition-transform duration-300 ease-out"
          style={{ transform: `scale(${zoom / 100})` }}
        >
          <Image
            src={photo.src}
            alt={photo.title}
            width={photo.width}
            height={photo.height}
            className="max-h-[85vh] max-w-[85vw] object-contain w-auto h-auto rounded-lg"
            priority
          />
        </div>
      </div>

      {currentIndex > 0 && (
        <button
          onClick={goPrev}
          className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors duration-200 cursor-pointer"
        >
          <ChevronLeft className="w-5 h-5 text-white" />
        </button>
      )}
      {currentIndex < photos.length - 1 && (
        <button
          onClick={goNext}
          className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors duration-200 cursor-pointer"
        >
          <ChevronRight className="w-5 h-5 text-white" />
        </button>
      )}

      <div className="absolute bottom-0 left-0 right-0 z-10 flex flex-col items-center pb-5 bg-gradient-to-t from-black/60 to-transparent pt-10">
        <div className="flex items-center gap-3 mb-2 bg-white/10 rounded-full px-4 py-2">
          <button onClick={() => setZoom((z) => Math.max(50, z - 25))} className="p-1 rounded-full hover:bg-white/10 cursor-pointer transition-colors">
            <ZoomOut className="w-4 h-4 text-white" />
          </button>
          <span className="text-sm text-white font-mono w-12 text-center font-medium">{zoom}%</span>
          <button onClick={() => setZoom((z) => Math.min(200, z + 25))} className="p-1 rounded-full hover:bg-white/10 cursor-pointer transition-colors">
            <ZoomIn className="w-4 h-4 text-white" />
          </button>
        </div>
        <span className="text-xs text-white/40 font-medium">
          {currentIndex + 1} / {photos.length}
        </span>
      </div>

      <div
        className={cn(
          "absolute top-0 right-0 h-full w-80 bg-[var(--card-solid)] border-l border-[var(--border)] transform transition-transform duration-300 ease-out overflow-y-auto",
          showInfo ? "translate-x-0" : "translate-x-full"
        )}
      >
        <div className="p-6 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold">Details</h3>
            <button onClick={() => setShowInfo(false)} className="p-1.5 rounded-lg hover:bg-[var(--hover)] cursor-pointer transition-colors">
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-4">
            <InfoRow icon={FileText} label="Filename" value={photo.title} />
            <InfoRow icon={Calendar} label="Date" value={new Date(photo.date).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })} />
            <InfoRow icon={Maximize2} label="Dimensions" value={`${photo.width} × ${photo.height}`} />
            <InfoRow icon={FileText} label="Size" value={photo.size} />
            {photo.location && <InfoRow icon={MapPin} label="Location" value={photo.location} />}
            {photo.camera && <InfoRow icon={CameraIcon} label="Camera" value={photo.camera} />}
            {photo.tags && photo.tags.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-[var(--muted-foreground)]">
                  <Tag className="w-4 h-4" />
                  <span className="text-xs font-medium uppercase tracking-wider">Tags</span>
                </div>
                <div className="flex flex-wrap gap-1.5 pl-6">
                  {photo.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-xs px-2.5 py-1 rounded-full bg-[var(--muted)] text-[var(--muted-foreground)] font-medium"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {showEditor && (
        <PhotoEditor photo={photo} onClose={() => setShowEditor(false)} />
      )}
    </div>
  );
}

function InfoRow({ icon: Icon, label, value }: { icon: React.ComponentType<{ className?: string }>; label: string; value: string }) {
  return (
    <div className="space-y-1">
      <div className="flex items-center gap-2 text-[var(--muted-foreground)]">
        <Icon className="w-4 h-4" />
        <span className="text-xs font-medium uppercase tracking-wider">{label}</span>
      </div>
      <p className="text-sm pl-6 font-medium">{value}</p>
    </div>
  );
}
