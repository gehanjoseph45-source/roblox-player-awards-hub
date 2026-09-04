import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";

function getSupabaseAdmin() {
  const url = process.env['SUPABASE_URL'];
  const key = process.env['SUPABASE_SECRET_KEY'];

  if (!url || !key) {
    throw new Error("Supabase server environment variables are missing.");
  }

  return createClient(url, key, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

export const getSiteSettings = createServerFn({
  method: "GET",
})
  .inputValidator((input: { sitePath: string }) => ({
    sitePath: input.sitePath,
  }))
  .handler(async ({ data }) => {
    const supabase = getSupabaseAdmin();

    const { data: settings, error } = await supabase
      .from("site_settings")
      .select("entry_url, deadline")
      .eq("site_path", data.sitePath)
      .maybeSingle();

    if (error) throw new Error(error.message);

    return {
      entryUrl: settings?.entry_url ?? "",
      deadline: settings?.deadline ?? null,
    };
  });

export const updateSiteSettings = createServerFn({
  method: "POST",
})
  .inputValidator(
    (input: {
      sitePath: string;
      entryUrl?: string;
      deadline?: number | null;
    }) => ({
      sitePath: input.sitePath,
      entryUrl: input.entryUrl,
      deadline: input.deadline,
    }),
  )
  .handler(async ({ data }) => {
    const supabase = getSupabaseAdmin();

    const update: {
      site_path: string;
      entry_url?: string;
      deadline?: number | null;
      updated_at: string;
    } = {
      site_path: data.sitePath,
      updated_at: new Date().toISOString(),
    };

    if (data.entryUrl !== undefined) {
      update.entry_url = data.entryUrl.trim();
    }

    if (data.deadline !== undefined) {
      update.deadline = data.deadline;
    }

    const { data: saved, error } = await supabase
      .from("site_settings")
      .upsert(update, { onConflict: "site_path" })
      .select("entry_url, deadline")
      .single();

    if (error) throw new Error(error.message);

    return {
      entryUrl: saved.entry_url ?? "",
      deadline: saved.deadline ?? null,
    };
  });
