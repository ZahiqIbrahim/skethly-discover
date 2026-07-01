import { createMiddleware } from "@tanstack/react-start";
import { getAccessToken } from "@/lib/auth-api";

// Must be registered as a global `functionMiddleware` in `src/start.ts`; otherwise
// the browser never attaches the Story Loom bearer token to serverFn RPCs.
// Runs client-side (`.client()`), where auth-api's localStorage access is safe.
export const attachAuth = createMiddleware({ type: "function" }).client(
  async ({ next }) => {
    const token = getAccessToken();
    return next({
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
  },
);
