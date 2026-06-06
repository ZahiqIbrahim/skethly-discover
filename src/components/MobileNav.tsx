import { Link } from "@tanstack/react-router";
import { Home, Compass, Users, User } from "lucide-react";

const items = [
  { to: "/", label: "Home", Icon: Home },
  { to: "/explore", label: "Explore", Icon: Compass },
  { to: "/communities", label: "Community", Icon: Users },
  { to: "/about", label: "Profile", Icon: User },
] as const;

export function MobileNav() {
  return (
    <nav className="md:hidden fixed bottom-3 left-3 right-3 z-40 sketch-border bg-parchment-dark/95 backdrop-blur px-3 py-2 flex justify-between">
      {items.map(({ to, label, Icon }) => (
        <Link
          key={to}
          to={to}
          className="flex-1 flex flex-col items-center gap-0.5 py-1 font-hand text-[11px] text-ink"
          activeOptions={{ exact: to === "/" }}
        >
          <Icon size={20} strokeWidth={1.5} />
          {label}
        </Link>
      ))}
    </nav>
  );
}
