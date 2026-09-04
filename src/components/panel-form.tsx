import { useEffect, useState } from "react";

import {
  applyGlobally,
  clearDeadline,
  getEmbedUrl,
  getStoredDeadline,
  setDeadline,
  setEmbedUrl,
} from "@/lib/account";

const inputClass =
  "mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm font-normal normal-case tracking-normal text-foreground outline-none focus:border-primary";

export function PanelForm({ scope = "", global = false }: { scope?: string; global?: boolean }) {
  const [url, setUrl] = useState("");
  const [saved, setSaved] = useState(false);
  const [days, setDays] = useState("7");
  const [hours, setHours] = useState("12");
  const [minutes, setMinutes] = useState("40");
  const [seconds, setSeconds] = useState("44");
  const [timerSaved, setTimerSaved] = useState(false);

  useEffect(() => {
    setUrl(getEmbedUrl(scope));
    const stored = getStoredDeadline(scope);
    if (stored) {
      const left = Math.max(0, Math.floor((stored - Date.now()) / 1000));
      setDays(String(Math.floor(left / 86400)));
      setHours(String(Math.floor((left % 86400) / 3600)));
      setMinutes(String(Math.floor((left % 3600) / 60)));
      setSeconds(String(left % 60));
    }
  }, [scope]);

  return (
    <>
      <form
        className="mt-4 rounded-md border border-border bg-card p-4"
        onSubmit={(e) => {
          e.preventDefault();
          setEmbedUrl(url, scope);
          if (global) applyGlobally(url, null);
          setUrl(getEmbedUrl(scope));
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
          <p className="mt-2 text-xs font-semibold text-muted-foreground">
            Link saved{global ? " and applied to every website." : "."}
          </p>
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
          const target = Date.now() + ms;
          setDeadline(target, scope);
          if (global) applyGlobally(null, target);
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
              clearDeadline(scope);
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
          <p className="mt-2 text-xs font-semibold text-muted-foreground">
            Countdown saved{global ? " and applied to every website." : "."}
          </p>
        ) : null}
      </form>
    </>
  );
}
