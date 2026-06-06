import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { MobileNav } from "@/components/MobileNav";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="max-w-md text-center sketch-border p-8">
        <h1 className="font-brush text-7xl">404</h1>
        <p className="mt-3 font-serif italic">This page wandered off the shelf.</p>
        <div className="mt-6">
          <Link to="/" className="ink-btn-filled">Back home</Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="max-w-md text-center sketch-border p-8">
        <h1 className="font-brush text-2xl">A page got smudged</h1>
        <p className="mt-2 font-serif italic">Something went wrong on our end.</p>
        <div className="mt-6 flex justify-center gap-2">
          <button onClick={() => { router.invalidate(); reset(); }} className="ink-btn-filled">Try again</button>
          <a href="/" className="ink-btn">Go home</a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Jia Mi — Your story awaits" },
      { name: "description", content: "Handcrafted, AI-powered book and movie discovery." },
      { property: "og:title", content: "Jia Mi" },
      { property: "og:description", content: "Discover books, movies, series and anime — recommended by AI." },
      { property: "og:type", content: "website" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Caveat:wght@400;700&family=Permanent+Marker&family=Architects+Daughter&family=Special+Elite&family=Lora:ital,wght@0,400;0,600;1,400&display=swap",
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  return (
    <QueryClientProvider client={queryClient}>
      <div className="layer-content min-h-screen flex flex-col">
        <Nav />
        <main className="flex-1 pb-24 md:pb-0">
          <Outlet />
        </main>
        <Footer />
        <MobileNav />
      </div>
    </QueryClientProvider>
  );
}
