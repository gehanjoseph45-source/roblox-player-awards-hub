import { Link, createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";

import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { createSite, getSite, slugify } from "@/lib/account";

export const Route = createFileRoute("/create")({
  head: () => ({
    meta: [
      { title: "Create Your Award Website — Roblox Player Awards" },
      {
        name: "description",
        content:
          "Generate your own copy of the award website: pick a website path and an admin path, then manage your own entry link and countdown.",
      },
      { property: "og:title", content: "Create Your Award Website" },
      {
        property: "og:description",
        content: "Pick a website path and an admin path to generate your own award website.",
      },
    ],
  }),
  component: Create,
});

const inputClass =
  "mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-primary";

function Create() {
  const navigate = useNavigate();
  const [sitePath, setSitePath] = useState("");
  const [adminPath, setAdminPath] = useState("");
  const [error, setError] = useState("");

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      <main className="mx-auto max-w-xl px-4 pb-14 pt-6">
        <h1 className="text-xl font-extrabold text-foreground">Create your website</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          You get the same award website with your own entry link and countdown, plus your own
          panel. Global changes made in the main control panel still reach every website.
        </p>

        <form
          className="mt-4 rounded-md border border-border bg-card p-4"
          onSubmit={(e) => {
            e.preventDefault();
            const site = slugify(sitePath);
            const admin = slugify(adminPath);
            if (!site || !admin) {
              setError("Fill in both paths using letters, numbers or dashes.");
              return;
            }
            if (site === admin) {
              setError("The website path and admin path must be different.");
              return;
            }
            if (getSite(site)) {
              setError("That website path is already taken.");
              return;
            }
            createSite(site, admin);
            void navigate({ to: "/s/$site", params: { site } });
          }}
        >
          <label className="block text-[11px] font-bold uppercase tracking-wide text-muted-foreground">
            Website path
            <input
              value={sitePath}
              onChange={(e) => {
                setSitePath(e.target.value);
                setError("");
              }}
              placeholder="my-awards"
              className={inputClass}
            />
          </label>
          <p className="mt-1 text-xs text-muted-foreground">
            Your website: /s/{slugify(sitePath) || "my-awards"}
          </p>

          <label className="mt-4 block text-[11px] font-bold uppercase tracking-wide text-muted-foreground">
            Admin path
            <input
              value={adminPath}
              onChange={(e) => {
                setAdminPath(e.target.value);
                setError("");
              }}
              placeholder="my-panel"
              className={inputClass}
            />
          </label>
          <p className="mt-1 text-xs text-muted-foreground">
            Your panel: /s/{slugify(sitePath) || "my-awards"}/{slugify(adminPath) || "my-panel"}
          </p>

          {error ? <p className="mt-3 text-xs font-bold text-destructive">{error}</p> : null}

          <button
            type="submit"
            className="mt-4 rounded-md bg-primary px-4 py-2 text-sm font-bold text-primary-foreground"
          >
            Generate website
          </button>
        </form>

        <p className="mt-3 text-xs text-muted-foreground">
          Already have one? <Link to="/" className="font-bold text-primary">Back to games</Link>
        </p>
      </main>

      <SiteFooter />
    </div>
  );
}
