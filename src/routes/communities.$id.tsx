import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowLeft, Send } from "lucide-react";
import { Client, type IMessage } from "@stomp/stompjs";
import { SketchDivider } from "@/components/sketch";
import {
  deleteRoom,
  getCurrentUsername,
  getMessages,
  getRoomDetails,
  getWebSocketUrl,
  leaveRoom,
  type ChatMessage,
  type Room,
} from "@/lib/community-api";
import { getAccessToken, isAuthenticated, refreshAccessToken } from "@/lib/auth-api";

export const Route = createFileRoute("/communities/$id")({
  head: ({ params }) => ({
    meta: [
      { title: `${params.id} — Story Loom` },
      { name: "description", content: `Chat in the ${params.id} community on Story Loom.` },
    ],
  }),
  component: CommunityPage,
});

function avatar(seedName: string) {
  return `https://api.dicebear.com/7.x/thumbs/svg?seed=${encodeURIComponent(seedName)}`;
}

function CommunityPage() {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const [tab, setTab] = useState<"Discussion" | "Members" | "About">("Discussion");
  const [room, setRoom] = useState<Room | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [draft, setDraft] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [wsStatus, setWsStatus] = useState<"connecting" | "connected" | "disconnected" | "error">("disconnected");

  const clientRef = useRef<Client | null>(null);
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const me = getCurrentUsername();
  const authed = isAuthenticated();
  const isOwner = useMemo(() => !!room && !!me && room.owner === me, [room, me]);

  // Load room details + messages
  useEffect(() => {
    if (!authed) return;
    let cancelled = false;
    (async () => {
      try {
        const [r, msgs] = await Promise.all([getRoomDetails(id), getMessages(id)]);
        if (cancelled) return;
        setRoom(r);
        setMessages(Array.isArray(msgs) ? msgs : []);
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : "Failed to load room");
      }
    })();
    return () => { cancelled = true; };
  }, [id, authed]);

  // WebSocket connection
  useEffect(() => {
    if (!authed) return;
    let stopped = false;

    const connect = async () => {
      let token = getAccessToken();
      if (!token) token = await refreshAccessToken();
      if (!token || stopped) return;

      const brokerURL = `${getWebSocketUrl()}?token=${encodeURIComponent(token)}`;
      setWsStatus("connecting");

      const client = new Client({
        brokerURL,
        reconnectDelay: 3000,
        connectHeaders: { token },
        onConnect: () => {
          setWsStatus("connected");
          client.subscribe(`/topic/room/${id}`, (msg: IMessage) => {
            try {
              const data = JSON.parse(msg.body) as { sender: string; content: string; roomId?: string };
              setMessages((prev) => [
                ...prev,
                { sender: data.sender, content: data.content, timeStamp: new Date().toISOString() },
              ]);
            } catch {
              /* ignore */
            }
          });
        },
        onStompError: () => setWsStatus("error"),
        onWebSocketError: () => setWsStatus("error"),
        onDisconnect: () => setWsStatus("disconnected"),
      });
      clientRef.current = client;
      client.activate();
    };

    void connect();
    return () => {
      stopped = true;
      const c = clientRef.current;
      clientRef.current = null;
      if (c) void c.deactivate();
    };
  }, [id, authed]);

  // Autoscroll on new messages
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages.length]);

  const send = () => {
    const content = draft.trim();
    const client = clientRef.current;
    if (!content || !client || !client.connected) return;
    client.publish({
      destination: `/app/chat/${id}`,
      body: JSON.stringify({ content }),
    });
    setDraft("");
  };

  const onLeave = async () => {
    try { await leaveRoom(id); navigate({ to: "/communities" }); }
    catch (e) { setError(e instanceof Error ? e.message : "Failed to leave"); }
  };

  const onDelete = async () => {
    if (!confirm(`Delete "${id}"? This cannot be undone.`)) return;
    try { await deleteRoom(id); navigate({ to: "/communities" }); }
    catch (e) { setError(e instanceof Error ? e.message : "Failed to delete"); }
  };

  if (!authed) {
    return (
      <div className="max-w-2xl mx-auto px-5 py-16 text-center font-serif">
        Please <Link to="/auth/login" className="underline">log in</Link> to view this community.
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-5 pt-8">
      <Link to="/communities" className="ink-btn !p-2 mb-5" aria-label="back">
        <ArrowLeft size={18} strokeWidth={1.5} />
      </Link>

      <div className="sketch-border p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="font-brush text-4xl leading-tight">{room?.roomId ?? id}</h1>
          <p className="font-hand text-sm text-ink/80">
            {room ? `${room.members?.length ?? 0} members · owner @${room.owner}` : "Loading…"}
          </p>
          <p className="font-hand text-xs text-ink/60 mt-1">
            chat: <span className={
              wsStatus === "connected" ? "text-green-700" :
              wsStatus === "error" ? "text-red-700" : "opacity-70"
            }>{wsStatus}</span>
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button onClick={onLeave} className="ink-btn">Leave</button>
          {isOwner && (
            <button onClick={onDelete} className="ink-btn border-red-700 text-red-700">
              Delete community
            </button>
          )}
        </div>
      </div>

      {error && <p className="mt-4 font-serif text-red-700">{error}</p>}

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
          <div ref={scrollRef} className="max-h-[60vh] overflow-y-auto space-y-4 pr-1">
            {messages.length === 0 && (
              <p className="font-serif italic text-ink/70">No messages yet — say hello.</p>
            )}
            {messages.map((m, i) => (
              <div key={m.id ?? i} className="sketch-border p-4 flex gap-3 items-start fade-up" style={{ animationDelay: `${Math.min(i, 8) * 40}ms` }}>
                <img src={avatar(m.sender)} alt={m.sender} className="w-10 h-10 rounded-full border border-ink bg-card" />
                <div className="flex-1">
                  <p className="font-hand text-sm">
                    <span className="font-brush text-base">{m.sender}</span>
                    {m.timeStamp && (
                      <span className="opacity-60"> · {new Date(m.timeStamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
                    )}
                  </p>
                  <p className="font-serif whitespace-pre-wrap">{m.content}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="sketch-border flex items-end gap-2 p-3">
            <textarea
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); }
              }}
              placeholder={wsStatus === "connected" ? "Share your thoughts..." : "Connecting to chat…"}
              rows={2}
              disabled={wsStatus !== "connected"}
              className="flex-1 bg-transparent outline-none font-serif resize-none disabled:opacity-60"
            />
            <button
              onClick={send}
              disabled={wsStatus !== "connected" || !draft.trim()}
              className="ink-btn-filled !p-2 disabled:opacity-50"
              aria-label="send"
            >
              <Send size={18} strokeWidth={1.5} />
            </button>
          </div>
        </div>
      )}

      {tab === "Members" && (
        <div className="py-6 grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4">
          {(room?.members ?? []).map((u) => (
            <div key={u} className="flex flex-col items-center gap-1">
              <img src={avatar(u)} alt={u} className="w-14 h-14 rounded-full border border-ink bg-card" />
              <span className="font-hand text-xs">{u}</span>
            </div>
          ))}
          {(!room || (room.members ?? []).length === 0) && (
            <p className="font-serif italic col-span-full">No members yet.</p>
          )}
        </div>
      )}

      {tab === "About" && (
        <div className="py-6 font-serif space-y-3 max-w-2xl">
          <p>{room?.roomDescription ?? "…"}</p>
          {room?.roomCreatedAt && (
            <p className="italic text-sm text-ink/70">
              Created {new Date(room.roomCreatedAt).toLocaleDateString()}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
