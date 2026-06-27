import { Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Asterisk } from "./sketch";
import { getUsername, isAuthenticated, logout, onAuthChange } from "@/lib/auth-api";

const links = [
  { to: "/", label: "Home" },
  { to: "/explore", label: "Explore" },
  { to: "/communities", label: "Communities" },
  { to: "/about", label: "About" },
] as const;

export function Nav() {
  const navigate = useNavigate();
  const [signedIn, setSignedIn] = useState(false);
  const [username, setUsername] = useState<string | null>(null);

  useEffect(() => {
    setSignedIn(isAuthenticated());
    setUsername(getUsername());
    const off = onAuthChange((v) => {
      setSignedIn(v);
      setUsername(getUsername());
    });
    return () => { off(); };
  }, []);

  async function handleLogout() {
    await logout();
    navigate({ to: "/auth/login" });
  }

  return (
    <header className="w-full border-b border-ink/60 relative z-10">
      <div className="max-w-6xl mx-auto px-5 py-4 flex items-center gap-6">
        <Link to="/" className="flex items-center gap-2">
          <Asterisk size={22} />
          <span className="font-script text-3xl leading-none text-ink">Story Loom</span>
        </Link>
        <nav className="hidden md:flex items-center gap-6 mx-auto">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className="sketch-hover font-hand text-base text-ink hover:text-ink-accent px-2 py-1"
              activeProps={{ className: "sketch-hover font-hand text-base text-ink underline decoration-1 underline-offset-4 px-2 py-1" }}
              activeOptions={{ exact: l.to === "/" }}
            >
              {l.label}
            </Link>
          ))}
        </nav>
        <div className="ml-auto md:ml-0 flex items-center gap-3">
          {signedIn ? (
            <>
              {username && <span className="font-hand text-sm hidden sm:inline">@{username}</span>}
              <button onClick={handleLogout} className="ink-btn text-sm">Log out</button>
            </>
          ) : (
            <>
              <Link to="/auth/login" className="sketch-hover font-hand text-sm hidden sm:inline px-2 py-1">Log in</Link>
              <Link to="/auth/signup" className="ink-btn text-sm">Sign up</Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
