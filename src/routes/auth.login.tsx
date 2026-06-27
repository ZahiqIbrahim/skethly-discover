import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { login } from "@/lib/auth-api";

export const Route = createFileRoute("/auth/login")({
  head: () => ({
    meta: [
      { title: "Log in — Story Loom" },
      { name: "description", content: "Log in to your Story Loom account." },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await login({ username: username.trim(), password });
      navigate({ to: "/" });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-md mx-auto px-5 py-12">
      <div className="sketch-border p-8 space-y-6">
        <div>
          <h1 className="font-brush text-4xl">Log in</h1>
          <p className="font-serif italic text-sm mt-1">Welcome back.</p>
        </div>
        <form onSubmit={onSubmit} className="space-y-4">
          <label className="block space-y-1">
            <span className="font-hand text-sm">Username</span>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoComplete="username"
              required
              className="w-full px-3 py-2 bg-transparent border border-ink/60 rounded-md font-serif focus:outline-none focus:ring-1 focus:ring-ink"
            />
          </label>
          <label className="block space-y-1">
            <span className="font-hand text-sm">Password</span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              required
              className="w-full px-3 py-2 bg-transparent border border-ink/60 rounded-md font-serif focus:outline-none focus:ring-1 focus:ring-ink"
            />
          </label>
          {error && <p className="text-sm text-red-700 font-serif">{error}</p>}
          <button type="submit" disabled={loading} className="ink-btn-filled w-full">
            {loading ? "Signing in..." : "Log in"}
          </button>
        </form>
        <div className="flex justify-between font-hand text-sm">
          <Link to="/auth/reset" className="underline">Forgot password?</Link>
          <Link to="/auth/signup" className="underline">Create account</Link>
        </div>
      </div>
    </div>
  );
}
