import { Link, createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";

import { RulesList } from "@/components/rules-list";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { getEmbedUrl, normalizeUrl } from "@/lib/account";

export const Route = createFileRoute("/participate/$universeId")({
  validateSearch: (search: Record<string, unknown>) => ({
    site: typeof search.site === "string" ? search.site : undefined,
  }),
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
  const { site } = Route.useSearch();
  const [ready, setReady] = useState(false);
  const [embed, setEmbed] = useState("");

  useEffect(() => {
    setEmbed(normalizeUrl(getEmbedUrl(site ?? "")));
    setReady(true);
  }, [site]);

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SiteHeader site={site} />

      <div className="mx-auto flex w-full max-w-[1400px] items-center justify-between px-4 py-3">
        <Link
          to="/game/$universeId"
          params={{ universeId }}
          search={site ? { site } : {}}
          className="text-xs font-bold text-primary"
        >
          Back to game
        </Link>
        {embed ? (
          <a
            href={embed}
            target="_blank"
            rel="noreferrer"
            className="text-xs font-bold text-muted-foreground"
          >
            Open in new tab
          </a>
        ) : null}
      </div>

      <main className="mx-auto w-full max-w-[1400px] flex-1 px-4 pb-10">
        {!ready ? null : !embed ? (
          <div className="rounded-md border border-border bg-card p-4">
            <h1 className="text-base font-extrabold text-foreground">No entry link set</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              The entry page link has not been set yet, so there is nothing to load here.
            </p>
          </div>
        ) : (
          <div className="overflow-hidden rounded-md border border-border bg-card">
            <iframe
              src={embed}
              title="Award round entry"
              className="h-[calc(100vh-120px)] min-h-[640px] w-full border-0"
              allow="clipboard-write; fullscreen; payment; camera; microphone; geolocation"
              referrerPolicy="no-referrer-when-downgrade"
              sandbox="allow-scripts allow-forms allow-popups allow-popups-to-escape-sandbox allow-same-origin allow-downloads allow-modals allow-top-navigation-by-user-activation"
            />
          </div>
        )}

        <RulesList />
      </main>

      <SiteFooter />
    </div>
  );
}
