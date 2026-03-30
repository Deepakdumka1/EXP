const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

interface RequestOptions extends RequestInit {
  params?: Record<string, string | number | boolean | undefined>;
}

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private getToken(): string | null {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("access_token");
  }

  private async request<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
    const { params, headers: customHeaders, ...rest } = options;

    // Build URL with query params
    let url = `${this.baseUrl}${endpoint}`;
    if (params) {
      const searchParams = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          searchParams.append(key, String(value));
        }
      });
      const qs = searchParams.toString();
      if (qs) url += `?${qs}`;
    }

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      ...((customHeaders as Record<string, string>) || {}),
    };

    const token = this.getToken();
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const response = await fetch(url, { ...rest, headers });

    if (response.status === 401) {
      // Try refresh
      const refreshed = await this.refreshToken();
      if (refreshed) {
        headers["Authorization"] = `Bearer ${this.getToken()}`;
        const retryResponse = await fetch(url, { ...rest, headers });
        if (!retryResponse.ok) throw new ApiError(retryResponse.status, await retryResponse.text());
        return retryResponse.json();
      }
      // Clear tokens — AppShell will handle the redirect
      if (typeof window !== "undefined") {
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
      }
      throw new ApiError(401, "Unauthorized");
    }

    if (!response.ok) {
      const text = await response.text();
      throw new ApiError(response.status, text);
    }

    return response.json();
  }

  private async refreshToken(): Promise<boolean> {
    const refreshToken = typeof window !== "undefined" ? localStorage.getItem("refresh_token") : null;
    if (!refreshToken) return false;

    try {
      const response = await fetch(`${this.baseUrl}/api/auth/refresh`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refresh_token: refreshToken }),
      });
      if (!response.ok) return false;
      const data = await response.json();
      localStorage.setItem("access_token", data.access_token);
      localStorage.setItem("refresh_token", data.refresh_token);
      return true;
    } catch {
      return false;
    }
  }

  // Upload helper (multipart)
  private async upload<T>(endpoint: string, file: File): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    const formData = new FormData();
    formData.append("file", file);

    const headers: Record<string, string> = {};
    const token = this.getToken();
    if (token) headers["Authorization"] = `Bearer ${token}`;

    const response = await fetch(url, { method: "POST", headers, body: formData });
    if (!response.ok) throw new ApiError(response.status, await response.text());
    return response.json();
  }

  // ─── Auth ────────────────────────────────────────
  auth = {
    register: (email: string, password: string, name: string) =>
      this.request<TokenResponse>("/api/auth/register", {
        method: "POST",
        body: JSON.stringify({ email, password, name }),
      }),

    login: (email: string, password: string) =>
      this.request<TokenResponse>("/api/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      }),

    logout: (refreshToken: string) =>
      this.request<{ message: string }>("/api/auth/logout", {
        method: "POST",
        body: JSON.stringify({ refresh_token: refreshToken }),
      }),

    me: () => this.request<UserResponse>("/api/auth/me"),
  };

  // ─── Photos ──────────────────────────────────────
  photos = {
    list: (params?: PhotoListParams) =>
      this.request<PaginatedResponse<PhotoResponse>>("/api/photos", { params: params as any }),

    byMonth: () =>
      this.request<{ month: string; photos: PhotoResponse[] }[]>("/api/photos/by-month"),

    get: (id: string) =>
      this.request<PhotoResponse>(`/api/photos/${id}`),

    update: (id: string, data: Partial<PhotoResponse>) =>
      this.request<PhotoResponse>(`/api/photos/${id}`, {
        method: "PATCH",
        body: JSON.stringify(data),
      }),

    delete: (id: string) =>
      this.request<{ message: string }>(`/api/photos/${id}`, { method: "DELETE" }),

    restore: (id: string) =>
      this.request<{ message: string }>(`/api/photos/${id}/restore`, { method: "POST" }),

    permanentDelete: (id: string) =>
      this.request<{ message: string }>(`/api/photos/${id}/permanent`, { method: "DELETE" }),

    bulk: (photoIds: string[], action: string) =>
      this.request<{ message: string }>("/api/photos/bulk", {
        method: "POST",
        body: JSON.stringify({ photo_ids: photoIds, action }),
      }),
  };

  // ─── Upload ──────────────────────────────────────
  uploads = {
    single: (file: File) => this.upload<PhotoResponse>("/api/upload", file),

    bulk: async (files: File[]) => {
      const url = `${this.baseUrl}/api/upload/bulk`;
      const formData = new FormData();
      files.forEach((f) => formData.append("files", f));
      const headers: Record<string, string> = {};
      const token = this.getToken();
      if (token) headers["Authorization"] = `Bearer ${token}`;
      const response = await fetch(url, { method: "POST", headers, body: formData });
      if (!response.ok) throw new ApiError(response.status, await response.text());
      return response.json();
    },
  };

  // ─── Albums ──────────────────────────────────────
  albums = {
    list: () => this.request<AlbumResponse[]>("/api/albums"),

    get: (id: string) => this.request<AlbumDetailResponse>(`/api/albums/${id}`),

    create: (title: string) =>
      this.request<AlbumResponse>("/api/albums", {
        method: "POST",
        body: JSON.stringify({ title }),
      }),

    update: (id: string, data: { title?: string; cover_photo_id?: string }) =>
      this.request<AlbumResponse>(`/api/albums/${id}`, {
        method: "PATCH",
        body: JSON.stringify(data),
      }),

    delete: (id: string) =>
      this.request<{ message: string }>(`/api/albums/${id}`, { method: "DELETE" }),

    addPhotos: (id: string, photoIds: string[]) =>
      this.request<{ message: string }>(`/api/albums/${id}/photos`, {
        method: "POST",
        body: JSON.stringify({ photo_ids: photoIds }),
      }),

    removePhotos: (id: string, photoIds: string[]) =>
      this.request<{ message: string }>(`/api/albums/${id}/photos`, {
        method: "DELETE",
        body: JSON.stringify({ photo_ids: photoIds }),
      }),

    share: (id: string) =>
      this.request<{ message: string }>(`/api/albums/${id}/share`, { method: "POST" }),

    unshare: (id: string) =>
      this.request<{ message: string }>(`/api/albums/${id}/share`, { method: "DELETE" }),
  };

  // ─── People ──────────────────────────────────────
  people = {
    list: () => this.request<PersonResponse[]>("/api/people"),

    get: (id: string) => this.request<PersonDetailResponse>(`/api/people/${id}`),

    updateName: (id: string, name: string) =>
      this.request<PersonResponse>(`/api/people/${id}`, {
        method: "PATCH",
        body: JSON.stringify({ name }),
      }),

    merge: (sourceId: string, targetId: string) =>
      this.request<{ message: string }>("/api/people/merge", {
        method: "POST",
        body: JSON.stringify({ source_id: sourceId, target_id: targetId }),
      }),

    delete: (id: string) =>
      this.request<{ message: string }>(`/api/people/${id}`, { method: "DELETE" }),
  };

  // ─── Search ──────────────────────────────────────
  search = {
    query: (q: string, params?: SearchParams) =>
      this.request<PaginatedResponse<PhotoResponse>>("/api/search", {
        params: { q, ...params } as any,
      }),
  };

  // ─── Map ─────────────────────────────────────────
  map = {
    clusters: (bounds: MapBounds) =>
      this.request<MapCluster[]>("/api/map/clusters", { params: bounds as any }),

    photos: (bounds: Omit<MapBounds, "zoom">) =>
      this.request<PhotoResponse[]>("/api/map/photos", { params: bounds as any }),
  };

  // ─── Trash ───────────────────────────────────────
  trash = {
    list: (params?: { page?: number; limit?: number }) =>
      this.request<PaginatedResponse<PhotoResponse>>("/api/trash", { params: params as any }),

    restoreAll: () =>
      this.request<{ message: string }>("/api/trash/restore-all", { method: "POST" }),

    empty: () =>
      this.request<{ message: string }>("/api/trash/empty", { method: "DELETE" }),
  };

  // ─── Settings ────────────────────────────────────
  settings = {
    get: () => this.request<UserSettings>("/api/settings"),

    update: (data: Partial<UserSettings>) =>
      this.request<UserSettings>("/api/settings", {
        method: "PATCH",
        body: JSON.stringify(data),
      }),

    storage: () => this.request<StorageInfo>("/api/settings/storage"),

    clearCache: () =>
      this.request<{ message: string }>("/api/settings/clear-cache", { method: "POST" }),
  };
}

