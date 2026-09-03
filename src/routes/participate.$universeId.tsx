import { Link, createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";

import { RulesList } from "@/components/rules-list";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { getEmbedUrl } from "@/lib/account";

export const Route = createFileRoute("/participate/$universeId")({
  head: () => ({
    meta: [
      { title: "Enter the Award Round — Roblox Player Awards" },
      {
        name: "description",
        content: "Complete your entry for this Roblox award round in the embedded entry page.",
      },
      { property: "og:title", content: "Enter the Award Round — Roblox Player Awards" },
      {
        property: "og:description",
        content: "Complete your award round entry in the embedded entry page.",
      },
    ],
  }),
  component: Participate,
});

function Participate() {
  const { universeId } = Route.useParams();
  const [ready, setReady] = useState(false);
  const [embed, setEmbed] = useState("");

  useEffect(() => {
    setEmbed(getEmbedUrl());
    setReady(true);
  }, []);

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SiteHeader />

      <div className="mx-auto flex w-full max-w-5xl items-center justify-between px-4 py-3">
        <Link
          to="/game/$universeId"
          params={{ universeId }}
          className="text-xs font-bold text-primary"
        >
          Back to game
        </Link>
        <Link to="/admin" className="text-xs font-bold text-muted-foreground">
          Panel
        </Link>
      </div>

      <main className="mx-auto w-full max-w-5xl flex-1 px-4 pb-10">
        {!ready ? null : !embed ? (
          <div className="rounded-md border border-border bg-card p-4">
            <h1 className="text-base font-extrabold text-foreground">No entry link set</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Add the entry page link in the panel and it will load here.
            </p>
            <Link
              to="/admin"
              className="mt-3 inline-block rounded-md bg-primary px-3.5 py-2 text-xs font-bold text-primary-foreground"
            >
              Open panel
            </Link>
          </div>
        ) : (
          <div className="overflow-hidden rounded-md border border-border bg-card">
            <iframe
              src={embed}
              title="Award round entry"
              className="h-[70vh] w-full"
              referrerPolicy="no-referrer"
            />
          </div>
        )}

        <RulesList />
      </main>

      <SiteFooter />
    </div>
  );
}
