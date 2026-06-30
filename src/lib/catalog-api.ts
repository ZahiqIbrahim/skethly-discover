// Story Loom Catalog client — talks to STORYLOOM-CATALOG-SERVICE via the API gateway.
import { getAccessToken, refreshAccessToken } from "./auth-api";

const BASE_URL =
  (import.meta.env.VITE_CATALOG_API_URL as string | undefined)?.replace(/\/$/, "") ||
  "http://localhost:8765/STORYLOOM-CATALOG-SERVICE";

export type CatalogBook = {
  id: number | string;
  title: string;
  authorName?: string[];
  subtitle?: string | null;
  firstPublishYear?: string | number;
  key?: string;
  cover?: string;
};

export type CatalogMovie = {
  id: number | string;
  title: string;
  overview?: string;
  posterPath?: string;
  releaseDate?: string;
  voteAverage?: string | number;
};

async function doFetch(path: string, token: string | null, init?: RequestInit) {
  return fetch(`${BASE_URL}${path}`, {
    method: "POST",
    ...init,
    headers: {
      ...(init?.headers || {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });
}

async function post<T>(path: string, init?: RequestInit): Promise<T> {
  const token = getAccessToken();
  let res = await doFetch(path, token, init);
  if (res.status === 401 || res.status === 403) {
    const newToken = await refreshAccessToken();
    if (newToken) res = await doFetch(path, newToken, init);
  }
  if (!res.ok) {
    let msg = `Request failed (${res.status})`;
    try {
      const j = await res.json();
      if (j?.Error) msg = j.Error;
    } catch {
      /* ignore */
    }
    throw new Error(msg);
  }
  return (await res.json()) as T;
}

export const getTrendingBooks = () =>
  post<CatalogBook[]>("/books/getTrendingBooks");

export const getTrendingMovies = () =>
  post<CatalogMovie[]>("/movies/getTrendingMovies");
