// Local-only settings (no backend). Data is namespaced per generated website.

const WEEK_MS = 7 * 24 * 60 * 60 * 1000;
const DEFAULT_LEFT_MS = WEEK_MS + 12 * 3600_000 + 40 * 60_000 + 44_000;

const SITES_KEY = "rpa.sites";

export type SiteRecord = {
  /** URL path used for the public website, e.g. "my-awards". */
  sitePath: string;
  /** URL path used for that website's own panel, e.g. "my-panel". */
  adminPath: string;
  createdAt: number;
};

/** "" is the main website; anything else is a generated one. */
export type Scope = string;

function embedKey(scope: Scope) {
  return scope ? `rpa.site.${scope}.embedUrl` : "rpa.embedUrl";
}
function deadlineKey(scope: Scope) {
  return scope ? `rpa.site.${scope}.deadline` : "rpa.deadline";
}

function read<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function write(key: string, value: unknown) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(key, JSON.stringify(value));
}

/* ---------- generated websites ---------- */

export function slugify(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/^\/+|\/+$/g, "")
    .replace(/[^a-z0-9-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

export function getSites(): SiteRecord[] {
  return read<SiteRecord[]>(SITES_KEY, []);
}

export function getSite(sitePath: string): SiteRecord | null {
  return getSites().find((s) => s.sitePath === sitePath) ?? null;
}

export function createSite(sitePath: string, adminPath: string): SiteRecord {
  const record: SiteRecord = { sitePath, adminPath, createdAt: Date.now() };
  const next = [...getSites().filter((s) => s.sitePath !== sitePath), record];
  write(SITES_KEY, next);
  return record;
}

/* ---------- entry link ---------- */

export function normalizeUrl(value: string) {
  const url = value.trim();
  if (!url) return "";
  if (/^https?:\/\//i.test(url)) return url;
  return `https://${url.replace(/^\/+/, "")}`;
}

export function getEmbedUrl(scope: Scope = ""): string {
  return read<string>(embedKey(scope), "") || read<string>(embedKey(""), "");
}

export function setEmbedUrl(url: string, scope: Scope = "") {
  write(embedKey(scope), normalizeUrl(url));
}

/* ---------- countdown ---------- */

/** Reward deadline as an epoch millisecond value. Defaults to 7d 12h 40m 44s out. */
export function getDeadline(scope: Scope = ""): number {
  const stored = getStoredDeadline(scope);
  if (stored) return stored;
  return Date.now() + DEFAULT_LEFT_MS;
}

export function getStoredDeadline(scope: Scope = ""): number | null {
  const own = read<number | null>(deadlineKey(scope), null);
  if (own && Number.isFinite(own)) return own;
  const global = read<number | null>(deadlineKey(""), null);
  return global && Number.isFinite(global) ? global : null;
}

export function setDeadline(value: number, scope: Scope = "") {
  write(deadlineKey(scope), value);
}

export function clearDeadline(scope: Scope = "") {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(deadlineKey(scope));
}

/* ---------- global apply (main panel) ---------- */

/** Push the main panel's settings onto every generated website. */
export function applyGlobally(embed: string | null, deadline: number | null) {
  for (const site of getSites()) {
    if (embed !== null) setEmbedUrl(embed, site.sitePath);
    if (deadline !== null) setDeadline(deadline, site.sitePath);
  }
}
