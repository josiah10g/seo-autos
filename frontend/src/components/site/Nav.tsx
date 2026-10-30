import { useState, useEffect } from "react";
import { Menu, X, ShoppingCart } from "lucide-react";
import { Link, NavLink } from "react-router-dom";
import { LOGO_DATA_URI } from "@/assets/logoData";
import { AuthModals } from "./AuthModals";
import { getStoredCart } from "@/lib/cart";

interface SessionUser {
  email: string;
  fullName: string;
  role: "admin" | "customer";
}

const LOCAL_SESSION_KEY = "seo_autos_active_user";

const baseLinks = [
  { label: "Home", to: "/" },
  { label: "About", to: "/about" },
  { label: "Services", to: "/services" },
  { label: "Contact", to: "/contact" },
];

export function Nav() {
  const [open, setOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<SessionUser | null>(null);
  const [cartCount, setCartCount] = useState<number>(0);

  useEffect(() => {
    const syncUser = () => {
      if (typeof window !== "undefined") {
        const stored = localStorage.getItem(LOCAL_SESSION_KEY);
        if (stored) {
          try {
            setCurrentUser(JSON.parse(stored));
            return;
          } catch {
            // ignore
          }
        }
        setCurrentUser(null);
      }
    };

    const syncCart = () => {
      const items = getStoredCart();
      setCartCount(items.reduce((acc, i) => acc + i.quantity, 0));
    };

    syncUser();
    syncCart();

    window.addEventListener("auth:changed", syncUser);
    window.addEventListener("cart:changed", syncCart);
    window.addEventListener("storage", syncUser);
    window.addEventListener("storage", syncCart);

    return () => {
      window.removeEventListener("auth:changed", syncUser);
      window.removeEventListener("cart:changed", syncCart);
      window.removeEventListener("storage", syncUser);
      window.removeEventListener("storage", syncCart);
    };
  }, []);

  const dashboardLink = currentUser
    ? currentUser.role === "admin"
      ? { label: "Dashboard", to: "/admin" }
      : { label: "Dashboard", to: "/dashboard" }
    : null;

  const links = dashboardLink ? [...baseLinks, dashboardLink] : baseLinks;

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

        {/* Right side aligned on the exact same line: Links followed by Cart and Auth buttons */}
        <div className="hidden items-center gap-8 lg:flex">
          <nav className="flex items-center gap-7">
            {links.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                className={({ isActive }) =>
                  `text-sm font-semibold uppercase tracking-wider transition-colors hover:text-primary ${
                    isActive ? "text-primary font-bold" : "text-muted-foreground"
                  }`
                }
              >
                {l.label}
              </NavLink>
            ))}
          </nav>

          <div className="h-4 w-px bg-border" />

          {/* Cart Icon & Button */}
          <Link
            to="/cart"
            className="relative inline-flex items-center gap-2 rounded-full border border-border px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider text-foreground hover:border-primary/50 hover:bg-muted transition cursor-pointer"
            aria-label="View Cart"
          >
            <ShoppingCart className="h-4 w-4 text-primary" />
            <span>Cart</span>
            {cartCount > 0 && (
              <span className="inline-flex h-5 min-w-[20px] items-center justify-center rounded-full bg-primary px-1.5 text-[10px] font-bold text-primary-foreground">
                {cartCount}
              </span>
            )}
          </Link>

          <AuthModals />
        </div>

        {/* Right side aligned: Mobile Cart + Mobile User Avatar + Hamburger button */}
        <div className="flex items-center gap-2 lg:hidden">
          <Link
            to="/cart"
            className="relative inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-border text-foreground hover:bg-muted transition cursor-pointer"
            aria-label="View Cart"
          >
            <ShoppingCart className="h-5 w-5 text-primary" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-primary px-1 text-[10px] font-bold text-primary-foreground">
                {cartCount}
              </span>
            )}
          </Link>
          {currentUser && <AuthModals />}
          <button
            type="button"
            aria-label="Toggle menu"
            onClick={() => setOpen((v) => !v)}
            className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-border text-foreground hover:bg-muted transition cursor-pointer"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

      </div>

      {open && (
        <nav className="border-t border-border bg-background px-4 pb-5 pt-2 lg:hidden space-y-1">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `block border-b border-border/60 py-3 text-sm font-semibold uppercase tracking-wider ${
                  isActive ? "text-primary font-bold" : "text-foreground"
                }`
              }
            >
              {l.label}
            </NavLink>
          ))}

          {/* Cart link in mobile drawer */}
          <Link
            to="/cart"
            onClick={() => setOpen(false)}
            className="flex items-center justify-between border-b border-border/60 py-3 text-sm font-semibold uppercase tracking-wider text-foreground hover:text-primary"
          >
            <div className="flex items-center gap-2">
              <ShoppingCart className="h-4 w-4 text-primary" />
              <span>Cart</span>
            </div>
            {cartCount > 0 && (
              <span className="rounded-full bg-primary px-2 py-0.5 text-xs font-bold text-primary-foreground">
                {cartCount} items
              </span>
            )}
          </Link>

          {/* Mobile Login / Sign Up inside Hamburg icon dropdown */}
          {!currentUser && (
            <div className="pt-2">
              <AuthModals mobileOnly />
            </div>
          )}
        </nav>
      )}
    </header>
  );
}
