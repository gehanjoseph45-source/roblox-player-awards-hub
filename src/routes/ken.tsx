import { Link, createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";

import { PanelForm } from "@/components/panel-form";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { getSites, type SiteRecord } from "@/lib/account";

export const Route = createFileRoute("/ken")({
  head: () => ({
    meta: [
      { title: "Control Panel — Roblox Player Awards" },
      {
        name: "description",
        content:
          "Set the entry page link and the reward countdown, applied globally across every generated award website.",
      },
      { property: "og:title", content: "Control Panel — Roblox Player Awards" },
      {
        property: "og:description",
        content: "Set the entry link and reward countdown for every award website.",
      },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: Ken,
});

function Ken() {
  const [sites, setSites] = useState<SiteRecord[]>([]);

  useEffect(() => {
    setSites(getSites());
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      <main className="mx-auto max-w-xl px-4 pb-14 pt-6">
        <h1 className="text-xl font-extrabold text-foreground">Control panel</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Saving here updates the main website and is applied globally to every generated website.
        </p>

        <PanelForm global />

        <section className="mt-6 rounded-md border border-border bg-card p-4">
          <h2 className="text-[11px] font-bold uppercase tracking-wide text-muted-foreground">
            Generated websites
          </h2>
          {sites.length === 0 ? (
            <p className="mt-2 text-sm text-muted-foreground">
              None yet. Create one at <Link to="/create" className="font-bold text-primary">/create</Link>.
            </p>
          ) : (
            <ul className="mt-2 space-y-2">
              {sites.map((site) => (
                <li key={site.sitePath} className="text-sm font-semibold text-foreground">
                  <Link
                    to="/s/$site"
                    params={{ site: site.sitePath }}
                    className="text-primary"
                  >
                    /s/{site.sitePath}
                  </Link>
                  <span className="text-muted-foreground"> — panel: </span>
                  <Link
                    to="/s/$site/$adminPath"
                    params={{ site: site.sitePath, adminPath: site.adminPath }}
                    className="text-primary"
                  >
                    /s/{site.sitePath}/{site.adminPath}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>

        <p className="mt-3 text-xs text-muted-foreground">
          Some sites block being embedded; those open in a new tab instead.
        </p>
      </main>

      <SiteFooter />
    </div>
  );
}
