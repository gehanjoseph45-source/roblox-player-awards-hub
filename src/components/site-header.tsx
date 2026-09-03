import { Link } from "@tanstack/react-router";

import robloxLogo from "@/assets/roblox-logo.png";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-card">
      <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-2.5">
        <Link to="/" className="flex shrink-0 items-center gap-2.5">
          <img
            src={robloxLogo}
            alt="Roblox"
            width={1152}
            height={576}
            className="h-5 w-auto"
          />
          <span className="hidden text-sm font-extrabold leading-tight text-foreground sm:block">
            Player Awards
          </span>
        </Link>

        <nav className="ml-auto flex items-center gap-4 text-xs font-bold">
          <Link to="/" className="text-foreground">
            Games
          </Link>
          <Link to="/admin" className="text-muted-foreground">
            Panel
          </Link>
        </nav>
      </div>
    </header>
  );
}
