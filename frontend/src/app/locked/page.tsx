"use client";

import { Header } from "@/components/layout/header";
import { Button } from "@/components/ui/button";
import { Lock, ShieldCheck, Fingerprint, Loader2 } from "lucide-react";
import { useState } from "react";
import { usePhotosList } from "@/hooks/use-photos";
import { PhotoGrid } from "@/components/photos/photo-grid";

export default function LockedPage() {
  const [unlocked, setUnlocked] = useState(false);
  const { photos: lockedPhotos, loading } = usePhotosList({ locked: true, limit: 100 });

  return (
    <>
      <Header title="Locked Folder" showViewToggle={false} showSort={false} />
      <div className="p-4 lg:p-8 max-w-3xl mx-auto">
        {!unlocked ? (
          <div className="flex flex-col items-center justify-center min-h-[60vh]">
            <div className="relative w-28 h-28 rounded-xl bg-[var(--muted)] border border-[var(--border)] flex items-center justify-center mb-6 animate-float">
              <Lock className="w-14 h-14 text-[var(--muted-foreground)]" />
              <div className="absolute -bottom-2 -right-2 w-10 h-10 rounded-full bg-[var(--color-teal)]/10 flex items-center justify-center border-2 border-[var(--surface)]">
                <ShieldCheck className="w-5 h-5 text-[var(--color-teal)]" />
              </div>
            </div>
            <h3 className="text-2xl font-bold mb-2">Locked Folder</h3>
            <p className="text-sm text-[var(--muted-foreground)] max-w-sm text-center font-medium mb-2">
              Items in your Locked Folder are hidden and can only be accessed with your device credentials
            </p>
            <p className="text-xs text-[var(--muted-foreground)] max-w-sm text-center mb-8">
              {lockedPhotos.length} items
            </p>
            <Button onClick={() => setUnlocked(true)}>
              <Fingerprint className="w-4 h-4" />
              Unlock
            </Button>
          </div>
        ) : (
          <>
            <div className="flex items-center gap-2.5 mb-6 text-sm text-[var(--muted-foreground)] bg-[var(--color-teal)]/5 px-4 py-3 rounded-lg border border-[var(--color-teal)]/20 font-medium">
              <ShieldCheck className="w-4 h-4 shrink-0 text-[var(--color-teal)]" />
              Locked Folder is unlocked. Items here won't appear in your library.
            </div>
            {loading ? (
              <div className="flex p-12 justify-center"><Loader2 className="animate-spin w-8 h-8 text-[var(--muted-foreground)]" /></div>
            ) : lockedPhotos.length > 0 ? (
              <PhotoGrid photos={lockedPhotos} />
            ) : (
              <div className="text-center py-12 text-[var(--muted-foreground)]">Empty locked folder</div>
            )}
          </>
        )}
      </div>
    </>
  );
}
