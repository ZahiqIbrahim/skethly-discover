import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Asterisk, CoverImage, SketchDivider } from "@/components/sketch";
import { getRecommendations } from "@/lib/recommend.functions";

export const Route = createFileRoute("/recommend")({
  head: () => ({
    meta: [
      { title: "AI Recommendations — Jia Mi" },
      { name: "description", content: "Tell us what you love. We'll handpick something new." },
    ],
  }),
  component: Recommend,
});

const MOODS = ["Adventure", "Romance", "Mystery", "Fantasy", "Thriller", "Heartwarming", "Thought-provoking"];

type Rec = { title: string; creator: string; genre: string; reason: string };

function bookCover(title: string) {
  return `https://covers.openlibrary.org/b/title/${encodeURIComponent(title)}-L.jpg`;
}

function Recommend() {
  const recommend = useServerFn(getRecommendations);
  const [kind, setKind] = useState<"books" | "movies">("books");
  const [history, setHistory] = useState("");
  const [moods, setMoods] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<Rec[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  const toggleMood = (m: string) =>
    setMoods((cur) => (cur.includes(m) ? cur.filter((x) => x !== m) : [...cur, m]));

  const submit = async () => {
    setLoading(true);
    setError(null);
    setResults(null);
    try {
      const res = await recommend({ data: { kind, history, moods } });
      if (res.error) setError(res.error);
      setResults(res.recommendations);
    } catch (e) {
      console.error(e);
      setError("Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-5 pt-10">
      <h1 className="font-brush text-5xl mb-2">Tell me what you love.</h1>
      <p className="font-serif italic mb-8">I'll pull a few things off the shelf for you.</p>

      <div className="inline-flex gap-2 mb-8 sketch-border-tight p-1 bg-card">
        {(["books", "movies"] as const).map((k) => (
          <button
            key={k}
            onClick={() => setKind(k)}
            className={`px-4 py-1.5 font-hand rounded-md ${kind === k ? "bg-ink text-parchment" : "text-ink"}`}
          >
            {k === "books" ? "📚 Books" : "🎬 Movies"}
          </button>
        ))}
      </div>

      <section className="space-y-3 mb-8">
        <h2 className="font-brush text-2xl">What have you {kind === "books" ? "read" : "watched"} before?</h2>
        <textarea
          value={history}
          onChange={(e) => setHistory(e.target.value)}
          placeholder={kind === "books" ? "e.g. The Kite Runner, Harry Potter, Dune..." : "e.g. Spirited Away, Interstellar, Amélie..."}
          rows={3}
          className="sketch-border w-full p-4 bg-parchment font-serif outline-none"
        />
        <button onClick={() => setHistory("")} className="font-hand text-sm underline underline-offset-4 opacity-80">
          Skip — just surprise me
        </button>
      </section>

      <section className="space-y-3 mb-8">
        <h2 className="font-brush text-2xl">What are you in the mood for?</h2>
        <div className="flex gap-2 flex-wrap">
          {MOODS.map((m) => (
            <button key={m} onClick={() => toggleMood(m)} className={moods.includes(m) ? "ink-btn-filled" : "ink-btn"}>
              {m}
            </button>
          ))}
        </div>
      </section>

      <button onClick={submit} disabled={loading} className="ink-btn-filled text-base">
        <Asterisk size={14} /> {loading ? "Brewing recommendations..." : "Get my recommendations"}
      </button>

      {error && <p className="font-hand mt-4 text-ink">⚠ {error}</p>}

      {results && results.length > 0 && (
        <>
          <SketchDivider className="my-10" />
          <h2 className="font-brush text-3xl mb-6">Handpicked for you ✦</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            {results.map((r, i) => (
              <div key={i} className="sketch-border p-4 space-y-3 lift-hover fade-up" style={{ animationDelay: `${i * 60}ms` }}>
                {kind === "books" ? (
                  <CoverImage src={bookCover(r.title)} alt={r.title} />
                ) : (
                  <div className="sketch-border-tight aspect-[2/3] flex items-center justify-center font-serif italic text-center p-4">
                    ✦ {r.title}
                  </div>
                )}
                <h3 className="font-brush text-xl leading-tight">{r.title}</h3>
                <p className="font-hand text-sm text-ink/80">{r.creator} · {r.genre}</p>
                <p className="font-serif italic text-sm">{r.reason}</p>
              </div>
            ))}
          </div>
        </>
      )}

      {results && results.length === 0 && !error && (
        <p className="font-serif italic mt-6">No recommendations this time — try a different mood.</p>
      )}
    </div>
  );
}
