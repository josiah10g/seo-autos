import { useState, useEffect } from "react";
import { Phone, Check, Sparkles, Calendar } from "lucide-react";
import { WhatsAppLink } from "./WhatsAppButton";
import { Reveal } from "./Reveal";
import { BookingModal } from "./BookingModal";
import { db, type VehicleListing, SEED_VEHICLES } from "@/lib/supabase";

export { type VehicleListing };

export function VehicleShowcase() {
  const [filter, setFilter] = useState<"All" | "Sedan" | "SUV">("All");
  const [vehicles, setVehicles] = useState<VehicleListing[]>(SEED_VEHICLES);
  const [selectedVehicleForBooking, setSelectedVehicleForBooking] = useState<VehicleListing | null>(null);

  useEffect(() => {
    let isMounted = true;
    db.getVehicles().then((data) => {
      if (isMounted && data && data.length > 0) {
        setVehicles(data);
      }
    });
    return () => {
      isMounted = false;
    };
  }, []);

  const filteredVehicles =
    filter === "All"
      ? vehicles.filter((v) => v.isAvailable !== false)
      : vehicles.filter((v) => v.isAvailable !== false && v.category === filter);

  return (
    <section id="inventory" className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
      <Reveal className="mx-auto max-w-3xl text-center">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3.5 py-1 text-xs font-bold uppercase tracking-[0.22em] text-primary">
          <Sparkles className="h-3.5 w-3.5" /> Direct Stock & Showcase
        </span>
        <h2 className="mt-3 font-display text-3xl font-bold uppercase tracking-tight text-foreground sm:text-5xl">
          Available Honda &amp; Acura Inventory
        </h2>
        <p className="mt-3 text-base text-muted-foreground sm:text-lg">
          Explore real units currently inspected, sourced, and available through SEO Autos Investment Limited. Click photos to see multiple angles, book an in-person yard visit, or message our team directly.
        </p>

        {/* Filter buttons */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
          {(["All", "Sedan", "SUV"] as const).map((category) => (
            <button
              key={category}
              type="button"
              onClick={() => setFilter(category)}
              className={`rounded-full px-5 py-2 text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                filter === category
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "border border-border bg-card text-muted-foreground hover:border-primary/50 hover:text-foreground"
              }`}
            >
              {category === "All" ? "All Models" : category + "s"}
            </button>
          ))}
        </div>
      </Reveal>

      <div className="mt-12 space-y-16">
        {filteredVehicles.length === 0 ? (
          <div className="py-12 text-center text-muted-foreground">
            No vehicles found in this category. Check back soon or request a custom import.
          </div>
        ) : (
          filteredVehicles.map((vehicle, idx) => (
            <VehicleCard
              key={vehicle.id}
              vehicle={vehicle}
              reversed={idx % 2 === 1}
              onBookVisit={() => setSelectedVehicleForBooking(vehicle)}
            />
          ))
        )}
      </div>

      {/* Booking Modal */}
      <BookingModal
        vehicle={selectedVehicleForBooking}
        isOpen={Boolean(selectedVehicleForBooking)}
        onClose={() => setSelectedVehicleForBooking(null)}
      />

      {/* Direct assistance banner */}
      <Reveal className="mt-16">
        <div className="rounded-2xl border border-border bg-gradient-to-r from-card via-card to-secondary/15 p-8 shadow-card sm:p-10">
          <div className="flex flex-col items-center justify-between gap-6 text-center md:flex-row md:text-left">
            <div>
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-primary">Looking for a specific model?</span>
              <h3 className="mt-2 font-display text-2xl font-bold uppercase text-foreground sm:text-3xl">
                Can't find your exact trim or year?
              </h3>
              <p className="mt-2 max-w-xl text-sm text-muted-foreground">
                We regularly import and source Honda Accord, Civic, CR-V, Pilot, and Acura MDX/TLX. Tell us your budget and specs, and our team will get it for you.
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
                text={`Hello SEO Autos, I want to enquire about vehicle models in stock.`}
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

function VehicleCard({
  vehicle,
  reversed = false,
  onBookVisit,
}: {
  vehicle: VehicleListing;
  reversed?: boolean;
  onBookVisit: () => void;
}) {
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const images = vehicle.images && vehicle.images.length > 0 ? vehicle.images : [
    { src: "/favicon.png", alt: vehicle.name, label: "Photo" }
  ];
  const activeImage = images[activeImageIndex] || images[0];

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
                  {vehicle.badge}
                </span>
                <span className="rounded-full bg-secondary px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-secondary-foreground">
                  {vehicle.condition}
                </span>
              </div>
              <div className="absolute bottom-3 right-3 rounded-md bg-black/70 px-2.5 py-1 text-xs font-semibold text-white backdrop-blur">
                {activeImage.label} ({activeImageIndex + 1}/{images.length})
              </div>
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
                    <span className="absolute inset-x-0 bottom-0 bg-black/60 py-0.5 text-center text-[10px] font-medium text-white truncate px-1">
                      {img.label}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details side */}
          <div className={`p-6 sm:p-8 lg:col-span-5 ${reversed ? "lg:col-start-1" : ""}`}>
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-primary">
                {vehicle.year} • {vehicle.category}
              </span>
              <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                Verified Clean
              </span>
            </div>

            <h3 className="mt-2 font-display text-2xl font-bold uppercase tracking-wide text-foreground sm:text-3xl">
              {vehicle.name}
            </h3>

            <p className="mt-1 text-sm font-semibold text-secondary-foreground/90">
              {vehicle.tagline}
            </p>

            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              {vehicle.description}
            </p>

            {/* Spec highlights */}
            {vehicle.specs && vehicle.specs.length > 0 && (
              <div className="mt-6 border-y border-border/80 py-4">
                <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                  Key Highlights
                </span>
                <ul className="mt-2 grid grid-cols-1 gap-2 text-xs font-medium text-foreground sm:grid-cols-2">
                  {vehicle.specs.map((spec, i) => (
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
              <button
                type="button"
                onClick={onBookVisit}
                className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-primary-foreground shadow-brand transition-transform hover:scale-[1.02] cursor-pointer"
              >
                <Calendar className="h-4 w-4" />
                Book In-Person Visit / Purchase
              </button>

              <div className="flex gap-2">
                <WhatsAppLink
                  text={`Hello SEO Autos, I am interested in inspecting the ${vehicle.name} (${vehicle.year}). Please share the price and inspection schedule.`}
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
