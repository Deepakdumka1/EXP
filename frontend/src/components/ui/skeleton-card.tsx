export function SkeletonCard() {
  return (
    <div className="aspect-square rounded-lg overflow-hidden">
      <div className="w-full h-full skeleton" />
    </div>
  );
}

export function SkeletonGrid({ count = 12 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-1.5 sm:gap-2.5">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}

export function SkeletonAlbumCard() {
  return (
    <div className="rounded-xl overflow-hidden border border-[var(--border)]">
      <div className="aspect-[4/3] skeleton" />
      <div className="p-3.5 space-y-2">
        <div className="h-4 w-2/3 skeleton rounded" />
        <div className="h-3 w-1/3 skeleton rounded" />
      </div>
    </div>
  );
}

export function SkeletonMemory() {
  return (
    <div className="flex gap-4 overflow-hidden pb-2">
      {Array.from({ length: 7 }).map((_, i) => (
        <div key={i} className="flex flex-col items-center gap-2 shrink-0">
          <div className="w-[72px] h-[72px] rounded-full skeleton" />
          <div className="h-3 w-14 skeleton rounded" />
        </div>
      ))}
    </div>
  );
}
