const RULES = [
  "No cheating of any kind.",
  "No hacks, exploits or third-party scripts.",
  "One entry per player.",
  "Play the game normally until the round ends.",
  "Do not share or sell your entry.",
  "Rewards are sent after the countdown reaches zero.",
];

export function RulesList() {
  return (
    <section className="mt-4 rounded-md border border-border bg-card p-4">
      <h2 className="text-sm font-extrabold uppercase tracking-wide text-foreground">
        Instructions
      </h2>
      <p className="mt-1 text-xs text-muted-foreground">
        They are easy — follow the rules and your entry stays valid.
      </p>
      <ol className="mt-3 space-y-2">
        {RULES.map((rule, i) => (
          <li key={rule} className="flex gap-2.5 text-sm font-semibold text-foreground">
            <span className="grid size-5 shrink-0 place-items-center rounded border border-border text-[11px] font-bold text-muted-foreground">
              {i + 1}
            </span>
            {rule}
          </li>
        ))}
      </ol>
    </section>
  );
}
