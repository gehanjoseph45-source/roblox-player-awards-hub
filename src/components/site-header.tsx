import { Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";

import { AuthDialog } from "@/components/auth-dialog";
import { getUser, signOut, type Account } from "@/lib/account";

export function SiteHeader() {
  const [account, setAccount] = useState<Account | null>(null);
  const [dialog, setDialog] = useState<"login" | "signup" | null>(null);

  useEffect(() => {
    setAccount(getUser());
  }, []);

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-card">
      <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-2.5">
        <Link to="/" className="flex shrink-0 items-center gap-2">
          <span className="grid size-8 place-items-center rounded-md bg-foreground text-sm font-black text-card">
            RA
          </span>
          <span className="hidden text-sm font-extrabold leading-tight text-foreground sm:block">
            Roblox Player Awards
          </span>
        </Link>

        <div className="ml-auto flex items-center gap-2">
          {account ? (
            <>
              <span className="max-w-24 truncate text-sm font-semibold text-foreground">
                {account.username}
              </span>
              <button
                type="button"
                onClick={() => {
                  signOut();
                  setAccount(null);
                }}
                className="rounded-md border border-border px-3 py-1.5 text-xs font-bold text-foreground"
              >
                Log Out
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={() => setDialog("login")}
                className="rounded-md border border-border px-3.5 py-1.5 text-xs font-bold text-foreground"
              >
                Login
              </button>
              <button
                type="button"
                onClick={() => setDialog("signup")}
                className="rounded-md bg-primary px-3.5 py-1.5 text-xs font-bold text-primary-foreground"
              >
                Sign Up
              </button>
            </>
          )}
        </div>
      </div>

      {dialog ? (
        <AuthDialog
          mode={dialog}
          onClose={() => setDialog(null)}
          onDone={(next) => {
            setAccount(next);
            setDialog(null);
          }}
        />
      ) : null}
    </header>
  );
}

export function useAccountState() {
  const [account, setAccount] = useState<Account | null>(null);
  const navigate = useNavigate();
  useEffect(() => {
    setAccount(getUser());
  }, []);
  return { account, setAccount, navigate };
}
