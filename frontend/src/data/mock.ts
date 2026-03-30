export interface Photo {
  id: string;
  src: string;
  thumbnail: string;
  width: number;
  height: number;
  title: string;
  date: string;
  size: string;
  location?: string;
  camera?: string;
  isFavorite: boolean;
  isVideo?: boolean;
  duration?: string;
  lat?: number;
  lng?: number;
  tags?: string[];
  person?: string;
  isDocument?: boolean;
  isScreenshot?: boolean;
}

export interface Album {
  id: string;
  title: string;
  coverSrc: string;
  photoCount: number;
  isSystem?: boolean;
}

export interface Person {
  id: string;
  name: string | null;
  avatar: string;
  photoCount: number;
  faces: string[];
}

const SEED_IDS = [10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59];

const LOCATIONS = [
  { name: "Connaught Place, Delhi", lat: 28.6315, lng: 77.2167 },
  { name: "Marine Drive, Mumbai", lat: 18.9432, lng: 72.8235 },
  { name: "MG Road, Bangalore", lat: 12.9756, lng: 77.6065 },
  { name: "Hauz Khas, Delhi", lat: 28.5494, lng: 77.2001 },
  { name: "Baga Beach, Goa", lat: 15.5551, lng: 73.7514 },
  { name: "Nainital Lake", lat: 29.3919, lng: 79.4542 },
  { name: "Gateway of India, Mumbai", lat: 18.9220, lng: 72.8347 },
  { name: "Cubbon Park, Bangalore", lat: 12.9763, lng: 77.5929 },
  { name: "Chandni Chowk, Delhi", lat: 28.6506, lng: 77.2301 },
  { name: "Rishikesh", lat: 30.0869, lng: 78.2676 },
];

const CAMERAS = [
  "iPhone 15 Pro",
  "iPhone 14",
  "Samsung Galaxy S23",
  "OnePlus 12",
  "Google Pixel 8",
  "iPhone 13 Pro Max",
  "Samsung Galaxy S24 Ultra",
];

const TAGS_POOL = [
  "trip", "hangout", "food", "sunset", "selfie",
  "college", "family", "outing", "nightout", "birthday",
  "wedding", "festival", "roadtrip", "pets", "random",
];

const MONTHS = [
  "January 2024", "February 2024", "March 2024", "April 2024",
  "May 2024", "June 2024", "July 2024", "August 2024",
  "September 2024", "October 2024", "November 2024", "December 2024",
];

export const photos: Photo[] = SEED_IDS.map((id, i) => {
  const loc = LOCATIONS[i % LOCATIONS.length];
  const isVideo = i % 8 === 0;
  const monthIdx = Math.floor(i / 5);
  const day = (i % 28) + 1;
  const month = monthIdx % 12;
  return {
    id: `photo-${id}`,
    src: `https://picsum.photos/id/${id}/1200/800`,
    thumbnail: `https://picsum.photos/id/${id}/400/400`,
    width: 1200,
    height: 800,
    title: `IMG_${String(1000 + i).padStart(4, "0")}.${isVideo ? "mp4" : "jpg"}`,
    date: `2024-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`,
    size: `${(Math.random() * 15 + 1).toFixed(1)} MB`,
    location: loc.name,
    camera: CAMERAS[i % CAMERAS.length],
    isFavorite: i % 5 === 0,
    isVideo,
    duration: isVideo ? `${Math.floor(Math.random() * 3)}:${String(Math.floor(Math.random() * 60)).padStart(2, "0")}` : undefined,
    lat: loc.lat + (Math.random() - 0.5) * 0.05,
    lng: loc.lng + (Math.random() - 0.5) * 0.05,
    tags: [TAGS_POOL[i % TAGS_POOL.length], TAGS_POOL[(i + 3) % TAGS_POOL.length]],
    person: i % 7 === 0 ? `person-${(i % 4) + 1}` : undefined,
  };
});

