import { useState } from "react";

import { signIn, signUp, type Account } from "@/lib/account";

type Props = {
  mode: "login" | "signup";
  onClose: () => void;
  onDone: (account: Account) => void;
};

export function AuthDialog({ mode, onClose, onDone }: Props) {
  const [tab, setTab] = useState<"login" | "signup">(mode);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  function submit(event: React.FormEvent) {
    event.preventDefault();
    setError(null);
    try {
      const account = tab === "login" ? signIn(username, password) : signUp(username, password);
      onDone(account);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-foreground/50 sm:items-center">
      <div className="w-full max-w-sm rounded-t-lg border border-border bg-card p-5 sm:rounded-lg">
        <div className="flex items-start justify-between">
          <h2 className="text-lg font-bold text-foreground">
            {tab === "login" ? "Login" : "Sign Up"}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="text-sm font-semibold text-muted-foreground"
          >
            Close
          </button>
        </div>

        <div className="mt-4 flex border-b border-border text-sm font-semibold">
          <button
            type="button"
            onClick={() => setTab("login")}
            className={`-mb-px border-b-2 px-3 pb-2 ${
              tab === "login"
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground"
            }`}
          >
            Login
          </button>
          <button
            type="button"
            onClick={() => setTab("signup")}
            className={`-mb-px border-b-2 px-3 pb-2 ${
              tab === "signup"
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground"
            }`}
          >
            Sign Up
          </button>
        </div>

        <form onSubmit={submit} className="mt-4 space-y-3">
          <label className="block text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Username
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              minLength={3}
              className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm font-normal normal-case tracking-normal text-foreground outline-none focus:border-primary"
            />
          </label>
          <label className="block text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Password
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={4}
              className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm font-normal normal-case tracking-normal text-foreground outline-none focus:border-primary"
            />
          </label>

          {error ? <p className="text-sm text-destructive">{error}</p> : null}

          <button
            type="submit"
            className="w-full rounded-md bg-primary py-2.5 text-sm font-bold text-primary-foreground"
          >
            {tab === "login" ? "Login" : "Create account"}
          </button>
        </form>

        <p className="mt-3 text-xs text-muted-foreground">
          Accounts are stored on this device only.
        </p>
      </div>
    </div>
  );
}
