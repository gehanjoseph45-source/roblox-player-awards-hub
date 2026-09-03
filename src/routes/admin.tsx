import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";

import { SiteHeader } from "@/components/site-header";
import { getEmbedUrl, setEmbedUrl } from "@/lib/account";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Embed Panel — Roblox Player Awards" },
      {
        name: "description",
        content: "Set the entry page link that loads inside the Participate screen.",
      },
      { property: "og:title", content: "Embed Panel — Roblox Player Awards" },
      {
        property: "og:description",
        content: "Set the entry page link used by the Participate screen.",
      },
    ],
  }),
  component: Admin,
});

function Admin() {
  const [url, setUrl] = useState("");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setUrl(getEmbedUrl());
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      <main className="mx-auto max-w-xl px-4 pb-14 pt-6">
        <h1 className="text-xl font-extrabold text-foreground">Embed Panel</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Paste the link that should open when a player presses Participate.
        </p>

        <form
          className="mt-4 rounded-md border border-border bg-card p-4"
          onSubmit={(e) => {
            e.preventDefault();
            setEmbedUrl(url.trim());
            setSaved(true);
          }}
        >
          <label className="block text-[11px] font-bold uppercase tracking-wide text-muted-foreground">
            Entry page link
            <input
              value={url}
              onChange={(e) => {
                setUrl(e.target.value);
                setSaved(false);
              }}
              placeholder="https://example.com/entry"
              className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm font-normal normal-case tracking-normal text-foreground outline-none focus:border-primary"
            />
          </label>
          <button
            type="submit"
            className="mt-3 rounded-md bg-primary px-4 py-2 text-sm font-bold text-primary-foreground"
          >
            Save link
          </button>
          {saved ? (
            <p className="mt-2 text-xs font-semibold text-muted-foreground">Link saved.</p>
          ) : null}
        </form>

        <p className="mt-3 text-xs text-muted-foreground">
          Some sites block being embedded; those will need to open in a new tab instead.
        </p>
      </main>

      <footer className="border-t border-border bg-card py-6 text-center">
        <p className="text-xs font-semibold text-muted-foreground">
          Powered by Roblox Creator Awards
        </p>
      </footer>
    </div>
  );
}
