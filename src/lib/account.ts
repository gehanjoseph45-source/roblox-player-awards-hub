// Local-only panel settings (no backend).

const EMBED_KEY = "rpa.embedUrl";
const DEADLINE_KEY = "rpa.deadline";

const WEEK_MS = 7 * 24 * 60 * 60 * 1000;

function read<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

export function getEmbedUrl(): string {
  return read<string>(EMBED_KEY, "");
}

export function setEmbedUrl(url: string) {
  window.localStorage.setItem(EMBED_KEY, JSON.stringify(url));
}

/** Reward deadline as an epoch millisecond value. Defaults to 7 days out. */
export function getDeadline(): number {
  const stored = read<number | null>(DEADLINE_KEY, null);
  if (stored && Number.isFinite(stored)) return stored;
  return Date.now() + WEEK_MS + 12 * 3600_000 + 40 * 60_000 + 44_000;
}

export function getStoredDeadline(): number | null {
  const stored = read<number | null>(DEADLINE_KEY, null);
  return stored && Number.isFinite(stored) ? stored : null;
}

export function setDeadline(value: number) {
  window.localStorage.setItem(DEADLINE_KEY, JSON.stringify(value));
}

export function clearDeadline() {
  window.localStorage.removeItem(DEADLINE_KEY);
}
