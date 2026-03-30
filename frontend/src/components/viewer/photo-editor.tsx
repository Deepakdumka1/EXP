"use client";

import { useState } from "react";
import Image from "next/image";
import { X, RotateCcw, Sun, Contrast, Droplets, Thermometer, Crop, FlipHorizontal, RotateCw } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";
import type { Photo } from "@/data/mock";

interface PhotoEditorProps {
  photo: Photo;
  onClose: () => void;
}

const filters = [
  { name: "Original", value: "none" },
  { name: "Vivid", value: "saturate(1.4) contrast(1.1)" },
  { name: "Warm", value: "sepia(0.2) saturate(1.3)" },
  { name: "Cool", value: "hue-rotate(15deg) saturate(0.9)" },
  { name: "B&W", value: "grayscale(1)" },
  { name: "Vintage", value: "sepia(0.4) contrast(0.9) brightness(1.1)" },
  { name: "Drama", value: "contrast(1.3) saturate(0.8)" },
  { name: "Fade", value: "contrast(0.85) brightness(1.1) saturate(0.8)" },
];

export function PhotoEditor({ photo, onClose }: PhotoEditorProps) {
  const [brightness, setBrightness] = useState(100);
  const [contrast, setContrast] = useState(100);
  const [saturation, setSaturation] = useState(100);
  const [warmth, setWarmth] = useState(0);
  const [selectedFilter, setSelectedFilter] = useState("none");
  const [rotation, setRotation] = useState(0);
  const [flipH, setFlipH] = useState(false);
  const { addToast } = useToast();

  const adjustmentStyle = selectedFilter !== "none"
    ? { filter: selectedFilter, transform: `rotate(${rotation}deg) scaleX(${flipH ? -1 : 1})` }
    : {
        filter: `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturation}%) hue-rotate(${warmth}deg)`,
        transform: `rotate(${rotation}deg) scaleX(${flipH ? -1 : 1})`,
      };

  const resetAll = () => {
    setBrightness(100);
    setContrast(100);
    setSaturation(100);
    setWarmth(0);
    setSelectedFilter("none");
    setRotation(0);
    setFlipH(false);
  };

  const sliders = [
    { icon: Sun, label: "Brightness", value: brightness, set: setBrightness, min: 0, max: 200 },
    { icon: Contrast, label: "Contrast", value: contrast, set: setContrast, min: 0, max: 200 },
    { icon: Droplets, label: "Saturation", value: saturation, set: setSaturation, min: 0, max: 200 },
    { icon: Thermometer, label: "Warmth", value: warmth, set: setWarmth, min: -30, max: 30 },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/95 flex flex-col animate-[fadeIn_200ms_ease-out]">
      <div className="flex items-center justify-between h-14 px-4 border-b border-white/10">
        <div className="flex items-center gap-3">
          <button onClick={onClose} className="p-2 rounded-full hover:bg-white/10 cursor-pointer transition-colors">
            <X className="w-5 h-5 text-white" />
          </button>
          <span className="text-sm text-white font-medium">Edit photo</span>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={resetAll} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm text-white/70 hover:text-white hover:bg-white/10 transition-colors cursor-pointer">
            <RotateCcw className="w-3.5 h-3.5" />
            Reset
          </button>
          <Button
            size="sm"
            onClick={() => { addToast("success", "Changes saved"); onClose(); }}
          >
            Save
          </Button>
        </div>
      </div>

      <div className="flex-1 flex">
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="relative max-h-[70vh] max-w-[70vw] overflow-hidden rounded-lg" style={adjustmentStyle}>
            <Image
              src={photo.src}
              alt={photo.title}
              width={photo.width}
              height={photo.height}
              className="max-h-[70vh] max-w-[70vw] object-contain w-auto h-auto"
              priority
            />
          </div>
        </div>

        <div className="w-72 border-l border-white/10 overflow-y-auto p-4 space-y-6">
          <div>
            <h4 className="text-xs font-semibold text-white/50 uppercase tracking-wider mb-3">Transform</h4>
            <div className="flex gap-2">
              <button
                onClick={() => setRotation((r) => r - 90)}
                className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-white text-xs transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" /> Rotate L
              </button>
              <button
                onClick={() => setRotation((r) => r + 90)}
                className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-white text-xs transition-colors cursor-pointer"
              >
                <RotateCw className="w-3.5 h-3.5" /> Rotate R
              </button>
              <button
                onClick={() => setFlipH((f) => !f)}
                className={cn(
                  "flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-white text-xs transition-colors cursor-pointer",
                  flipH ? "bg-[var(--accent)]/30" : "bg-white/5 hover:bg-white/10"
                )}
              >
                <FlipHorizontal className="w-3.5 h-3.5" /> Flip
              </button>
            </div>
          </div>

          <div>
            <h4 className="text-xs font-semibold text-white/50 uppercase tracking-wider mb-3">Filters</h4>
            <div className="grid grid-cols-4 gap-2">
              {filters.map((f) => (
                <button
                  key={f.name}
                  onClick={() => setSelectedFilter(f.value)}
                  className="flex flex-col items-center gap-1 cursor-pointer group"
                >
                  <div className={cn(
                    "w-full aspect-square rounded-lg overflow-hidden border-2 transition-colors",
                    selectedFilter === f.value ? "border-[var(--accent)]" : "border-transparent"
                  )}>
                    <Image
                      src={photo.thumbnail}
                      alt={f.name}
                      width={60}
                      height={60}
                      className="w-full h-full object-cover"
                      style={{ filter: f.value === "none" ? undefined : f.value }}
                    />
                  </div>
                  <span className={cn(
                    "text-[10px]",
                    selectedFilter === f.value ? "text-[var(--accent)] font-medium" : "text-white/60"
                  )}>
                    {f.name}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-xs font-semibold text-white/50 uppercase tracking-wider mb-3">Adjustments</h4>
            <div className="space-y-4">
              {sliders.map(({ icon: Icon, label, value, set, min, max }) => (
                <div key={label}>
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-1.5">
                      <Icon className="w-3.5 h-3.5 text-white/50" />
                      <span className="text-xs text-white/70">{label}</span>
                    </div>
                    <span className="text-xs text-white/50 font-mono">{value}</span>
                  </div>
                  <input
                    type="range"
                    min={min}
                    max={max}
                    value={value}
                    onChange={(e) => { set(Number(e.target.value)); setSelectedFilter("none"); }}
                    className="w-full h-1 bg-white/10 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:shadow-md"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
