import { createServerFn } from "@tanstack/react-start";

type Rec = { title: string; creator: string; genre: string; reason: string };

export const getRecommendations = createServerFn({ method: "POST" })
  .inputValidator((d: { kind: "books" | "movies"; history: string; moods: string[] }) => d)
  .handler(async ({ data }) => {
    const apiKey = process.env.LOVABLE_API_KEY;
    if (!apiKey) throw new Error("AI is not configured.");

    const sys =
      "You are a thoughtful literary/film curator for Jia Mi. Recommend 5 great works the user has likely NOT yet experienced, based on their history and mood. Return ONLY a JSON object: { recommendations: [{ title, creator, genre, reason }] }. The 'creator' field is the author for books or director for movies. 'reason' is one warm sentence beginning with 'Because you liked ...'.";

    const kindLabel = data.kind === "books" ? "books" : "movies";
    const userMsg = `Recommend ${kindLabel}.
Past favorites: ${data.history?.trim() || "(no history — surprise me)"}
Mood: ${data.moods.length ? data.moods.join(", ") : "(any)"}`;

    const resp = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: sys },
          { role: "user", content: userMsg },
        ],
        response_format: { type: "json_object" },
      }),
    });

    if (resp.status === 429) return { error: "Rate limit reached. Try again in a moment.", recommendations: [] as Rec[] };
    if (resp.status === 402) return { error: "AI credits exhausted. Please add credits to continue.", recommendations: [] as Rec[] };
    if (!resp.ok) {
      const t = await resp.text();
      console.error("AI gateway error", resp.status, t);
      return { error: "Couldn't reach the AI. Try again.", recommendations: [] as Rec[] };
    }
    const json = await resp.json();
    const content: string = json.choices?.[0]?.message?.content ?? "{}";
    try {
      const parsed = JSON.parse(content);
      const recs: Rec[] = Array.isArray(parsed.recommendations) ? parsed.recommendations : [];
      return { recommendations: recs.slice(0, 6), error: null as string | null };
    } catch {
      return { recommendations: [] as Rec[], error: "AI returned an unexpected response." };
    }
  });
