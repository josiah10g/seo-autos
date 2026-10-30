import { useState, useEffect } from "react";
import { Phone, Check, Sparkles, Calendar, ShoppingCart } from "lucide-react";
import { WhatsAppLink } from "./WhatsAppButton";
import { Reveal } from "./Reveal";
import { BookingModal } from "./BookingModal";
import { db, type EngineListing, SEED_VEHICLES } from "@/lib/supabase";
import { addToCart, formatNaira } from "@/lib/cart";
import { toast } from "sonner";

export { type EngineListing, EngineShowcase as VehicleShowcase };

export function EngineShowcase() {
  const [filter, setFilter] = useState<"All" | "Sedan" | "SUV">("All");
  const [engines, setEngines] = useState<EngineListing[]>(SEED_VEHICLES);
  const [selectedEngineForBooking, setSelectedEngineForBooking] = useState<EngineListing | null>(null);

  useEffect(() => {
    let isMounted = true;
    db.getEngines().then((data) => {
      if (isMounted && data && data.length > 0) {
        setEngines(data);
      }
    });
    return () => {
      isMounted = false;
    };
  }, []);

  const filteredEngines =
    filter === "All"
      ? engines.filter((v) => v.isAvailable !== false)
      : engines.filter((v) => v.isAvailable !== false && v.category === filter);

  return (
    <section id="inventory" className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
      <Reveal className="mx-auto max-w-3xl text-center">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3.5 py-1 text-xs font-bold uppercase tracking-[0.22em] text-primary">
          <Sparkles className="h-3.5 w-3.5" /> Direct Stock &amp; Tested Powertrains
        </span>
        <h2 className="mt-3 font-display text-3xl font-bold uppercase tracking-tight text-foreground sm:text-5xl">
          Available Honda &amp; Acura Engines
        </h2>
        <p className="mt-3 text-base text-muted-foreground sm:text-lg">
          Explore genuine tested engines, VTEC blocks, V6 powertrains and core internals available at SEO Autos Investment Limited. Click photos to see full assembly angles, book an inspection, or enquire directly.
        </p>

        {/* Filter buttons */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
          {[
            { id: "All", label: "All Engines & Parts" },
            { id: "Sedan", label: "4-Cylinder / VTEC" },
            { id: "SUV", label: "V6 Powertrains" },
          ].map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setFilter(cat.id as any)}
              className={`rounded-full px-5 py-2 text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                filter === cat.id
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "border border-border bg-card text-muted-foreground hover:border-primary/50 hover:text-foreground"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </Reveal>

      <div className="mt-12 space-y-16">
        {filteredEngines.length === 0 ? (
          <div className="py-12 text-center text-muted-foreground">
            No engines found in this category. Check back soon or request a custom engine import.
          </div>
        ) : (
          filteredEngines.map((engine, idx) => (
            <EngineCard
              key={engine.id}
              engine={engine}
              reversed={idx % 2 === 1}
              onBookVisit={() => setSelectedEngineForBooking(engine)}
            />
          ))
        )}
      </div>

      {/* Booking Modal */}
      <BookingModal
        engine={selectedEngineForBooking}
        isOpen={Boolean(selectedEngineForBooking)}
        onClose={() => setSelectedEngineForBooking(null)}
      />

      {/* Direct assistance banner */}
      <Reveal className="mt-16">
        <div className="rounded-2xl border border-border bg-gradient-to-r from-card via-card to-secondary/15 p-8 shadow-card sm:p-10">
          <div className="flex flex-col items-center justify-between gap-6 text-center md:flex-row md:text-left">
            <div>
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-primary">Need a specific engine code?</span>
              <h3 className="mt-2 font-display text-2xl font-bold uppercase text-foreground sm:text-3xl">
                Looking for another Honda or Acura engine?
              </h3>
              <p className="mt-2 max-w-xl text-sm text-muted-foreground">
                We regularly import and supply J35, J37 V6 engines, K24, K20, R20 and Earth Dreams powertrains. Contact our engineering team with your car model or VIN.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3 shrink-0">
              <a
                href="tel:+2348138946058"
                className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-bold uppercase tracking-wide text-primary-foreground transition-transform hover:scale-105 shadow-brand"
              >
                <Phone className="h-4 w-4" /> Call +234 813 894 6058
              </a>
              <WhatsAppLink
                text={`Hello SEO Autos, I want to enquire about engine models in stock.`}
                className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-6 py-3 text-sm font-bold uppercase tracking-wide text-foreground transition-colors hover:bg-muted"
              >
                Chat on WhatsApp
              </WhatsAppLink>
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}

function EngineCard({
  engine,
  reversed = false,
  onBookVisit,
}: {
  engine: EngineListing;
  reversed?: boolean;
  onBookVisit: () => void;
}) {
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const checkAuth = () => {
      if (typeof window !== "undefined") {
        const user = localStorage.getItem("seo_autos_active_user");
        setIsLoggedIn(Boolean(user));
      }
    };
    checkAuth();
    window.addEventListener("auth:changed", checkAuth);
    window.addEventListener("storage", checkAuth);
    return () => {
      window.removeEventListener("auth:changed", checkAuth);
      window.removeEventListener("storage", checkAuth);
    };
  }, []);

  const images = engine.images && engine.images.length > 0 ? engine.images : [
    { src: "/favicon.png", alt: engine.name, label: "Photo" }
  ];
  const activeImage = images[activeImageIndex] ?? images[0] ?? { src: "/favicon.png", alt: engine.name, label: "Photo" };

  const itemPrice = engine.price || 287500;

  const handleAddToCart = () => {
    addToCart({
      id: engine.id,
      name: engine.name,
      price: itemPrice,
      category: engine.category,
      image: images[0]?.src,
    });
    toast.success(`Added ${engine.name} to cart!`, {
      action: {
        label: "View Cart",
        onClick: () => {
          window.location.href = "/cart";
        },
      },
    });
  };

  return (
    <Reveal>
      <div className="group overflow-hidden rounded-2xl border border-border bg-card shadow-card transition-all duration-300 hover:border-primary/30 hover:shadow-xl">
        <div className={`grid gap-8 lg:grid-cols-12 lg:items-center ${reversed ? "lg:grid-flow-dense" : ""}`}>
          
          {/* Gallery side */}
          <div className={`space-y-4 p-5 sm:p-6 lg:col-span-7 ${reversed ? "lg:col-start-6" : ""}`}>
            {/* Main picture display */}
            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl border border-border/80 bg-muted">
              <img
                src={activeImage.src}
                alt={activeImage.alt}
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
              />
              <div className="absolute left-3 top-3 flex items-center gap-2">
                <span className="rounded-full bg-brand-ink/90 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-primary-foreground backdrop-blur">
                  {engine.badge}
                </span>
                <span className="rounded-full bg-secondary px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-secondary-foreground">
                  {engine.condition}
                </span>
              </div>
              {images.length > 1 && (
                <div className="absolute bottom-3 right-3 rounded-md bg-black/70 px-2.5 py-1 text-xs font-semibold text-white backdrop-blur">
                  {activeImageIndex + 1} / {images.length}
                </div>
              )}
            </div>

            {/* Thumbnail switcher */}
            {images.length > 1 && (
              <div className="flex items-center gap-3 overflow-x-auto pb-1">
                {images.map((img, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setActiveImageIndex(i)}
                    className={`group/thumb relative h-16 w-24 shrink-0 overflow-hidden rounded-lg border-2 transition-all cursor-pointer ${
                      activeImageIndex === i
                        ? "border-primary ring-2 ring-primary/30"
                        : "border-border opacity-70 hover:opacity-100"
                    }`}
                  >
                    <img
                      src={img.src}
                      alt={img.alt}
                      className="h-full w-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details side */}
          <div className={`p-6 sm:p-8 lg:col-span-5 ${reversed ? "lg:col-start-1" : ""}`}>
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-primary">
                {engine.year} • {engine.category}
              </span>
              <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                Verified Clean
              </span>
            </div>

            <h3 className="mt-2 font-display text-2xl font-bold uppercase tracking-wide text-foreground sm:text-3xl">
              {engine.name}
            </h3>

            <p className="mt-1 text-sm font-semibold text-secondary-foreground/90">
              {engine.tagline}
            </p>

            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              {engine.description}
            </p>

            {/* Spec highlights */}
            {engine.specs && engine.specs.length > 0 && (
              <div className="mt-6 border-y border-border/80 py-4">
                <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                  Key Highlights
                </span>
                <ul className="mt-2 grid grid-cols-1 gap-2 text-xs font-medium text-foreground sm:grid-cols-2">
                  {engine.specs.map((spec, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <Check className="h-4 w-4 shrink-0 text-primary" />
                      <span>{spec}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Price and CTA Buttons */}
            <div className="mt-6 flex flex-col gap-2.5">
              {/* Add to Cart button (Only shown for authenticated users) */}
              {isLoggedIn && (
                <button
                  type="button"
                  onClick={handleAddToCart}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-full border-2 border-primary bg-primary/10 px-6 py-3 text-xs font-bold uppercase tracking-wider text-primary hover:bg-primary hover:text-primary-foreground transition-all cursor-pointer shadow-sm"
                >
                  <ShoppingCart className="h-4 w-4" />
                  Add to Cart ({formatNaira(itemPrice)})
                </button>
              )}

              <button
                type="button"
                onClick={onBookVisit}
                className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-primary-foreground shadow-brand transition-transform hover:scale-[1.02] cursor-pointer"
              >
                <Calendar className="h-4 w-4" />
                Book Engine Inspection / Purchase
              </button>

              <div className="flex gap-2">
                <WhatsAppLink
                  text={`Hello SEO Autos, I am interested in purchasing/inspecting the ${engine.name} (${engine.year}). Please share current pricing and availability.`}
                  className="inline-flex flex-1 items-center justify-center gap-2 rounded-full border border-border bg-background px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-foreground transition-colors hover:bg-muted"
                >
                  WhatsApp Inquire
                </WhatsAppLink>
                <a
                  href="tel:+2348138946058"
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-border bg-background px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-foreground transition-colors hover:bg-muted"
                >
                  <Phone className="h-4 w-4" /> Call
                </a>
              </div>
            </div>
          </div>

        </div>
      </div>
    </Reveal>
  );
}
