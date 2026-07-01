// Story Loom Community client — talks to STORYLOOM-COMMUNITY-SERVICE via the API gateway.
import { getAccessToken, getUsername, refreshAccessToken } from "./auth-api";

const BASE_URL =
  (import.meta.env.VITE_COMMUNITY_API_URL as string | undefined)?.replace(/\/$/, "") ||
  "http://localhost:8765/STORYLOOM-COMMUNITY-SERVICE";

export function getCommunityBaseUrl() {
  return BASE_URL;
}

export type ChatMessage = {
  id?: number;
  sender: string;
  content: string;
  timeStamp?: string;
};

export type Room = {
  id: number;
  roomId: string;
  roomDescription: string;
  owner: string;
  members: string[];
  roomCreatedAt?: string;
  messages?: ChatMessage[];
};

async function doFetch(path: string, token: string | null, init?: RequestInit) {
  return fetch(`${BASE_URL}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers || {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const token = getAccessToken();
  let res = await doFetch(path, token, init);
  if (res.status === 401 || res.status === 403) {
    const newToken = await refreshAccessToken();
    if (newToken) res = await doFetch(path, newToken, init);
  }
  const text = await res.text();
  if (!res.ok) {
    let msg = `Request failed (${res.status})`;
    try {
      const j = JSON.parse(text);
      msg = j?.Error || j?.message || j?.error || msg;
    } catch {
      if (text) msg = text;
    }
    throw new Error(msg);
  }
  if (!text) return undefined as T;
  try { return JSON.parse(text) as T; } catch { return text as unknown as T; }
}

export const createRoom = (input: { roomId: string; roomDescription: string }) =>
  request<Room>("/room/create", { method: "POST", body: JSON.stringify(input) });

export const deleteRoom = (roomId: string) =>
  request<unknown>(`/room/delete/${encodeURIComponent(roomId)}`, { method: "DELETE" });

export const joinRoom = (roomId: string) =>
  request<unknown>(`/room/join/${encodeURIComponent(roomId)}`, { method: "POST" });

export const leaveRoom = (roomId: string) =>
  request<unknown>(`/room/leave/${encodeURIComponent(roomId)}`, { method: "POST" });

export const getMyRooms = () => request<Room[]>("/room/getMyRooms", { method: "GET" });

export const getMessages = (roomId: string) =>
  request<ChatMessage[]>(`/room/getMessages/${encodeURIComponent(roomId)}`, { method: "GET" });

export const getRoomDetails = (roomId: string) =>
  request<Room>(`/room/getRoomDetails/${encodeURIComponent(roomId)}`, { method: "GET" });

export function getCurrentUsername(): string | null {
  return getUsername();
}

export function getWebSocketUrl(): string {
  return BASE_URL.replace(/^http:\/\//, "ws://").replace(/^https:\/\//, "wss://") + "/ws/chat";
}
