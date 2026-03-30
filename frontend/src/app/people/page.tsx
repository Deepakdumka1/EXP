"use client";

import { Header } from "@/components/layout/header";
import { PhotoGrid } from "@/components/photos/photo-grid";
import { Button } from "@/components/ui/button";
import { Merge, ArrowLeft, X, Users, Loader2 } from "lucide-react";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/toast";
import { api, type PersonResponse, type PhotoResponse } from "@/lib/api";
import type { Photo } from "@/data/mock";

function getAssetUrl(url: string | null | undefined): string {
    if (!url) return "";
    if (url.startsWith("http")) return url;
    return `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}${url}`;
}

function formatPhoto(p: PhotoResponse): Photo {
  return {
    id: p.id,
    src: getAssetUrl(p.src),
    thumbnail: getAssetUrl(p.thumbnail),
    width: p.width || 800,
    height: p.height || 600,
    title: p.title,
    date: p.date ? p.date.split("T")[0] : "",
    size: `${(p.size / 1024 / 1024).toFixed(1)} MB`,
    location: p.location || undefined,
    camera: p.camera || undefined,
    isFavorite: p.is_favorite,
    isVideo: p.is_video,
    duration: p.duration || undefined,
    lat: p.lat || undefined,
    lng: p.lng || undefined,
    tags: p.tags || [],
    person: p.person_id || undefined,
  };
}

function PersonCollage({ faces, fallback }: { faces: string[], fallback: string }) {
  const urls = faces.map(getAssetUrl).filter(Boolean);
  
  if (urls.length === 0) {
    return <Image src={fallback} alt="avatar" fill className="object-cover" sizes="(max-width: 768px) 100vw, 300px" />;
  }
  
  if (urls.length >= 4) {
    return (
      <div className="grid grid-cols-2 grid-rows-2 w-full h-full gap-0.5 bg-black/10">
        {urls.slice(0, 4).map((url, i) => (
          <div key={i} className="relative w-full h-full">
            <Image src={url} alt="" fill className="object-cover" sizes="(max-width: 768px) 50vw, 150px" />
          </div>
        ))}
      </div>
    );
  }
  
  if (urls.length >= 2) {
    return (
      <div className="grid grid-cols-2 w-full h-full gap-0.5 bg-black/10">
        {urls.slice(0, 2).map((url, i) => (
          <div key={i} className="relative w-full h-full">
            <Image src={url} alt="" fill className="object-cover" sizes="(max-width: 768px) 50vw, 150px" />
          </div>
        ))}
      </div>
    );
  }
  
  return <Image src={urls[0]} alt="avatar" fill className="object-cover" sizes="(max-width: 768px) 100vw, 300px" />;
}

