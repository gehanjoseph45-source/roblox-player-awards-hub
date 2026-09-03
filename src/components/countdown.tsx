import { useEffect, useState } from "react";

import { getDeadline } from "@/lib/account";

function parts(ms: number) {
  const total = Math.max(0, Math.floor(ms / 1000));
  return {
    d: Math.floor(total / 86400),
    h: Math.floor((total % 86400) / 3600),
    m: Math.floor((total % 3600) / 60),
    s: total % 60,
  };
}

export function Countdown() {
  const [target, setTarget] = useState<number | null>(null);
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    setTarget(getDeadline());
    const id = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(id);
  }, []);

  const p = parts(target ? target - now : 0);
  const cells = [
    { value: p.d, label: "Days" },
    { value: p.h, label: "Hours" },
    { value: p.m, label: "Min" },
    { value: p.s, label: "Sec" },
  ];

  return (
    <section className="rounded-lg border border-border bg-card p-4">
      <h2 className="text-center text-sm font-extrabold uppercase tracking-wide text-foreground">
        Time Until Reward
      </h2>
      <div className="mt-3 flex items-stretch justify-center gap-2">
        {cells.map((cell, i) => (
          <div key={cell.label} className="flex items-stretch gap-2">
            <div className="w-16 rounded-md border border-border bg-background py-2 text-center sm:w-20">
              <div className="font-mono text-2xl font-extrabold tabular-nums text-foreground sm:text-3xl">
                {target === null ? "--" : String(cell.value).padStart(2, "0")}
              </div>
              <div className="mt-0.5 text-[10px] font-bold uppercase tracking-wide text-muted-foreground">
                {cell.label}
              </div>
            </div>
            {i < cells.length - 1 ? (
              <span className="self-center text-xl font-extrabold text-muted-foreground">:</span>
            ) : null}
          </div>
        ))}
      </div>
    </section>
  );
}
