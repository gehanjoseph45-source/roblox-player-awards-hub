import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";

import { GameCard } from "@/components/game-card";
import { SiteHeader } from "@/components/site-header";
import { getGameSections, searchGames } from "@/lib/roblox.functions";

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
  const { data } = useQuery({ queryKey: ["sections"], queryFn: () => getGameSections() });
  const runSearch = useServerFn(searchGames);
  const [term, setTerm] = useState("");
  const [query, setQuery] = useState("");

  const search = useQuery({
    queryKey: ["search", query],
    queryFn: () => runSearch({ data: { query } }),
    enabled: query.trim().length > 0,
  });

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      <main className="mx-auto max-w-6xl px-4 pb-14">
        <section className="py-5">
          <h1 className="text-2xl font-extrabold leading-tight text-foreground">
            Player Awards
          </h1>
          <p className="mt-1 max-w-prose text-sm text-muted-foreground">
            Search a game or pick one from the charts to see its award round.
          </p>

          <form
            className="mt-4 flex gap-2"
            onSubmit={(e) => {
              e.preventDefault();
              setQuery(term);
            }}
          >
            <input
              value={term}
              onChange={(e) => setTerm(e.target.value)}
              placeholder="Search games"
              className="w-full rounded-md border border-border bg-card px-3 py-2.5 text-sm text-foreground outline-none focus:border-primary"
            />
            <button
              type="submit"
              className="rounded-md bg-primary px-4 py-2.5 text-sm font-bold text-primary-foreground"
            >
              Search
            </button>
          </form>
        </section>

        {query.trim() ? (
          <section className="pb-6">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-extrabold text-foreground">
                Results for “{query}”
              </h2>
              <button
                type="button"
                onClick={() => {
                  setQuery("");
                  setTerm("");
                }}
                className="text-xs font-bold text-primary"
              >
                Clear
              </button>
            </div>
            {search.isLoading ? (
              <p className="mt-3 text-sm text-muted-foreground">Loading…</p>
            ) : search.data?.error ? (
              <p className="mt-3 text-sm text-muted-foreground">{search.data.error}</p>
            ) : (search.data?.games.length ?? 0) === 0 ? (
              <p className="mt-3 text-sm text-muted-foreground">No games matched that search.</p>
            ) : (
              <div className="mt-3 grid grid-cols-2 gap-x-3 gap-y-5 sm:grid-cols-4 lg:grid-cols-5">
                {search.data?.games.map((game) => (
                  <div key={game.universeId} className="w-full">
                    <GameCard game={game} />
                  </div>
                ))}
              </div>
            )}
          </section>
        ) : null}

        {data?.error ? (
          <p className="text-sm text-muted-foreground">{data.error}</p>
        ) : (
          data?.sections.map((section) => (
            <section key={section.id} className="pb-7">
              <h2 className="text-base font-extrabold text-foreground">{section.title}</h2>
              <div className="mt-2.5 flex gap-3 overflow-x-auto pb-1">
                {section.games.map((game) => (
                  <GameCard key={game.universeId} game={game} />
                ))}
              </div>
            </section>
          ))
        )}
      </main>

      <footer className="border-t border-border bg-card py-6 text-center">
        <p className="text-xs font-semibold text-muted-foreground">
          Powered by Roblox Creator Awards
        </p>
      </footer>
    </div>
  );
}
