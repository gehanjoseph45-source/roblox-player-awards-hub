import { Link, createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";

import { PanelForm } from "@/components/panel-form";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { getSite } from "@/lib/account";

export const Route = createFileRoute("/s/$site/$adminPath")({
  head: () => ({
    meta: [
      { title: "Your Panel — Player Awards" },
      {
        name: "description",
        content: "Set the entry page link and reward countdown for your own award website.",
      },
      { property: "og:title", content: "Your Panel — Player Awards" },
      {
        property: "og:description",
        content: "Set the entry link and reward countdown for your award website.",
      },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: SitePanel;
});

function SitePanel() {
  const { site, adminPath } = Route.useParams();
  const [state, setState] = useState<"loading" | "ok" | "denied">("loading");

  useEffect(() => {
    const record = getSite(site);
    setState(record && record.adminPath === adminPath ? "ok" : "denied");
  }, [site, adminPath]);

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader site={site} />

      <main className="mx-auto max-w-xl px-4 pb-14 pt-6">
        {state === "loading" ? null : state === "denied" ? (
          <>
            <h1 className="text-xl font-extrabold text-foreground">Panel not found</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              This admin path does not match a website created on this device.
            </p>
            <Link
              to="/create"
              className="mt-3 inline-block rounded-md bg-primary px-3.5 py-2 text-xs font-bold text-primary-foreground"
            >
              Create a website
            </Link>
          </>
        ) : (
          <>
            <h1 className="text-xl font-extrabold text-foreground">Panel — /s/{site}</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              These settings only affect your website.
            </p>
            <PanelForm scope={site} />
          </>
        )}
      </main>

      <SiteFooter />
    </div>
  );
}
