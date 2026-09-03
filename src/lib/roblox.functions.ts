import { createServerFn } from "@tanstack/react-start";

export type RobloxGame = {
  universeId: number;
  rootPlaceId: number;
  name: string;
  playerCount: number;
  upVotes: number;
  downVotes: number;
  thumbnail: string | null;
};

export type GameSection = {
  id: string;
  title: string;
  games: RobloxGame[];
};

const SESSION_ID = "00000000-0000-0000-0000-000000000000";

async function attachThumbnails(games: RobloxGame[]): Promise<RobloxGame[]> {
  const ids = games.map((g) => g.universeId);
  if (ids.length === 0) return games;
  try {
    const res = await fetch(
      `https://thumbnails.roblox.com/v1/games/multiget/thumbnails?universeIds=${ids.join(
        ",",
      )}&size=768x432&format=Png&isCircular=false`,
    );
    if (!res.ok) return games;
    const json = (await res.json()) as {
      data?: { universeId: number; thumbnails?: { imageUrl?: string }[] }[];
    };
    const map = new Map<number, string>();
    for (const entry of json.data ?? []) {
      const url = entry.thumbnails?.[0]?.imageUrl;
      if (url) map.set(entry.universeId, url);
    }
    return games.map((g) => ({ ...g, thumbnail: map.get(g.universeId) ?? null }));
  } catch {
    return games;
  }
}

const WANTED_SORTS = ["top-trending", "top-playing-now", "up-and-coming", "top-revisited"];

export const getGameSections = createServerFn({ method: "GET" }).handler(
  async (): Promise<{ sections: GameSection[]; error: string | null }> => {
    try {
      const res = await fetch(
        `https://apis.roblox.com/explore-api/v1/get-sorts?sessionId=${SESSION_ID}`,
      );
      if (!res.ok) throw new Error(`sorts ${res.status}`);
      const json = (await res.json()) as {
        sorts?: {
          sortId?: string;
          sortDisplayName?: string;
          games?: {
            universeId: number;
            rootPlaceId: number;
            name: string;
            playerCount: number;
            totalUpVotes: number;
            totalDownVotes: number;
          }[];
        }[];
      };

      const raw = (json.sorts ?? []).filter(
        (s) => s.sortId && WANTED_SORTS.includes(s.sortId) && (s.games?.length ?? 0) > 0,
      );

      const sections: GameSection[] = [];
      for (const sortId of WANTED_SORTS) {
        const sort = raw.find((s) => s.sortId === sortId);
        if (!sort) continue;
        const games = await attachThumbnails(
          (sort.games ?? []).slice(0, 12).map((g) => ({
            universeId: g.universeId,
            rootPlaceId: g.rootPlaceId,
            name: g.name,
            playerCount: g.playerCount,
            upVotes: g.totalUpVotes,
            downVotes: g.totalDownVotes,
            thumbnail: null,
          })),
        );
        sections.push({
          id: sortId,
          title: sort.sortDisplayName || sortId,
          games,
        });
      }

      if (sections.length === 0) throw new Error("no sorts returned");
      return { sections, error: null };
    } catch {
      return { sections: [], error: "Roblox charts are unavailable right now." };
    }
  },
);

export const searchGames = createServerFn({ method: "GET" })
  .inputValidator((input: { query: string }) => ({ query: String(input.query ?? "").slice(0, 80) }))
  .handler(async ({ data }): Promise<{ games: RobloxGame[]; error: string | null }> => {
    if (!data.query.trim()) return { games: [], error: null };
    try {
      const res = await fetch(
        `https://apis.roblox.com/search-api/omni-search?searchQuery=${encodeURIComponent(
          data.query,
        )}&pageType=all&sessionId=${SESSION_ID}`,
      );
      if (!res.ok) throw new Error(`search ${res.status}`);
      const json = (await res.json()) as {
        searchResults?: {
          contentGroupType?: string;
          contents?: {
            universeId: number;
            rootPlaceId: number;
            name: string;
            playerCount: number;
            totalUpVotes: number;
            totalDownVotes: number;
          }[];
        }[];
      };
      const flat = (json.searchResults ?? [])
        .filter((r) => r.contentGroupType === "Game")
        .flatMap((r) => r.contents ?? [])
        .slice(0, 24)
        .map((g) => ({
          universeId: g.universeId,
          rootPlaceId: g.rootPlaceId,
          name: g.name,
          playerCount: g.playerCount,
          upVotes: g.totalUpVotes,
          downVotes: g.totalDownVotes,
          thumbnail: null,
        }));
      return { games: await attachThumbnails(flat), error: null };
    } catch {
      return { games: [], error: "Search is unavailable right now." };
    }
  });

export const getGame = createServerFn({ method: "GET" })
  .inputValidator((input: { universeId: number }) => ({ universeId: Number(input.universeId) }))
  .handler(async ({ data }): Promise<RobloxGame | null> => {
    try {
      const res = await fetch(
        `https://games.roblox.com/v1/games?universeIds=${data.universeId}`,
      );
      if (!res.ok) throw new Error(`game ${res.status}`);
      const json = (await res.json()) as {
        data?: {
          id: number;
          rootPlaceId: number;
          name: string;
          playing: number;
          favoritedCount: number;
        }[];
      };
      const g = json.data?.[0];
      if (!g) return null;

      let upVotes = 0;
      let downVotes = 0;
      try {
        const vres = await fetch(
          `https://games.roblox.com/v1/games/votes?universeIds=${data.universeId}`,
        );
        if (vres.ok) {
          const vjson = (await vres.json()) as {
            data?: { upVotes: number; downVotes: number }[];
          };
          upVotes = vjson.data?.[0]?.upVotes ?? 0;
          downVotes = vjson.data?.[0]?.downVotes ?? 0;
        }
      } catch {
        /* votes optional */
      }

      const [withThumb] = await attachThumbnails([
        {
          universeId: g.id,
          rootPlaceId: g.rootPlaceId,
          name: g.name,
          playerCount: g.playing,
          upVotes,
          downVotes,
          thumbnail: null,
        },
      ]);
      return withThumb ?? null;
    } catch {
      return null;
    }
  });
