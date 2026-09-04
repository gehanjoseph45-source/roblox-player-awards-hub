import { createFileRoute } from "@tanstack/react-router";

import { HomeContent } from "@/components/home-content";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { getGameSections } from "@/lib/roblox.functions";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Roblox Player Awards — Enter Award Rounds by Game" },
      {
        name: "description",
        content:
          "Browse trending Roblox experiences, check the reward, likes and participant count, and enter the award round for the game you play.",
      },
      { property: "og:title", content: "Roblox Player Awards" },
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
  component: Home,
});

function Home() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <HomeContent />
      <SiteFooter />
    </div>
  );
}
