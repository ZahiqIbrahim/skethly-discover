import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { resendOtp, resetPassword } from "@/lib/auth-api";

export const Route = createFileRoute("/auth/reset")({
  head: () => ({
    meta: [
      { title: "Reset password — Story Loom" },
      { name: "description", content: "Reset your Story Loom password." },
    ],
  }),
  component: ResetPage,
});

function ResetPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setInfo(null);
    setLoading(true);
    try {
      if (newPassword.length < 6) throw new Error("Password must be at least 6 characters.");
      await resetPassword({ email: email.trim(), otp: otp.trim(), newPassword });
      navigate({ to: "/auth/login" });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not reset password.");
    } finally {
      setLoading(false);
    }
  }

  async function sendOtp() {
    setError(null);
    setInfo(null);
    try {
      await resendOtp({ email: email.trim() });
      setInfo("OTP sent. Check your inbox.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not send OTP.");
    }
  }

  return (
    <div className="max-w-md mx-auto px-5 py-12">
      <div className="sketch-border p-8 space-y-6">
        <div>
          <h1 className="font-brush text-4xl">Reset password</h1>
          <p className="font-serif italic text-sm mt-1">We'll email you a one-time code.</p>
        </div>
        <form onSubmit={onSubmit} className="space-y-4">
          <label className="block space-y-1">
            <span className="font-hand text-sm">Email</span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-3 py-2 bg-transparent border border-ink/60 rounded-md font-serif focus:outline-none focus:ring-1 focus:ring-ink"
            />
          </label>
          <div className="flex justify-end">
            <button type="button" onClick={sendOtp} className="font-hand text-sm underline">
              Send OTP
            </button>
          </div>
          <label className="block space-y-1">
            <span className="font-hand text-sm">OTP</span>
            <input
              type="text"
              inputMode="numeric"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
              className="w-full px-3 py-2 bg-transparent border border-ink/60 rounded-md font-serif tracking-widest focus:outline-none focus:ring-1 focus:ring-ink"
            />
          </label>
          <label className="block space-y-1">
            <span className="font-hand text-sm">New password</span>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              autoComplete="new-password"
              required
              className="w-full px-3 py-2 bg-transparent border border-ink/60 rounded-md font-serif focus:outline-none focus:ring-1 focus:ring-ink"
            />
          </label>
          {error && <p className="text-sm text-red-700 font-serif">{error}</p>}
          {info && <p className="text-sm text-green-800 font-serif">{info}</p>}
          <button type="submit" disabled={loading} className="ink-btn-filled w-full">
            {loading ? "Resetting..." : "Reset password"}
          </button>
        </form>
        <p className="font-hand text-sm text-center">
          <Link to="/auth/login" className="underline">Back to login</Link>
        </p>
      </div>
    </div>
  );
}
