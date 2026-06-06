import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Search } from "lucide-react";
import { SketchDivider, SketchPlaceholder } from "@/components/sketch";
import { communities } from "@/lib/data";

export const Route = createFileRoute("/communities/")({
  head: () => ({
    meta: [
      { title: "Communities — Jia Mi" },
      { name: "description", content: "Find your people. Join communities of readers, watchers and dreamers." },
    ],
  }),
  component: Communities,
});

const cats = ["All", "Books", "Movies", "Series", "Anime"] as const;

function Communities() {
  const [cat, setCat] = useState<(typeof cats)[number]>("All");
  const [q, setQ] = useState("");
  const list = communities.filter(
    (c) =>
      (cat === "All" || c.category === cat) &&
      c.name.toLowerCase().includes(q.toLowerCase()),
  );

  return (
    <div className="max-w-6xl mx-auto px-5 pt-10">
      <h1 className="font-brush text-5xl mb-2">Find your people ✦</h1>
      <p className="font-serif italic mb-6">Conversations worth lingering over.</p>

      <div className="sketch-border flex items-center gap-2 px-4 py-2 max-w-lg bg-parchment mb-5">
        <Search size={18} strokeWidth={1.5} />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search communities..."
          className="flex-1 bg-transparent outline-none font-serif py-2"
        />
      </div>

      <div className="flex gap-2 flex-wrap mb-8">
        {cats.map((c) => (
          <button key={c} onClick={() => setCat(c)} className={cat === c ? "ink-btn-filled" : "ink-btn"}>{c}</button>
        ))}
      </div>

      <SketchDivider />

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 py-8">
        {list.map((c, i) => (
          <div key={c.id} className="sketch-border p-5 space-y-3 lift-hover fade-up" style={{ animationDelay: `${i * 60}ms` }}>
            <SketchPlaceholder label="Community Art" className="aspect-[16/9]" />
            <h3 className="font-brush text-xl leading-tight">{c.name}</h3>
            <p className="font-serif italic text-sm">{c.description}</p>
            <p className="font-hand text-xs text-ink/80">{c.members} members · {c.posts} posts</p>
            <Link to="/communities/$id" params={{ id: c.id }} className="ink-btn text-sm">Join</Link>
          </div>
        ))}
      </div>
    </div>
  );
}