export default function PeoplePage() {
  const [peopleList, setPeopleList] = useState<PersonResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [detailLoading, setDetailLoading] = useState(false);
  const [selectedPerson, setSelectedPerson] = useState<string | null>(null);
  const [selectedPersonPhotos, setSelectedPersonPhotos] = useState<Photo[]>([]);
  const [showMergeDialog, setShowMergeDialog] = useState(false);
  const { addToast } = useToast();

  useEffect(() => {
    async function fetchPeople() {
      try {
        const data = await api.people.list();
        setPeopleList(data);
      } catch (err) {
        console.error("Failed to load people", err);
      } finally {
        setLoading(false);
      }
    }
    fetchPeople();
  }, []);

  const handleSelectPerson = async (id: string) => {
    setSelectedPerson(id);
    setDetailLoading(true);
    try {
        const detail = await api.people.get(id);
        setSelectedPersonPhotos(detail.photos.map(formatPhoto));
    } catch (err) {
        console.error(err);
    } finally {
        setDetailLoading(false);
    }
  };

  const unnamedPeople = peopleList.filter((p) => !p.name);
  const mergePair = unnamedPeople.length >= 2 ? [unnamedPeople[0], unnamedPeople[1]] : null;

  const person = selectedPerson ? peopleList.find((p) => p.id === selectedPerson) : null;

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="w-10 h-10 animate-spin text-[var(--muted-foreground)]" />
      </div>
    );
  }

  if (person) {
    return (
      <>
        <Header
          title={person.name || "Unknown Person"}
          subtitle={`${person.photo_count} photos`}
          showViewToggle
          showSort={false}
          actions={
            <Button variant="ghost" size="icon" onClick={() => setSelectedPerson(null)}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
          }
        />
        <div className="p-4 lg:p-8">
          <div className="flex items-center gap-5 mb-8 p-5 rounded-xl border border-[var(--border)]">
            <div className="relative w-20 h-20 rounded-full overflow-hidden ring-2 ring-[var(--accent)]/20 ring-offset-2 ring-offset-[var(--background)]">
              <PersonCollage 
                faces={person.faces?.length > 0 ? person.faces : (person.avatar_url ? [person.avatar_url] : [])} 
                fallback={`https://i.pravatar.cc/300?u=${person.id}`} 
              />
            </div>
            <div>
              <h2 className="text-xl font-bold">{person.name || "Unknown Person"}</h2>
              <p className="text-sm text-[var(--muted-foreground)]">{person.photo_count} photos</p>
            </div>
          </div>
          {detailLoading ? (
            <div className="flex justify-center py-12"><Loader2 className="w-6 h-6 animate-spin text-[var(--muted-foreground)]" /></div>
          ) : selectedPersonPhotos.length > 0 ? (
            <PhotoGrid photos={selectedPersonPhotos} />
          ) : (
            <p className="text-[var(--muted-foreground)] text-center py-12">
              Photos of this person will appear here
            </p>
          )}
        </div>
      </>
    );
  }

  return (
    <>
      <Header
        title="People and pets"
        showViewToggle={false}
        showSort={false}
        actions={
          <Button variant="outline" size="sm" onClick={() => setShowMergeDialog(true)}>
            <Merge className="w-4 h-4" />
            Merge Faces
          </Button>
        }
      />
      <div className="p-4 lg:p-8">
        {peopleList.length === 0 ? (
           <p className="text-center text-[var(--muted-foreground)] py-12 border-2 border-dashed border-[var(--border)] rounded-xl mt-4 max-w-xl mx-auto">
             No people or pets detected yet. Upload photos with faces or animals!
           </p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
            {peopleList.map((person, i) => (
              <button
                key={person.id}
                onClick={() => handleSelectPerson(person.id)}
                className="flex flex-col items-center gap-3 group cursor-pointer"
              >
                <div className="relative w-[80%] aspect-square mx-auto">
                  <div className="absolute inset-0 w-full h-full rounded-full overflow-hidden border-2 border-[var(--border)] group-hover:border-[var(--accent)]/40 transition-all duration-200 group-hover:shadow-lg">
                    <PersonCollage 
                      faces={person.faces?.length > 0 ? person.faces : (person.avatar_url ? [person.avatar_url] : [])} 
                      fallback={`https://i.pravatar.cc/300?u=${person.id}`} 
                    />
                  </div>
                </div>

                <div className="text-center">
                  <p className="text-sm font-medium truncate max-w-full group-hover:text-[var(--accent)] transition-colors duration-200">
                    {person.name || (
                      <span className="text-[var(--muted-foreground)] italic font-normal text-xs">Name this person</span>
                    )}
                  </p>
                  <p className="text-xs text-[var(--muted-foreground)]">{person.photo_count} photos</p>
                </div>

                <div className="flex -space-x-1.5">
                  {person.faces?.slice(0, 5).map((face, j) => (
                    <div
                      key={j}
                      className="w-7 h-7 rounded-full overflow-hidden border-2 border-[var(--card-solid)]"
                    >
                      <Image src={getAssetUrl(face)} alt="" width={28} height={28} className="w-full h-full object-cover" />
                    </div>
                  ))}
                  {(person.faces?.length || 0) > 5 && (
                    <div className="w-7 h-7 rounded-full bg-[var(--muted)] border-2 border-[var(--card-solid)] flex items-center justify-center">
                      <span className="text-[9px] font-bold">+{(person.faces?.length || 0) - 5}</span>
                    </div>
                  )}
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {showMergeDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" onClick={() => setShowMergeDialog(false)}>
          <div className="absolute inset-0 bg-black/50" />
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative bg-[var(--card-solid)] border border-[var(--border)] rounded-xl shadow-xl w-full max-w-md mx-4 p-6 animate-[scaleIn_200ms_ease-out]"
          >
            <button
              onClick={() => setShowMergeDialog(false)}
              className="absolute top-4 right-4 p-1.5 rounded-lg hover:bg-[var(--hover)] cursor-pointer transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-2.5 mb-6">
              <div className="w-9 h-9 rounded-lg bg-[var(--accent)]/10 flex items-center justify-center">
                <Users className="w-4 h-4 text-[var(--accent)]" />
              </div>
              <h3 className="text-lg font-bold">Same person?</h3>
            </div>

            {mergePair ? (
              <>
                <div className="flex items-center justify-center gap-8 mb-8">
                  {mergePair.map((p) => (
                    <div key={p.id} className="flex flex-col items-center gap-2">
                      <div className="relative w-24 h-24 rounded-full overflow-hidden border-2 border-[var(--border)] shadow-md">
                        <PersonCollage 
                          faces={p.faces?.length > 0 ? p.faces : (p.avatar_url ? [p.avatar_url] : [])} 
                          fallback={`https://i.pravatar.cc/300?u=${p.id}`} 
                        />
                      </div>
                      <p className="text-xs text-[var(--muted-foreground)] font-medium">{p.photo_count} photos</p>
                    </div>
                  ))}
                </div>
                <div className="flex gap-3">
                  <Button
                    className="flex-1"
                    onClick={() => {
                      setShowMergeDialog(false);
                      addToast("success", "Faces merged successfully");
                    }}
                  >
                    Yes, merge
                  </Button>
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => {
                      setShowMergeDialog(false);
                      addToast("info", "Kept as different people");
                    }}
                  >
                    No, different
                  </Button>
                </div>
              </>
            ) : (
              <div className="text-center py-4">
                <p className="text-[var(--muted-foreground)]">No unnamed faces available to merge</p>
                <Button variant="outline" className="mt-4" onClick={() => setShowMergeDialog(false)}>
                  Close
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
