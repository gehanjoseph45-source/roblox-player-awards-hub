import { useQuery } from "@tanstack/react-query";
import { Link, createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";

import { RulesList } from "@/components/rules-list";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { compact, likePercent, participants, reward } from "@/lib/awards";
import { getGame } from "@/lib/roblox.functions";

export const Route = createFileRoute("/game/$universeId")({
  head: () => ({
    meta: [
      { title: "Award Round Details — Roblox Player Awards" },
      {
        name: "description",
        content:
          "Reward, likes and participant count for this game's award round, plus the rules and the entry button.",
      },
      { property: "og:title", content: "Award Round Details — Roblox Player Awards" },
      {
        property: "og:description",
        content: "Reward, likes, participants and rules for this Roblox award round.",
      },
    ],
  }),
  component: GameDetail,
});

function GameDetail() {
  const { universeId } = Route.useParams();
  const fetchGame = useServerFn(getGame);

  const { data, isLoading } = useQuery({
    queryKey: ["game", universeId],
    queryFn: () => fetchGame({ data: { universeId: Number(universeId) } }),
  });

  const likes = data ? likePercent(data.upVotes, data.downVotes) : null;

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      <main className="mx-auto max-w-3xl px-4 pb-14 pt-4">
        <Link to="/" className="text-xs font-bold text-primary">
          Back to games
        </Link>

        {isLoading ? (
          <p className="mt-6 text-sm text-muted-foreground">Loading…</p>
        ) : !data ? (
          <p className="mt-6 text-sm text-muted-foreground">
            That game could not be loaded from Roblox.
          </p>
        ) : (
          <>
            <div className="mt-3 overflow-hidden rounded-lg border border-border bg-card">
              <div className="aspect-video w-full bg-muted">
                {data.thumbnail ? (
                  <img src={data.thumbnail} alt={data.name} className="size-full object-cover" />
                ) : null}
              </div>
              <div className="p-4">
                <h1 className="text-xl font-extrabold leading-tight text-foreground">
                  {data.name}
                </h1>
                <p className="mt-1 text-sm font-semibold text-muted-foreground">
                  {compact(data.playerCount)} playing now
                </p>

                <dl className="mt-4 grid grid-cols-3 divide-x divide-border rounded-md border border-border">
                  <div className="px-3 py-3">
                    <dt className="text-[11px] font-bold uppercase tracking-wide text-muted-foreground">
                      Reward
                    </dt>
                    <dd className="mt-1 text-sm font-extrabold text-foreground">
                      {reward(data.universeId)}
                    </dd>
                  </div>
                  <div className="px-3 py-3">
                    <dt className="text-[11px] font-bold uppercase tracking-wide text-muted-foreground">
                      Participants
                    </dt>
                    <dd className="mt-1 text-sm font-extrabold text-foreground">
                      {participants(data.universeId)}
                    </dd>
                  </div>
                  <div className="px-3 py-3">
                    <dt className="text-[11px] font-bold uppercase tracking-wide text-muted-foreground">
                      Likes
                    </dt>
                    <dd className="mt-1 text-sm font-extrabold text-foreground">
                      {likes !== null ? `${likes}%` : "—"}
                    </dd>
                  </div>
                </dl>

                <Link
                  to="/participate/$universeId"
                  params={{ universeId }}
                  search={{ site: undefined }}
                  className="mt-4 block w-full rounded-md bg-primary py-3 text-center text-sm font-bold text-primary-foreground"
                >
                  Participate
                </Link>
              </div>
            </div>

            <RulesList />

            <div className="mt-6 overflow-hidden rounded-lg border border-border bg-card">
              <div className="border-b border-border px-4 py-3">
                <h2 className="text-base font-extrabold text-foreground">🏆 Top 10 Rewards</h2>
                <p className="mt-1 text-xs text-muted-foreground">
                  The top players in this award round receive:
                </p>
              </div>

              <div className="divide-y divide-border">
                {[
                  ["🥇", "1ST", "50K"],
                  ["🥈", "2ND", "25K"],
                  ["🥉", "3RD", "15K"],
                  ["🏅", "4TH", "10K"],
                  ["🎖️", "5TH", "7.5K"],
                  ["⭐", "6TH", "5K"],
                  ["✨", "7TH", "3K"],
                  ["💎", "8TH", "2K"],
                  ["🎁", "9TH", "1.5K"],
                  ["🎉", "10TH", "1K"],
                ].map(([emoji, place, amount]) => (
                  <div
                    key={place}
                    className="flex items-center justify-between px-4 py-3"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-lg">{emoji}</span>
                      <span className="text-sm font-extrabold text-foreground">
                        {place}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-sm font-extrabold text-primary">
                      <svg
                        viewBox="0 0 24 24"
                        aria-label="Robux"
                        className="size-5"
                        fill="currentColor"
                      >
                        <path d="M7.2 3.5 20 7.1v10.8l-12.8 3.6L4 17.8V6.2l3.2-2.7Zm1.5 4.1-1.2 1v7.8l1.2 1 8.3-2.3V10l-8.3-2.4Zm1.1 2.8 5.2 1.5v2.2l-5.2 1.4v-5.1Z" />
                      </svg>
                      <span>{amount}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </main>

      <SiteFooter />
    </div>
  );
}
