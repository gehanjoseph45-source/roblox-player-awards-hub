import { createFileRoute } from "@tanstack/react-router";

import { HomeContent } from "@/components/home-content";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { getGameSections } from "@/lib/roblox.functions";

export const Route = createFileRoute("/s/$site")({
  head: () => ({
    meta: [
      { title: "Player Awards — Award Rounds by Game" },
      {
        name: "description",
        content:
          "Browse trending Roblox experiences, check the reward, likes and participant count, and enter this award website's rounds.",
      },
      { property: "og:title", content: "Player Awards" },
      {
        property: "og:description",
        content: "Pick a game, see the reward and participants, then enter the award round.",
      },
    ],
  }),
  loader: ({ context }) =>
    context.queryClient.ensureQueryData({
      queryKey: ["sections"],
      queryFn: () => getGameSections(),
    }),
  component: SiteHome,
});

function SiteHome() {
  const { site } = Route.useParams();

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader site={site} />
      <HomeContent scope={site} />
      <SiteFooter />
    </div>
  );
}
