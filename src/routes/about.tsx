import { createFileRoute, Link } from "@tanstack/react-router";
import { Asterisk, SketchDivider, SketchPlaceholder } from "@/components/sketch";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — Jia Mi" },
      { name: "description", content: "A handcrafted, AI-powered place to find your next story." },
    ],
  }),
  component: About,
});

function About() {
  return (
    <div className="max-w-3xl mx-auto px-5 pt-12">
      <div className="flex items-center gap-3 mb-4"><Asterisk size={26} /><h1 className="font-brush text-5xl">About Jia Mi</h1></div>
      <p className="font-serif text-lg leading-relaxed mb-6">
        Jia Mi (家秘) means <em>a family secret</em> — the small, quiet recommendations passed
        between people who know you well. We built this as a place to find your next story
        the same way: handpicked, with care, and a little ink on the page.
      </p>
      <SketchPlaceholder label="Café Table Scene" className="aspect-[5/3] my-6" />
      <SketchDivider />
      <h2 className="font-brush text-3xl mt-8 mb-3">How it works</h2>
      <ol className="font-serif space-y-2 list-decimal pl-6">
        <li>Tell us what you've loved before.</li>
        <li>Share your mood, if you feel like it.</li>
        <li>Let the AI pull a few things off the shelf for you.</li>
      </ol>
      <div className="mt-8">
        <Link to="/recommend" className="ink-btn-filled">Try the AI recommender</Link>
      </div>
    </div>
  );
}
