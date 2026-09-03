// Hardcoded award values. Everything is derived from the universe id with a
// fixed formula so a game always shows the same numbers.

const REWARDS = [
  "10,000 Robux",
  "17,500 Robux",
  "25,000 Robux",
  "50,000 Robux",
  "100,000 Robux",
  "Limited Award Trophy + 25,000 Robux",
];

function hash(id: number) {
  let h = 2166136261;
  const s = String(id);
  for (let i = 0; i < s.length; i += 1) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return Math.abs(h);
}

export function participants(universeId: number) {
  const h = hash(universeId);
  const value = 12 + (h % 78); // 12k - 89k
  return `${value}k+`;
}

export function reward(universeId: number) {
  return REWARDS[hash(universeId) % REWARDS.length]!;
}

export function likePercent(upVotes: number, downVotes: number) {
  const total = upVotes + downVotes;
  if (total <= 0) return null;
  return Math.round((upVotes / total) * 100);
}

export function compact(n: number) {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${Math.round(n / 1_000)}K`;
  return String(n);
}
