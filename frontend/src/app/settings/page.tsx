"use client";

import { useState, useEffect } from "react";
import { Header } from "@/components/layout/header";
import { ToggleSwitch } from "@/components/ui/toggle-switch";
import { ProgressBar } from "@/components/ui/progress-bar";
import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";
import { Monitor, Sun, Moon, Loader2, HardDrive, Shield, Palette } from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/components/ui/toast";
import { api, type StorageInfo } from "@/lib/api";

function StorageDisplay() {
  const [storage, setStorage] = useState<StorageInfo | null>(null);
  useEffect(() => {
    api.settings.storage().then(setStorage).catch(() => {});
  }, []);

  const used = storage?.used_formatted || "0 B";
  const limit = storage?.limit_formatted || "0 B";
  const percentage = storage?.percentage || 0;

  return (
    <div className="space-y-2.5 p-4 rounded-lg bg-[var(--muted)]">
      <div className="flex justify-between text-sm">
        <span className="text-[var(--muted-foreground)]">Used</span>
        <span className="font-semibold">{used} / {limit}</span>
      </div>
      <ProgressBar value={percentage} />
    </div>
  );
}

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const { addToast } = useToast();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const [gridDensity, setGridDensity] = useState<"comfortable" | "compact">("comfortable");
  const [faceRecognition, setFaceRecognition] = useState(true);
  const [locationData, setLocationData] = useState(true);
  const [analytics, setAnalytics] = useState(false);
  const [clearingCache, setClearingCache] = useState(false);

  const themeOptions = [
    { value: "light", label: "Light", icon: Sun },
    { value: "dark", label: "Dark", icon: Moon },
    { value: "system", label: "System", icon: Monitor },
  ];

  const handleClearCache = () => {
    setClearingCache(true);
    api.settings.clearCache().then(() => {
      addToast("success", "Cache cleared successfully");
    }).catch(() => {
      addToast("error", "Failed to clear cache");
    }).finally(() => setClearingCache(false));
  };

  return (
    <>
      <Header title="Settings" showViewToggle={false} showSort={false} />
      <div className="p-4 lg:p-8 max-w-2xl mx-auto space-y-6">
        <section className="border border-[var(--border)] rounded-xl p-5 space-y-5">
          <div className="flex items-center gap-3">
            <Palette className="w-5 h-5 text-[var(--accent)]" />
            <div>
              <h2 className="text-[15px] font-bold">Appearance</h2>
              <p className="text-xs text-[var(--muted-foreground)]">Customize how LensVault looks</p>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Theme</label>
            <div className="flex gap-2">
              {themeOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => setTheme(option.value)}
                  className={cn(
                    "flex items-center gap-2 px-4 py-2 rounded-full border text-sm transition-all duration-150 cursor-pointer",
                    mounted && theme === option.value
                      ? "border-[var(--accent)] bg-[var(--accent)]/10 text-[var(--accent)] font-medium"
                      : "border-[var(--border)] hover:bg-[var(--hover)]"
                  )}
                >
                  <option.icon className="w-4 h-4" />
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Grid Density</label>
            <div className="flex gap-2">
              {(["comfortable", "compact"] as const).map((density) => (
                <button
                  key={density}
                  onClick={() => setGridDensity(density)}
                  className={cn(
                    "px-4 py-2 rounded-full border text-sm capitalize transition-all duration-150 cursor-pointer",
                    gridDensity === density
                      ? "border-[var(--accent)] bg-[var(--accent)]/10 text-[var(--accent)] font-medium"
                      : "border-[var(--border)] hover:bg-[var(--hover)]"
                  )}
                >
                  {density}
                </button>
              ))}
            </div>
          </div>
        </section>

        <section className="border border-[var(--border)] rounded-xl p-5 space-y-4">
          <div className="flex items-center gap-3">
            <HardDrive className="w-5 h-5 text-[var(--color-electric)]" />
            <div>
              <h2 className="text-[15px] font-bold">Storage</h2>
              <p className="text-xs text-[var(--muted-foreground)]">Manage your storage usage</p>
            </div>
          </div>

          <StorageDisplay />

          <Button variant="outline" onClick={handleClearCache} disabled={clearingCache}>
            {clearingCache && <Loader2 className="w-4 h-4 animate-spin" />}
            {clearingCache ? "Clearing..." : "Clear Cache"}
          </Button>
        </section>

        <section className="border border-[var(--border)] rounded-xl p-5 space-y-4">
          <div className="flex items-center gap-3">
            <Shield className="w-5 h-5 text-green-600" />
            <div>
              <h2 className="text-[15px] font-bold">Privacy</h2>
              <p className="text-xs text-[var(--muted-foreground)]">Control your privacy settings</p>
            </div>
          </div>

          <ToggleSwitch checked={faceRecognition} onChange={setFaceRecognition} label="Face Recognition" description="Automatically detect and group faces in your photos" />
          <ToggleSwitch checked={locationData} onChange={setLocationData} label="Location Data" description="Use GPS data from photos for the Map view" />
          <ToggleSwitch checked={analytics} onChange={setAnalytics} label="Usage Analytics" description="Help improve LensVault by sharing anonymous usage data" />
        </section>

      </div>
    </>
  );
}
