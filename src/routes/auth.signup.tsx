import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { register } from "@/lib/auth-api";

export const Route = createFileRoute("/auth/signup")({
  head: () => ({
    meta: [
      { title: "Sign up — Story Loom" },
      { name: "description", content: "Create your Story Loom account." },
    ],
  }),
  component: SignupPage,
});

function SignupPage() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      if (username.trim().length < 3) throw new Error("Username must be at least 3 characters.");
      if (password.length < 6) throw new Error("Password must be at least 6 characters.");
      await register({ username: username.trim(), email: email.trim(), password });
      navigate({ to: "/auth/verify", search: { email: email.trim() } });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-md mx-auto px-5 py-12">
      <div className="sketch-border p-8 space-y-6">
        <div>
          <h1 className="font-brush text-4xl">Sign up</h1>
          <p className="font-serif italic text-sm mt-1">Start your reading journey.</p>
        </div>
        <form onSubmit={onSubmit} className="space-y-4">
          <Field label="Username" value={username} onChange={setUsername} autoComplete="username" />
          <Field label="Email" type="email" value={email} onChange={setEmail} autoComplete="email" />
          <Field label="Password" type="password" value={password} onChange={setPassword} autoComplete="new-password" />
          {error && <p className="text-sm text-red-700 font-serif">{error}</p>}
          <button type="submit" disabled={loading} className="ink-btn-filled w-full">
            {loading ? "Creating account..." : "Create account"}
          </button>
        </form>
        <p className="font-hand text-sm text-center">
          Already have an account?{" "}
          <Link to="/auth/login" className="underline">Log in</Link>
        </p>
      </div>
    </div>
  );
}

function Field({
  label, value, onChange, type = "text", autoComplete,
}: { label: string; value: string; onChange: (v: string) => void; type?: string; autoComplete?: string }) {
  return (
    <label className="block space-y-1">
      <span className="font-hand text-sm">{label}</span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        autoComplete={autoComplete}
        required
        className="w-full px-3 py-2 bg-transparent border border-ink/60 rounded-md font-serif focus:outline-none focus:ring-1 focus:ring-ink"
      />
    </label>
  );
}
