// Local-only account + embed link storage (no backend).

const USER_KEY = "rpa.user";
const EMBED_KEY = "rpa.embedUrl";
const USERS_KEY = "rpa.users";

export type Account = { username: string };

function read<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

export function getUser(): Account | null {
  return read<Account | null>(USER_KEY, null);
}

export function signUp(username: string, password: string): Account {
  const users = read<Record<string, string>>(USERS_KEY, {});
  const key = username.trim().toLowerCase();
  if (users[key]) throw new Error("That username is already taken.");
  users[key] = password;
  window.localStorage.setItem(USERS_KEY, JSON.stringify(users));
  const account = { username: username.trim() };
  window.localStorage.setItem(USER_KEY, JSON.stringify(account));
  return account;
}

export function signIn(username: string, password: string): Account {
  const users = read<Record<string, string>>(USERS_KEY, {});
  const key = username.trim().toLowerCase();
  if (!users[key]) throw new Error("No account found with that username.");
  if (users[key] !== password) throw new Error("Incorrect password.");
  const account = { username: username.trim() };
  window.localStorage.setItem(USER_KEY, JSON.stringify(account));
  return account;
}

export function signOut() {
  window.localStorage.removeItem(USER_KEY);
}

export function getEmbedUrl(): string {
  return read<string>(EMBED_KEY, "");
}

export function setEmbedUrl(url: string) {
  window.localStorage.setItem(EMBED_KEY, JSON.stringify(url));
}
