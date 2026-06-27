// Story Loom auth client — talks to the STORYLOOM-AUTH-SERVICE backend.
// Base URL is configurable via VITE_AUTH_API_URL; defaults to local gateway.

const BASE_URL =
  (import.meta.env.VITE_AUTH_API_URL as string | undefined)?.replace(/\/$/, "") ||
  "http://localhost:8765/STORYLOOM-AUTH-SERVICE";

const ACCESS_KEY = "sl.accessToken";
const REFRESH_KEY = "sl.refreshToken";
const USERNAME_KEY = "sl.username";

// 15 min access token; refresh a little earlier to be safe.
const REFRESH_INTERVAL_MS = 14 * 60 * 1000;

type AuthListener = (signedIn: boolean) => void;
const listeners = new Set<AuthListener>();
let refreshTimer: ReturnType<typeof setInterval> | null = null;

function isBrowser() {
  return typeof window !== "undefined";
}

export function getAccessToken(): string | null {
  if (!isBrowser()) return null;
  return localStorage.getItem(ACCESS_KEY);
}

export function getRefreshToken(): string | null {
  if (!isBrowser()) return null;
  return localStorage.getItem(REFRESH_KEY);
}

export function getUsername(): string | null {
  if (!isBrowser()) return null;
  return localStorage.getItem(USERNAME_KEY);
}

export function isAuthenticated(): boolean {
  return !!getAccessToken();
}

export function onAuthChange(fn: AuthListener): () => void {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

function emit() {
  const signedIn = isAuthenticated();
  listeners.forEach((l) => l(signedIn));
}

function storeTokens(tokens: { accessToken?: string; refreshToken?: string }) {
  if (!isBrowser()) return;
  if (tokens.accessToken) localStorage.setItem(ACCESS_KEY, tokens.accessToken);
  if (tokens.refreshToken) localStorage.setItem(REFRESH_KEY, tokens.refreshToken);
  startRefreshTimer();
  emit();
}

function clearTokens() {
  if (!isBrowser()) return;
  localStorage.removeItem(ACCESS_KEY);
  localStorage.removeItem(REFRESH_KEY);
  localStorage.removeItem(USERNAME_KEY);
  stopRefreshTimer();
  emit();
}

async function request<T>(
  path: string,
  opts: { method?: string; body?: unknown; auth?: "access" | "refresh" } = {},
): Promise<T> {
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (opts.auth === "access") {
    const t = getAccessToken();
    if (t) headers.Authorization = `Bearer ${t}`;
  } else if (opts.auth === "refresh") {
    const t = getRefreshToken();
    if (t) headers.Authorization = `Bearer ${t}`;
  }
  const res = await fetch(`${BASE_URL}${path}`, {
    method: opts.method ?? "POST",
    headers,
    body: opts.body !== undefined ? JSON.stringify(opts.body) : undefined,
  });
  const text = await res.text();
  const data = text ? safeJson(text) : null;
  if (!res.ok) {
    const msg =
      (data && (data.message || data.error)) ||
      (typeof data === "string" ? data : null) ||
      text ||
      `Request failed (${res.status})`;
    throw new Error(msg);
  }
  return data as T;
}

function safeJson(text: string): any {
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

// ---------- API methods ----------

export async function register(input: {
  username: string;
  email: string;
  password: string;
}) {
  return request<unknown>("/register", { body: input });
}

export async function verifyOtp(input: { email: string; otp: string }) {
  return request<unknown>("/verify", { body: input });
}

export async function login(input: { username: string; password: string }) {
  const data = await request<{
    accessToken: string;
    refreshToken: string;
    tokenType?: string;
  }>("/login", { body: input });
  storeTokens(data);
  if (isBrowser()) localStorage.setItem(USERNAME_KEY, input.username);
  emit();
  return data;
}

export async function refreshAccessToken(): Promise<string | null> {
  if (!getRefreshToken()) return null;
  try {
    const data = await request<{ accessToken: string; refreshToken?: string }>(
      "/refresh",
      { auth: "refresh" },
    );
    storeTokens(data);
    return data.accessToken;
  } catch (err) {
    console.warn("[auth] refresh failed", err);
    clearTokens();
    return null;
  }
}

export async function resendOtp(input: { email: string }) {
  return request<unknown>("/resend-otp", { body: input });
}

export async function resetPassword(input: {
  email: string;
  newPassword: string;
  otp: string;
}) {
  return request<unknown>("/resetPassword-Request", { body: input });
}

export async function logout() {
  try {
    if (getAccessToken()) {
      await request<unknown>("/logout", { auth: "access" });
    }
  } catch (err) {
    console.warn("[auth] logout request failed", err);
  } finally {
    clearTokens();
  }
}

// ---------- Refresh timer ----------

export function startRefreshTimer() {
  if (!isBrowser()) return;
  stopRefreshTimer();
  if (!getRefreshToken()) return;
  refreshTimer = setInterval(() => {
    void refreshAccessToken();
  }, REFRESH_INTERVAL_MS);
}

export function stopRefreshTimer() {
  if (refreshTimer) {
    clearInterval(refreshTimer);
    refreshTimer = null;
  }
}

// Auto-start the timer on module load in the browser so it keeps running
// across navigations as long as the app stays mounted.
if (isBrowser() && getRefreshToken()) {
  startRefreshTimer();
}
