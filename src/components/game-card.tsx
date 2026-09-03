import { Link } from "@tanstack/react-router";

import { compact, likePercent, participants } from "@/lib/awards";
import type { RobloxGame } from "@/lib/roblox.functions";

export function GameCard({ game }: { game: RobloxGame }) {
  const likes = likePercent(game.upVotes, game.downVotes);

  return (
    <Link
      to="/game/$universeId"
      params={{ universeId: String(game.universeId) }}
      className="block w-36 shrink-0 sm:w-44"
    >
      <div className="aspect-square w-full overflow-hidden rounded-lg border border-border bg-muted">
        {game.thumbnail ? (
          <img
            src={game.thumbnail}
            alt={game.name}
            loading="lazy"
            className="size-full object-cover"
          />
        ) : null}
      </div>
      <div className="mt-1.5 line-clamp-2 text-sm font-bold leading-tight text-foreground">
        {game.name}
      </div>
      <div className="mt-1 flex items-center gap-2.5 text-xs font-semibold text-muted-foreground">
        {likes !== null ? <span>{likes}%</span> : null}
        <span>{compact(game.playerCount)}</span>
        <span>{participants(game.universeId)}</span>
      </div>
    </Link>
  );
}
