import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Plus, X, RefreshCw, LogIn } from "lucide-react";
import { SketchDivider, SketchPlaceholder } from "@/components/sketch";
import { createRoom, getMyRooms, joinRoom, type Room } from "@/lib/community-api";
import { isAuthenticated } from "@/lib/auth-api";

export const Route = createFileRoute("/communities/")({
  head: () => ({
    meta: [
      { title: "Communities — Story Loom" },
      { name: "description", content: "Find your people. Join real-time chat rooms of readers, watchers and dreamers." },
    ],
  }),
  component: Communities,
});

function Communities() {
  const navigate = useNavigate();
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [showJoin, setShowJoin] = useState(false);
  const authed = isAuthenticated();

  async function reload() {
    if (!authed) { setLoading(false); return; }
    setLoading(true);
    setError(null);
    try {
      const data = await getMyRooms();
      setRooms(Array.isArray(data) ? data : []);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load rooms");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { void reload(); /* eslint-disable-next-line */ }, []);

  return (
    <div className="max-w-6xl mx-auto px-5 pt-10">
      <div className="flex items-start justify-between gap-4 flex-wrap mb-2">
        <h1 className="font-brush text-5xl">Find your people ✦</h1>
        <div className="flex gap-2 flex-wrap">
          <button onClick={() => void reload()} className="ink-btn flex items-center gap-2" disabled={loading}>
            <RefreshCw size={16} strokeWidth={1.5} className={loading ? "animate-spin" : ""} /> Refresh
          </button>
          <button onClick={() => setShowJoin(true)} className="ink-btn flex items-center gap-2">
            <LogIn size={16} strokeWidth={1.5} /> Join by ID
          </button>
          <button onClick={() => setShowCreate(true)} className="ink-btn-filled flex items-center gap-2">
            <Plus size={16} strokeWidth={1.5} /> Create community
          </button>
        </div>
      </div>
      <p className="font-serif italic mb-6">Conversations worth lingering over.</p>

      {!authed && (
        <div className="sketch-border p-6 my-8 font-serif">
          Please <Link to="/auth/login" className="underline">log in</Link> to see your communities and chat in real time.
        </div>
      )}

      {authed && (
        <>
          <SketchDivider />
          <section className="my-8">
            <h2 className="font-brush text-2xl mb-4">Your Communities</h2>

            {loading && <p className="font-serif italic">Loading your rooms…</p>}
            {error && !loading && <p className="font-serif text-red-700">{error}</p>}
            {!loading && !error && rooms.length === 0 && (
              <p className="font-serif italic">
                You haven't joined any rooms yet. Create one, or join by ID.
              </p>
            )}

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {rooms.map((r, i) => (
                <Link
                  key={r.id}
                  to="/communities/$id"
                  params={{ id: r.roomId }}
                  className="sketch-border p-5 space-y-3 lift-hover fade-up block"
                  style={{ animationDelay: `${i * 60}ms` }}
                >
                  <SketchPlaceholder label="Community Art" className="aspect-[16/9]" />
                  <h3 className="font-brush text-xl leading-tight">{r.roomId}</h3>
                  <p className="font-serif italic text-sm">{r.roomDescription}</p>
                  <p className="font-hand text-xs text-ink/80">
                    {r.members?.length ?? 0} members · owner @{r.owner}
                  </p>
                </Link>
              ))}
            </div>
          </section>
        </>
      )}

      {showCreate && (
        <CreateCommunityModal
          onClose={() => setShowCreate(false)}
          onCreated={(room) => {
            setShowCreate(false);
            navigate({ to: "/communities/$id", params: { id: room.roomId } });
          }}
        />
      )}
      {showJoin && (
        <JoinCommunityModal
          onClose={() => setShowJoin(false)}
          onJoined={(roomId) => {
            setShowJoin(false);
            navigate({ to: "/communities/$id", params: { id: roomId } });
          }}
        />
      )}
    </div>
  );
}

function CreateCommunityModal({ onClose, onCreated }: { onClose: () => void; onCreated: (r: Room) => void }) {
  const [roomId, setRoomId] = useState("");
  const [about, setAbout] = useState("");
  const [preview, setPreview] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const onPick = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) setPreview(URL.createObjectURL(f));
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setErr(null);
    try {
      const room = await createRoom({ roomId: roomId.trim(), roomDescription: about.trim() });
      onCreated(room);
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Could not create room");
    } finally {
      setBusy(false);
    }
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
          <label className="font-hand text-sm block mb-1">Picture (local preview only)</label>
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            className="sketch-border w-full aspect-[16/9] flex items-center justify-center overflow-hidden bg-card/40 lift-hover"
          >
            {preview ? (
              <img src={preview} alt="preview" className="w-full h-full object-cover" />
            ) : (
              <span className="font-hand text-ink/70">Upload an image</span>
            )}
          </button>
          <input ref={fileRef} type="file" accept="image/*" onChange={onPick} className="hidden" />
        </div>

        <div>
          <label className="font-hand text-sm block mb-1">Room ID</label>
          <input
            required
            value={roomId}
            onChange={(e) => setRoomId(e.target.value)}
            placeholder="e.g. fantasy-writers"
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

        {err && <p className="text-sm text-red-700 font-serif">{err}</p>}

        <div className="flex justify-end gap-2 pt-2">
          <button type="button" onClick={onClose} className="ink-btn">Cancel</button>
          <button type="submit" disabled={busy} className="ink-btn-filled">
            {busy ? "Creating…" : "Create"}
          </button>
        </div>
      </form>
    </div>
  );
}

function JoinCommunityModal({ onClose, onJoined }: { onClose: () => void; onJoined: (id: string) => void }) {
  const [roomId, setRoomId] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true); setErr(null);
    try {
      await joinRoom(roomId.trim());
      onJoined(roomId.trim());
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Could not join");
    } finally { setBusy(false); }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/40" onClick={onClose}>
      <form onSubmit={submit} onClick={(e) => e.stopPropagation()}
        className="sketch-border bg-parchment paper-texture w-full max-w-md p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-brush text-3xl">Join a room</h2>
          <button type="button" onClick={onClose} className="ink-btn !p-2" aria-label="close">
            <X size={16} strokeWidth={1.5} />
          </button>
        </div>
        <input
          required value={roomId} onChange={(e) => setRoomId(e.target.value)}
          placeholder="Room ID"
          className="sketch-border w-full px-3 py-2 bg-parchment font-serif outline-none"
        />
        {err && <p className="text-sm text-red-700 font-serif">{err}</p>}
        <div className="flex justify-end gap-2">
          <button type="button" onClick={onClose} className="ink-btn">Cancel</button>
          <button type="submit" disabled={busy} className="ink-btn-filled">
            {busy ? "Joining…" : "Join"}
          </button>
        </div>
      </form>
    </div>
  );
}
