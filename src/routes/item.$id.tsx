import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Bookmark, Share2 } from "lucide-react";
import { Asterisk, CoverImage, SketchDivider, SketchPlaceholder } from "@/components/sketch";
import { getItem, items } from "@/lib/data";

export const Route = createFileRoute("/item/$id")({
  head: ({ params }) => {
    const item = getItem(params.id);
    return {
      meta: [
        { title: `${item.title} — Jia Mi` },
        { name: "description", content: item.description },
        { property: "og:title", content: item.title },
        { property: "og:description", content: item.description },
        ...(item.coverUrl ? [{ property: "og:image", content: item.coverUrl }] : []),
      ],
    };
  },
  component: Detail,
});

function Detail() {
  const { id } = Route.useParams();
  const item = getItem(id);
  const recs = items.filter((i) => i.id !== item.id).slice(0, 5);

  return (
    <div className="max-w-6xl mx-auto px-5 pt-8">
      <div className="flex items-center justify-between mb-6">
        <Link to="/explore" className="ink-btn !p-2" aria-label="back"><ArrowLeft size={18} strokeWidth={1.5} /></Link>
        <div className="flex gap-6 font-hand text-sm">
          <span className="underline underline-offset-4">Overview</span>
          <span className="opacity-70">Recommendations</span>
          <span className="opacity-70">Reviews</span>
          <Link to="/communities" className="opacity-70">Community</Link>
        </div>
        <div className="flex gap-2">
          <button className="ink-btn !p-2"><Bookmark size={18} strokeWidth={1.5} /></button>
          <button className="ink-btn !p-2"><Share2 size={18} strokeWidth={1.5} /></button>
        </div>
      </div>

      <section className="grid md:grid-cols-[260px_1fr_220px] gap-8 items-start py-4">
        <CoverImage src={item.coverUrl} alt={item.title} className="w-full" />
        <div className="space-y-4">
          <h1 className="font-brush text-5xl leading-tight">{item.title}</h1>
          <p className="font-hand text-lg">{item.author}</p>
          <p className="font-serif text-sm">★ {item.rating} ({item.ratings}) | {item.type} | {item.genre}</p>
          <p className="font-serif italic text-lg max-w-xl">{item.description}</p>
          <Link to="/recommend" className="ink-btn"><Asterisk size={14} /> Ask AI about this</Link>
        </div>
        <SketchPlaceholder label="Decorative Floral" className="aspect-[3/4] hidden md:flex" />
      </section>

      <SketchDivider />

      <section className="py-8 max-w-3xl">
        <h2 className="font-brush text-2xl mb-3">ABOUT</h2>
        <p className="font-serif leading-relaxed">{item.about}</p>
        <p className="font-hand text-sm mt-4 text-ink/80">
          {item.pages ? `${item.pages} pages | ` : ""}{item.language} | {item.year}
        </p>
      </section>

      <SketchDivider />

      <section className="py-8">
        <h2 className="font-brush text-2xl mb-5">AI RECOMMENDS</h2>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-5">
          {recs.map((r) => (
            <Link key={r.id} to="/item/$id" params={{ id: r.id }} className="lift-hover space-y-2">
              <CoverImage src={r.coverUrl} alt={r.title} />
              <p className="font-brush text-base leading-tight">{r.title}</p>
              <p className="font-hand text-xs text-ink/80">{r.author}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="py-8">
        <div className="sketch-border p-8 grid md:grid-cols-[1.4fr_1fr] gap-8 items-center">
          <div className="space-y-4">
            <h3 className="font-brush text-2xl">Join communities of readers and start meaningful conversations.</h3>
            <Link to="/communities" className="ink-btn-filled">Explore Communities</Link>
          </div>
          <SketchPlaceholder label="Community Illustration" className="aspect-[5/4]" />
        </div>
      </section>
    </div>
  );
}
