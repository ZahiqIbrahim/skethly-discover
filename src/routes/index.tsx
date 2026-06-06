import { createFileRoute, Link } from "@tanstack/react-router";
import { Search, BookOpen, Clapperboard, Tv, Smile, Headphones } from "lucide-react";
import { Asterisk, SketchDivider, SketchPlaceholder } from "@/components/sketch";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Jia Mi — Your story awaits" },
      { name: "description", content: "Discover books, movies, series, anime — handpicked for you by AI." },
    ],
  }),
  component: Index,
});

const categories = [
  { label: "Books", Icon: BookOpen },
  { label: "Movies", Icon: Clapperboard },
  { label: "Series", Icon: Tv },
  { label: "Anime", Icon: Smile },
  { label: "Audiobooks", Icon: Headphones },
] as const;

const moods = [
  { label: "Feeling Adventurous", art: "Mountain Sketch" },
  { label: "In the mood for Fantasy", art: "Castle Sketch" },
  { label: "Something Heartwarming", art: "Teacup Sketch" },
  { label: "Need a dose of Mystery", art: "Magnifier Sketch" },
];

function Index() {
  return (
    <div className="max-w-6xl mx-auto px-5 pt-8">
      {/* Hero */}
      <section className="grid lg:grid-cols-2 gap-10 items-center py-10">
        <div className="space-y-6 fade-up">
          <h1 className="leading-[0.95]">
            <span className="font-script text-7xl md:text-8xl block">your</span>
            <span className="font-brush text-6xl md:text-7xl tracking-wide block">STORY AWAITS,</span>
          </h1>
          <p className="font-serif text-lg max-w-md italic">
            Discover books, movies, series, anime and more — recommended just for you by AI.
          </p>
          <div className="sketch-border flex items-center gap-2 px-4 py-2 max-w-lg bg-parchment">
            <input
              type="text"
              placeholder="What do you want to explore today?"
              className="flex-1 bg-transparent outline-none font-serif text-ink placeholder:text-ink/50 py-2"
            />
            <button aria-label="search" className="ink-btn-filled !p-2"><Search size={18} strokeWidth={1.5} /></button>
          </div>
          <div className="flex gap-3 pt-2">
            <Link to="/recommend" className="ink-btn-filled"><Asterisk size={14} /> Recommend me something</Link>
            <Link to="/explore" className="ink-btn">Browse</Link>
          </div>
        </div>
        <SketchPlaceholder label="Bookshop Illustration" className="aspect-[4/3] fade-up" />
      </section>

      <SketchDivider />

      {/* Categories */}
      <section className="py-10">
        <div className="flex items-baseline justify-between mb-6">
          <h2 className="font-brush text-3xl">Explore by</h2>
          <Link to="/explore" className="sketch-hover font-hand text-sm underline underline-offset-4 px-2 py-1">View all</Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
          {categories.map(({ label, Icon }, i) => (
            <Link
              key={label}
              to="/explore"
              className="sketch-border lift-hover p-5 flex flex-col items-center gap-3 text-center fade-up"
              style={{ animationDelay: `${i * 60}ms` }}
            >
              <Icon size={36} strokeWidth={1.4} className="text-ink" />
              <span className="font-hand text-base">{label}</span>
            </Link>
          ))}
        </div>
      </section>

      <SketchDivider />

      {/* Moods */}
      <section className="py-10">
        <div className="flex items-baseline justify-between mb-6">
          <h2 className="font-brush text-3xl">Let AI recommend for your mood</h2>
          <Link to="/recommend" className="sketch-hover font-hand text-sm underline underline-offset-4 px-2 py-1">View all</Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
          {moods.map((m, i) => (
            <Link
              to="/recommend"
              key={m.label}
              className="sketch-border lift-hover p-4 flex flex-col gap-3 fade-up"
              style={{ animationDelay: `${i * 70}ms` }}
            >
              <SketchPlaceholder label={m.art} className="aspect-[4/3]" />
              <p className="font-script text-2xl text-center leading-tight">{m.label}</p>
            </Link>
          ))}
        </div>
      </section>

      <SketchDivider />

      {/* CTA banner */}
      <section className="py-10">
        <div className="sketch-border p-8 md:p-10 grid md:grid-cols-[1.4fr_1fr] gap-8 items-center">
          <div className="space-y-4">
            <h3 className="font-brush text-3xl leading-tight">Join readers, watchers & dreamers.</h3>
            <p className="font-serif italic">Find your people in communities built around the stories you love.</p>
            <Link to="/communities" className="ink-btn-filled">Explore Communities</Link>
          </div>
          <SketchPlaceholder label="Community Scene" className="aspect-[5/4]" />
        </div>
      </section>
    </div>
  );
}