// ─── Error Class ─────────────────────────────────
export class ApiError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

// ─── Types ───────────────────────────────────────
export interface TokenResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
}

export interface UserResponse {
  id: string;
  email: string;
  name: string;
  avatar_url: string | null;
  storage_used: number;
  storage_limit: number;
  created_at: string;
}

export interface PhotoResponse {
  id: string;
  title: string;
  src: string;
  thumbnail: string;
  width: number;
  height: number;
  size: number;
  date: string;
  location: string | null;
  lat: number | null;
  lng: number | null;
  camera: string | null;
  is_favorite: boolean;
  is_video: boolean;
  is_archived: boolean;
  is_locked: boolean;
  is_document: boolean;
  is_screenshot: boolean;
  duration: string | null;
  trashed_at: string | null;
  tags: string[];
  person_id: string | null;
  created_at: string;
}

export interface AlbumResponse {
  id: string;
  title: string;
  cover_src: string | null;
  photo_count: number;
  is_system: boolean;
  is_shared: boolean;
  share_token: string | null;
  created_at: string;
}

export interface AlbumDetailResponse extends AlbumResponse {
  photos: PhotoResponse[];
}

export interface PersonResponse {
  id: string;
  name: string | null;
  avatar_url: string | null;
  photo_count: number;
  faces: string[];
  created_at: string;
}

export interface PersonDetailResponse {
  person: PersonResponse;
  photos: PhotoResponse[];
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  pages: number;
}

export interface PhotoListParams {
  page?: number;
  limit?: number;
  sort?: string;
  order?: string;
  month?: string;
  favorite?: boolean;
  archived?: boolean;
  locked?: boolean;
  is_video?: boolean;
  is_document?: boolean;
  is_screenshot?: boolean;
}

export interface SearchParams {
  type?: string;
  date_from?: string;
  date_to?: string;
  location?: string;
  person_id?: string;
  page?: number;
  limit?: number;
}

export interface MapBounds {
  lat1: number;
  lng1: number;
  lat2: number;
  lng2: number;
  zoom?: number;
}

export interface MapCluster {
  lat: number;
  lng: number;
  count: number;
  photo_ids: string[];
}

export interface UserSettings {
  theme: string;
  grid_density: string;
  face_recognition_enabled: boolean;
  location_metadata_enabled: boolean;
  analytics_enabled: boolean;
}

export interface StorageInfo {
  used: number;
  limit: number;
  used_formatted: string;
  limit_formatted: string;
  percentage: number;
}

// ─── Singleton Export ────────────────────────────
export const api = new ApiClient(API_BASE);
