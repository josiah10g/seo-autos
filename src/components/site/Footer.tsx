import logo from "@/assets/logo.png.asset.json";

export function Footer() {
  return (
    <footer className="border-t border-border bg-background py-8">
      <div className="mx-auto grid max-w-7xl grid-cols-[minmax(0,1fr)_auto] items-center gap-4 px-4 sm:px-6">
        <div className="flex min-w-0 items-center gap-3">
          <img src={logo.url} alt="" width={40} height={40} loading="lazy" className="h-10 w-10 shrink-0 object-contain" />
          <p className="min-w-0 truncate text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            SEO Autos Investment Limited
          </p>
        </div>
        <p className="text-xs text-muted-foreground">© {new Date().getFullYear()}</p>
      </div>
    </footer>
  );
}