export const albums: Album[] = [
  { id: "favorites", title: "Favorites", coverSrc: `https://picsum.photos/id/10/600/450`, photoCount: photos.filter((p) => p.isFavorite).length, isSystem: true },
  { id: "videos", title: "Videos", coverSrc: `https://picsum.photos/id/18/600/450`, photoCount: photos.filter((p) => p.isVideo).length, isSystem: true },
  { id: "screenshots", title: "Screenshots", coverSrc: `https://picsum.photos/id/60/600/450`, photoCount: 23, isSystem: true },
  { id: "album-1", title: "Goa Trip Dec 2024", coverSrc: `https://picsum.photos/id/11/600/450`, photoCount: 47 },
  { id: "album-2", title: "Diwali @ Home", coverSrc: `https://picsum.photos/id/22/600/450`, photoCount: 32 },
  { id: "album-3", title: "College Farewell", coverSrc: `https://picsum.photos/id/33/600/450`, photoCount: 28 },
  { id: "album-4", title: "Cafe Hopping", coverSrc: `https://picsum.photos/id/44/600/450`, photoCount: 19 },
  { id: "album-5", title: "Rishikesh Weekend", coverSrc: `https://picsum.photos/id/15/600/450`, photoCount: 56 },
  { id: "album-6", title: "Random Clicks", coverSrc: `https://picsum.photos/id/36/600/450`, photoCount: 41 },
];

export const people: Person[] = [
  { id: "person-1", name: "Priya", avatar: "https://i.pravatar.cc/300?img=1", photoCount: 89, faces: ["https://i.pravatar.cc/64?img=1", "https://i.pravatar.cc/64?img=5", "https://i.pravatar.cc/64?img=9"] },
  { id: "person-2", name: "Arjun", avatar: "https://i.pravatar.cc/300?img=3", photoCount: 56, faces: ["https://i.pravatar.cc/64?img=3", "https://i.pravatar.cc/64?img=7"] },
  { id: "person-3", name: null, avatar: "https://i.pravatar.cc/300?img=5", photoCount: 34, faces: ["https://i.pravatar.cc/64?img=5", "https://i.pravatar.cc/64?img=11"] },
  { id: "person-4", name: "Sneha", avatar: "https://i.pravatar.cc/300?img=9", photoCount: 72, faces: ["https://i.pravatar.cc/64?img=9", "https://i.pravatar.cc/64?img=13", "https://i.pravatar.cc/64?img=17"] },
  { id: "person-5", name: null, avatar: "https://i.pravatar.cc/300?img=11", photoCount: 23, faces: ["https://i.pravatar.cc/64?img=11"] },
  { id: "person-6", name: "Rahul", avatar: "https://i.pravatar.cc/300?img=12", photoCount: 45, faces: ["https://i.pravatar.cc/64?img=12", "https://i.pravatar.cc/64?img=15"] },
  { id: "person-7", name: "Ananya", avatar: "https://i.pravatar.cc/300?img=16", photoCount: 38, faces: ["https://i.pravatar.cc/64?img=16", "https://i.pravatar.cc/64?img=20"] },
  { id: "person-8", name: null, avatar: "https://i.pravatar.cc/300?img=18", photoCount: 15, faces: ["https://i.pravatar.cc/64?img=18"] },
];

export const exploreCategories = [
  { id: "places", title: "Places", icon: "📍", photos: photos.filter(p => p.location) },
  { id: "pets", title: "Pets", icon: "🐕", photos: photos.filter(p => p.tags?.includes("pets")) },
  { id: "food", title: "Food", icon: "🍔", photos: photos.filter(p => p.tags?.includes("food")) },
  { id: "trips", title: "Trips", icon: "🏖️", photos: photos.filter(p => p.tags?.includes("trip") || p.tags?.includes("roadtrip")) },
  { id: "documents", title: "Documents", icon: "📄", photos: photos.slice(0, 8) },
  { id: "screenshots", title: "Screenshots", icon: "📱", photos: photos.slice(8, 20) },
];

export function getPhotosByMonth(): { month: string; photos: Photo[] }[] {
  const groups: Record<string, Photo[]> = {};
  photos.forEach((p) => {
    const d = new Date(p.date);
    const key = `${MONTHS[d.getMonth()]}`;
    if (!groups[key]) groups[key] = [];
    groups[key].push(p);
  });
  return Object.entries(groups).map(([month, photos]) => ({ month, photos }));
}
