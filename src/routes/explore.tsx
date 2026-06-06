import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { CoverImage, SketchDivider } from "@/components/sketch";
import { items } from "@/lib/data";

export const Route = createFileRoute("/explore")({
  head: () => ({
    meta: [
      { title: "Explore — Jia Mi" },
      { name: "description", content: "Browse handpicked books, movies, series and anime." },
    ],
  }),
  component: Explore,
});

const filters = ["All", "Books", "Movies"] as const;

function Explore() {
  const [filter, setFilter] = useState<(typeof filters)[number]>("All");
  const list = items.filter((i) => filter === "All" || i.type === filter.slice(0, -1));

  return (
    <div className="max-w-6xl mx-auto px-5 pt-10">
      <h1 className="font-brush text-5xl mb-2">Explore the shelves</h1>
      <p className="font-serif italic mb-6">Stories worth holding close.</p>
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
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 py-8">
        {list.map((item, i) => (
          <Link
            to="/item/$id"
            params={{ id: item.id }}
            key={item.id}
            className="sketch-outline-hover lift-hover space-y-2 fade-up p-2"
            style={{ animationDelay: `${i * 50}ms` }}
          >
            <CoverImage src={item.coverUrl} alt={item.title} />
            <h3 className="font-brush text-lg leading-tight">{item.title}</h3>
            <p className="font-hand text-sm text-ink/80">{item.author}</p>
            <p className="font-serif italic text-xs">★ {item.rating} · {item.genre}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
