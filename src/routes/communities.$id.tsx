import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, Send } from "lucide-react";
import { SketchDivider } from "@/components/sketch";
import { communities } from "@/lib/data";

export const Route = createFileRoute("/communities/$id")({
  head: ({ params }) => {
    const c = communities.find((x) => x.id === params.id);
    return {
      meta: [
        { title: `${c?.name ?? "Community"} — Jia Mi` },
        { name: "description", content: c?.description ?? "A community on Jia Mi." },
      ],
    };
  },
  component: CommunityPage,
});

type Message = { user: string; time: string; text: string };

const seed: Message[] = [
  { user: "iris", time: "2h", text: "Just finished chapter 12 — that ending wrecked me." },
  { user: "marlow", time: "1h", text: "Same. The flashback structure is doing so much work here." },
  { user: "june", time: "12m", text: "Reading group tomorrow at 7? I'll bring the tea." },
];

function avatar(seedName: string) {
  return `https://api.dicebear.com/7.x/thumbs/svg?seed=${encodeURIComponent(seedName)}`;
}

function CommunityPage() {
  const { id } = Route.useParams();
  const community = communities.find((c) => c.id === id) ?? communities[0];
  const [tab, setTab] = useState<"Discussion" | "Members" | "About">("Discussion");
  const [messages, setMessages] = useState<Message[]>(seed);
  const [draft, setDraft] = useState("");

  const send = () => {
    if (!draft.trim()) return;
    setMessages((m) => [...m, { user: "you", time: "now", text: draft.trim() }]);
    setDraft("");
  };

  return (
    <div className="max-w-4xl mx-auto px-5 pt-8">
      <Link to="/communities" className="ink-btn !p-2 mb-5" aria-label="back"><ArrowLeft size={18} strokeWidth={1.5} /></Link>

      <div className="sketch-border p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="font-brush text-4xl leading-tight">{community.name}</h1>
          <p className="font-hand text-sm text-ink/80">{community.members} members</p>
        </div>
        <button className="ink-btn-filled w-fit">Joined</button>
      </div>

      <div className="flex gap-6 font-hand text-base mt-6 border-b border-ink/40 pb-2">
        {(["Discussion", "Members", "About"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={tab === t ? "underline underline-offset-4" : "opacity-70"}
          >
            {t}
          </button>
        ))}
      </div>

      <SketchDivider className="mt-2" />

      {tab === "Discussion" && (
        <div className="py-6 space-y-4">
          {messages.map((m, i) => (
            <div key={i} className="sketch-border p-4 flex gap-3 items-start fade-up" style={{ animationDelay: `${i * 50}ms` }}>
              <img src={avatar(m.user)} alt={m.user} className="w-10 h-10 rounded-full border border-ink bg-card" />
              <div className="flex-1">
                <p className="font-hand text-sm">
                  <span className="font-brush text-base">{m.user}</span> <span className="opacity-60">· {m.time}</span>
                </p>
                <p className="font-serif">{m.text}</p>
              </div>
            </div>
          ))}
          <div className="sketch-border flex items-end gap-2 p-3">
            <textarea
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder="Share your thoughts..."
              rows={2}
              className="flex-1 bg-transparent outline-none font-serif resize-none"
            />
            <button onClick={send} className="ink-btn-filled !p-2" aria-label="send"><Send size={18} strokeWidth={1.5} /></button>
          </div>
        </div>
      )}

      {tab === "Members" && (
        <div className="py-6 grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4">
          {["iris", "marlow", "june", "ellis", "noor", "kai", "fern", "wren"].map((u) => (
            <div key={u} className="flex flex-col items-center gap-1">
              <img src={avatar(u)} alt={u} className="w-14 h-14 rounded-full border border-ink bg-card" />
              <span className="font-hand text-xs">{u}</span>
            </div>
          ))}
        </div>
      )}

      {tab === "About" && (
        <div className="py-6 font-serif space-y-3 max-w-2xl">
          <p>{community.description}</p>
          <p className="italic">A slow, generous space for readers and watchers who care about craft.</p>
        </div>
      )}
    </div>
  );
}
