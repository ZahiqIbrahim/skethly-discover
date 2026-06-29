// Story Loom AI Recommendation client — talks to STORYLOOM-AI-RECOMMENDATION-SERVICE via the API gateway.
// Base URL is configurable via VITE_RECOMMEND_API_URL; defaults to local gateway.

import { getAccessToken, refreshAccessToken } from "./auth-api";

const BASE_URL =
  (import.meta.env.VITE_RECOMMEND_API_URL as string | undefined)?.replace(/\/$/, "") ||
  "http://localhost:8765/STORYLOOM-AI-RECOMMENDATION-SERVICE/recommend";

export type RecommendedBook = {
  id: string | number;
  title: string;
  authorName?: string[];
  subtitle?: string;
  firstPublishYear?: number;
  key?: string;
  cover?: string;
};

export type RecommendedMovie = {
  id: string | number;
  title: string;
  overview?: string;
  posterPath?: string;
  releaseDate?: string;
  voteAverage?: number;
};

async function doFetch(path: "books" | "movies", prompt: string, token: string | null) {
  return fetch(`${BASE_URL}/${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "text/plain",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: prompt,
  });
}

async function post<T>(path: "books" | "movies", prompt: string): Promise<T> {
  const token = getAccessToken();
  if (!token) throw new Error("Please log in to get recommendations.");

  let res = await doFetch(path, prompt, token);
  if (res.status === 401 || res.status === 403) {
    const newToken = await refreshAccessToken();
    if (!newToken) throw new Error("Your session expired. Please log in again.");
    res = await doFetch(path, prompt, newToken);
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

export const recommendBooks = (prompt: string) =>
  post<RecommendedBook[]>("books", prompt);

export const recommendMovies = (prompt: string) =>
  post<RecommendedMovie[]>("movies", prompt);
