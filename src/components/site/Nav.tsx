import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { LOGO_DATA_URI } from "@/assets/logoData";
import { AuthModals } from "./AuthModals";

const links = [
  { label: "Home", to: "/" },
  { label: "About", to: "/about" },
  { label: "Services", to: "/services" },
  { label: "Contact", to: "/contact" },
];

export function Nav() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/90 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <Link to="/" className="flex min-w-0 items-center gap-3">
          <img
            src={LOGO_DATA_URI}
            alt="SEO Autos Investment Limited logo"
            width={48}
            height={48}
            className="h-11 w-11 shrink-0 object-contain"
          />
          <span className="min-w-0">
            <span className="block truncate font-display text-lg leading-none tracking-wide text-foreground">
              SEO AUTOS
            </span>
            <span className="block truncate text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              Investment Limited
            </span>
          </span>
        </Link>

        {/* Right side aligned on the exact same line: Links followed by Auth buttons */}
        <div className="hidden items-center gap-8 lg:flex">
          <nav className="flex items-center gap-7">
            {links.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                activeProps={{ className: "text-primary font-bold" }}
                className="text-sm font-semibold uppercase tracking-wider text-muted-foreground transition-colors hover:text-primary"
              >
                {l.label}
              </Link>
            ))}
          </nav>

          <div className="h-4 w-px bg-border" />

          <AuthModals />
        </div>

        <button
          type="button"
          aria-label="Toggle menu"
          onClick={() => setOpen((v) => !v)}
          className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-border text-foreground lg:hidden"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>

      </div>

      {open && (
        <nav className="border-t border-border bg-background px-4 pb-5 pt-2 lg:hidden">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              onClick={() => setOpen(false)}
              activeProps={{ className: "text-primary" }}
              className="block border-b border-border/60 py-3 text-sm font-semibold uppercase tracking-wider text-foreground"
            >
              {l.label}
            </Link>
          ))}
          <div className="pt-4 flex items-center justify-start">
            <AuthModals />
          </div>
        </nav>
      )}
    </header>
  );
}
