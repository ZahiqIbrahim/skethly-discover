import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { CoverImage, SketchDivider } from "@/components/sketch";
import {
  getTrendingBooks,
  getTrendingMovies,
  type CatalogBook,
  type CatalogMovie,
} from "@/lib/catalog-api";

export const Route = createFileRoute("/explore")({
  head: () => ({
    meta: [
      { title: "Explore — Story Loom" },
      { name: "description", content: "Browse trending books and movies." },
    ],
  }),
  component: Explore,
});

const filters = ["All", "Books", "Movies"] as const;
type Filter = (typeof filters)[number];

type Card = {
  key: string;
  title: string;
  subtitle?: string;
  meta?: string;
  cover?: string;
  type: "Book" | "Movie";
};

function bookToCard(b: CatalogBook): Card {
  return {
    key: `b-${b.id}`,
    title: b.title,
    subtitle: b.authorName?.join(", "),
    meta: b.firstPublishYear ? `${b.firstPublishYear}` : undefined,
    cover: b.cover,
    type: "Book",
  };
}

function movieToCard(m: CatalogMovie): Card {
  return {
    key: `m-${m.id}`,
    title: m.title,
    subtitle: m.releaseDate?.slice(0, 4),
    meta: m.voteAverage ? `★ ${m.voteAverage}` : undefined,
    cover: m.posterPath,
    type: "Movie",
  };
}

function Explore() {
  const [filter, setFilter] = useState<Filter>("All");
  const [books, setBooks] = useState<CatalogBook[]>([]);
  const [movies, setMovies] = useState<CatalogMovie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    setLoading(true);
    setError(null);
    Promise.allSettled([getTrendingBooks(), getTrendingMovies()])
      .then(([b, m]) => {
        if (!alive) return;
        if (b.status === "fulfilled") setBooks(b.value);
        if (m.status === "fulfilled") setMovies(m.value);
        if (b.status === "rejected" && m.status === "rejected") {
          setError(b.reason?.message || "Couldn't load trending items.");
        }
      })
      .finally(() => alive && setLoading(false));
    return () => {
      alive = false;
    };
  }, []);

  const cards: Card[] = [
    ...(filter !== "Movies" ? books.map(bookToCard) : []),
    ...(filter !== "Books" ? movies.map(movieToCard) : []),
  ];

  return (
    <div className="max-w-6xl mx-auto px-5 pt-10">
      <h1 className="font-brush text-5xl mb-2">Explore the shelves</h1>
      <p className="font-serif italic mb-6">Trending this week.</p>
      <div className="flex gap-2 flex-wrap mb-8">
        {filters.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={filter === f ? "ink-btn-filled" : "ink-btn"}
          >
            {f}
          </button>
        ))}
      </div>
      <SketchDivider />

      {loading && (
        <p className="font-serif italic py-10 text-center">Gathering trending stories…</p>
      )}
      {error && !loading && (
        <p className="font-serif italic py-10 text-center text-ink/70">{error}</p>
      )}
      {!loading && !error && cards.length === 0 && (
        <p className="font-serif italic py-10 text-center">Nothing trending right now.</p>
      )}

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 py-8">
        {cards.map((c, i) => (
          <div
            key={c.key}
            className="sketch-outline-hover lift-hover space-y-2 fade-up p-2"
            style={{ animationDelay: `${i * 50}ms` }}
          >
            <CoverImage src={c.cover} alt={c.title} />
            <h3 className="font-brush text-lg leading-tight">{c.title}</h3>
            {c.subtitle && <p className="font-hand text-sm text-ink/80">{c.subtitle}</p>}
            <p className="font-serif italic text-xs">
              {c.type}
              {c.meta ? ` · ${c.meta}` : ""}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
