import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";

const search = z.object({ email: z.string().email().optional() });

export const Route = createFileRoute("/auth/verify")({
  validateSearch: search,
  head: () => ({
    meta: [
      { title: "Verify email — Jia Mi" },
      { name: "description", content: "Enter the code we sent to your email." },
    ],
  }),
  component: VerifyPage,
});

function VerifyPage() {
  const { email: emailFromSearch } = Route.useSearch();
  const navigate = useNavigate();
  const [email, setEmail] = useState(emailFromSearch ?? "");
  const [token, setToken] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setInfo(null);
    setLoading(true);
    try {
      const { error: verifyError } = await supabase.auth.verifyOtp({
        email: email.trim(),
        token: token.trim(),
        type: "email",
      });
      if (verifyError) throw verifyError;
      navigate({ to: "/" });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Invalid code.");
    } finally {
      setLoading(false);
    }
  }

  async function resend() {
    setError(null);
    setInfo(null);
    try {
      const { error: resendError } = await supabase.auth.resend({
        type: "signup",
        email: email.trim(),
      });
      if (resendError) throw resendError;
      setInfo("Code resent. Check your inbox.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not resend code.");
    }
  }

  return (
    <div className="max-w-md mx-auto px-5 py-12">
      <div className="sketch-border p-8 space-y-6">
        <div>
          <h1 className="font-brush text-4xl">Verify email</h1>
          <p className="font-serif italic text-sm mt-1">Enter the code we sent to your inbox.</p>
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
          <label className="block space-y-1">
            <span className="font-hand text-sm">Verification code</span>
            <input
              type="text"
              inputMode="numeric"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              required
              className="w-full px-3 py-2 bg-transparent border border-ink/60 rounded-md font-serif tracking-widest focus:outline-none focus:ring-1 focus:ring-ink"
            />
          </label>
          {error && <p className="text-sm text-red-700 font-serif">{error}</p>}
          {info && <p className="text-sm text-green-800 font-serif">{info}</p>}
          <button type="submit" disabled={loading} className="ink-btn-filled w-full">
            {loading ? "Verifying..." : "Verify & continue"}
          </button>
        </form>
        <div className="flex justify-between font-hand text-sm">
          <button type="button" onClick={resend} className="underline">Resend code</button>
          <Link to="/auth/login" className="underline">Back to login</Link>
        </div>
      </div>
    </div>
  );
}
