import { LOGO_DATA_URI } from "@/assets/logoData";

export function Footer() {
  return (
    <footer className="border-t border-border bg-background py-8">
      <div className="mx-auto grid max-w-7xl grid-cols-[minmax(0,1fr)_auto] items-center gap-4 px-4 sm:px-6">
        <div className="flex min-w-0 items-center gap-3">
          <img
            src={LOGO_DATA_URI}
            alt="SEO Autos Investment Limited logo"
            width={40}
            height={40}
            loading="lazy"
            className="h-10 w-10 shrink-0 object-contain"
          />
          <p className="min-w-0 truncate text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            SEO Autos Investment Limited
          </p>
        </div>
        <div className="text-right text-xs text-muted-foreground">
          <a href="tel:+2348138946058" className="block font-semibold text-foreground">+234 813 894 6058</a>
          <p className="mt-1">© {new Date().getFullYear()}</p>
        </div>

      </div>
    </footer>
  );5
}
