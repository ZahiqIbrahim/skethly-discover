import { createFileRoute, Link } from "@tanstack/react-router";
import { useRef, useState } from "react";
import { Search, Plus, X, Upload } from "lucide-react";
import { SketchDivider, SketchPlaceholder } from "@/components/sketch";
import { communities } from "@/lib/data";

export const Route = createFileRoute("/communities/")({
  head: () => ({
    meta: [
      { title: "Communities — Story Loom" },
      { name: "description", content: "Find your people. Join communities of readers, watchers and dreamers." },
    ],
  }),
  component: Communities,
});

const cats = ["All", "Books", "Movies", "Series", "Anime"] as const;

function Communities() {
  const [cat, setCat] = useState<(typeof cats)[number]>("All");
  const [q, setQ] = useState("");
  const [showCreate, setShowCreate] = useState(false);
  const list = communities.filter(
    (c) =>
      (cat === "All" || c.category === cat) &&
      c.name.toLowerCase().includes(q.toLowerCase()),
  );

  return (
    <div className="max-w-6xl mx-auto px-5 pt-10">
      <div className="flex items-start justify-between gap-4 flex-wrap mb-2">
        <h1 className="font-brush text-5xl">Find your people ✦</h1>
        <button onClick={() => setShowCreate(true)} className="ink-btn-filled flex items-center gap-2">
          <Plus size={16} strokeWidth={1.5} /> Create community
        </button>
      </div>
      <p className="font-serif italic mb-6">Conversations worth lingering over.</p>

      <section className="mb-10">
        <h2 className="font-brush text-2xl mb-4">Joined Communities</h2>
        <div className="flex gap-4 overflow-x-auto pb-2">
          {communities.slice(0, 4).map((c, i) => (
            <Link
              key={c.id}
              to="/communities/$id"
              params={{ id: c.id }}
              className="sketch-border p-4 min-w-[220px] flex flex-col gap-2 lift-hover fade-up"
              style={{ animationDelay: `${i * 60}ms` }}
            >
              <SketchPlaceholder label="Community Art" className="aspect-[16/9]" />
              <h3 className="font-brush text-lg leading-tight">{c.name}</h3>
              <p className="font-hand text-xs text-ink/80">{c.members} members · {c.posts} posts</p>
            </Link>
          ))}
        </div>
      </section>

      <SketchDivider />

      <div className="sketch-border flex items-center gap-2 px-4 py-2 max-w-lg bg-parchment mb-5 mt-8">
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

      {showCreate && <CreateCommunityModal onClose={() => setShowCreate(false)} />}
    </div>
  );
}

function CreateCommunityModal({ onClose }: { onClose: () => void }) {
  const [name, setName] = useState("");
  const [about, setAbout] = useState("");
  const [preview, setPreview] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const onPick = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) setPreview(URL.createObjectURL(f));
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/40" onClick={onClose}>
      <form
        onSubmit={submit}
        onClick={(e) => e.stopPropagation()}
        className="sketch-border bg-parchment paper-texture w-full max-w-lg p-6 space-y-4 max-h-[90vh] overflow-y-auto"
      >
        <div className="flex items-center justify-between">
          <h2 className="font-brush text-3xl">New community</h2>
          <button type="button" onClick={onClose} className="ink-btn !p-2" aria-label="close">
            <X size={16} strokeWidth={1.5} />
          </button>
        </div>

        <div>
          <label className="font-hand text-sm block mb-1">Picture</label>
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            className="sketch-border w-full aspect-[16/9] flex items-center justify-center overflow-hidden bg-card/40 lift-hover"
          >
            {preview ? (
              <img src={preview} alt="preview" className="w-full h-full object-cover" />
            ) : (
              <span className="font-hand text-ink/70 flex items-center gap-2">
                <Upload size={16} strokeWidth={1.5} /> Upload an image
              </span>
            )}
          </button>
          <input ref={fileRef} type="file" accept="image/*" onChange={onPick} className="hidden" />
        </div>

        <div>
          <label className="font-hand text-sm block mb-1">Name</label>
          <input
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Slow Readers Club"
            className="sketch-border w-full px-3 py-2 bg-parchment font-serif outline-none"
          />
        </div>

        <div>
          <label className="font-hand text-sm block mb-1">About</label>
          <textarea
            required
            value={about}
            onChange={(e) => setAbout(e.target.value)}
            rows={4}
            placeholder="What is this community about?"
            className="sketch-border w-full px-3 py-2 bg-parchment font-serif outline-none resize-none"
          />
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <button type="button" onClick={onClose} className="ink-btn">Cancel</button>
          <button type="submit" className="ink-btn-filled">Create</button>
        </div>
      </form>
    </div>
  );
}
