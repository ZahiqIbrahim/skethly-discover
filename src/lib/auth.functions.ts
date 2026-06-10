import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const schema = z.object({
  username: z.string().trim().min(1).max(50),
});

export const getEmailForUsername = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => schema.parse(data))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const { data: profile, error } = await supabaseAdmin
      .from("profiles")
      .select("id")
      .eq("username", data.username)
      .maybeSingle();

    if (error) throw new Error(error.message);
    if (!profile) return { email: null as string | null };

    const { data: userRes, error: userErr } = await supabaseAdmin.auth.admin.getUserById(profile.id);
    if (userErr) throw new Error(userErr.message);

    return { email: userRes.user?.email ?? null };
  });
