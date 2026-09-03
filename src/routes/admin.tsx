import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";

import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import {
  clearDeadline,
  getEmbedUrl,
  getStoredDeadline,
  setDeadline,
  setEmbedUrl,
} from "@/lib/account";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Panel — Roblox Player Awards" },
      {
        name: "description",
        content: "Set the entry page link and the reward countdown used across the site.",
      },
      { property: "og:title", content: "Panel — Roblox Player Awards" },
      {
        property: "og:description",
        content: "Set the entry page link and reward countdown.",
      },
    ],
  }),
  component: Admin,
});

function Admin() {
  const [url, setUrl] = useState("");
  const [saved, setSaved] = useState(false);
  const [days, setDays] = useState("7");
  const [hours, setHours] = useState("12");
  const [minutes, setMinutes] = useState("40");
  const [seconds, setSeconds] = useState("44");
  const [timerSaved, setTimerSaved] = useState(false);

  useEffect(() => {
    setUrl(getEmbedUrl());
    const stored = getStoredDeadline();
    if (stored) {
      const left = Math.max(0, Math.floor((stored - Date.now()) / 1000));
      setDays(String(Math.floor(left / 86400)));
      setHours(String(Math.floor((left % 86400) / 3600)));
      setMinutes(String(Math.floor((left % 3600) / 60)));
      setSeconds(String(left % 60));
    }
  }, []);

  const inputClass =
    "mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm font-normal normal-case tracking-normal text-foreground outline-none focus:border-primary";

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      <main className="mx-auto max-w-xl px-4 pb-14 pt-6">
        <h1 className="text-xl font-extrabold text-foreground">Panel</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Set the entry link and the reward countdown.
        </p>

        <form
          className="mt-4 rounded-md border border-border bg-card p-4"
          onSubmit={(e) => {
            e.preventDefault();
            setEmbedUrl(url.trim());
            setSaved(true);
          }}
        >
          <label className="block text-[11px] font-bold uppercase tracking-wide text-muted-foreground">
            Entry page link
            <input
              value={url}
              onChange={(e) => {
                setUrl(e.target.value);
                setSaved(false);
              }}
              placeholder="https://example.com/entry"
              className={inputClass}
            />
          </label>
          <button
            type="submit"
            className="mt-3 rounded-md bg-primary px-4 py-2 text-sm font-bold text-primary-foreground"
          >
            Save link
          </button>
          {saved ? (
            <p className="mt-2 text-xs font-semibold text-muted-foreground">Link saved.</p>
          ) : null}
        </form>

        <form
          className="mt-4 rounded-md border border-border bg-card p-4"
          onSubmit={(e) => {
            e.preventDefault();
            const ms =
              (Number(days) * 86400 +
                Number(hours) * 3600 +
                Number(minutes) * 60 +
                Number(seconds)) *
              1000;
            setDeadline(Date.now() + ms);
            setTimerSaved(true);
          }}
        >
          <h2 className="text-[11px] font-bold uppercase tracking-wide text-muted-foreground">
            Time until reward
          </h2>
          <div className="mt-2 grid grid-cols-4 gap-2">
            {(
              [
                ["Days", days, setDays],
                ["Hours", hours, setHours],
                ["Min", minutes, setMinutes],
                ["Sec", seconds, setSeconds],
              ] as const
            ).map(([label, value, set]) => (
              <label
                key={label}
                className="block text-[11px] font-bold uppercase tracking-wide text-muted-foreground"
              >
                {label}
                <input
                  type="number"
                  min={0}
                  value={value}
                  onChange={(e) => {
                    set(e.target.value);
                    setTimerSaved(false);
                  }}
                  className={inputClass}
                />
              </label>
            ))}
          </div>
          <div className="mt-3 flex gap-2">
            <button
              type="submit"
              className="rounded-md bg-primary px-4 py-2 text-sm font-bold text-primary-foreground"
            >
              Save countdown
            </button>
            <button
              type="button"
              onClick={() => {
                clearDeadline();
                setDays("7");
                setHours("12");
                setMinutes("40");
                setSeconds("44");
                setTimerSaved(false);
              }}
              className="rounded-md border border-border px-4 py-2 text-sm font-bold text-foreground"
            >
              Reset to 1 week
            </button>
          </div>
          {timerSaved ? (
            <p className="mt-2 text-xs font-semibold text-muted-foreground">Countdown saved.</p>
          ) : null}
        </form>

        <p className="mt-3 text-xs text-muted-foreground">
          Some sites block being embedded; those will need to open in a new tab instead.
        </p>
      </main>

      <SiteFooter />
    </div>
  );
}
