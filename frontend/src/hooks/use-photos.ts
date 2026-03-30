import { useState, useEffect } from "react";
import { api, type PhotoListParams } from "@/lib/api";
import { formatPhoto } from "@/utils/format";
import type { Photo } from "@/data/mock";

export function usePhotosList(params: PhotoListParams) {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    setLoading(true);
    // stringify params to avoid dependency loop, or just pass as-is if ref is stable
    api.photos.list(params).then(res => {
      setPhotos(res.items.map(formatPhoto));
    }).catch(err => {
      setError(err);
    }).finally(() => {
      setLoading(false);
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(params)]);

  return { photos, loading, error };
}
