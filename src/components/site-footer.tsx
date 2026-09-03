import robloxLogo from "@/assets/roblox-logo.png";

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-card py-8 text-center">
      <p className="text-xs font-semibold text-muted-foreground">
        Powered by Roblox Creator Awards
      </p>
      <img
        src={robloxLogo}
        alt=""
        aria-hidden="true"
        loading="lazy"
        width={1152}
        height={576}
        className="mx-auto mt-4 h-10 w-auto opacity-10"
      />
    </footer>
  );
}
