import { VehicleShowcase } from "@/components/site/VehicleShowcase";
import { Parts } from "@/components/site/Sections";

export default function ServicesPage() {
  return (
    <>
      <section className="bg-brand-ink py-14 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <span className="text-xs font-bold uppercase tracking-[0.25em] text-secondary">Engine Inventory & Swaps</span>
          <h1 className="mt-3 font-display text-4xl font-bold uppercase leading-tight tracking-tight text-primary-foreground sm:text-5xl">
            Honda &amp; Acura Engine Specialists
          </h1>
          <p className="mt-4 max-w-2xl text-primary-foreground/75">
            We supply and install genuine, tested Honda and Acura complete engines, VTEC cylinder heads, gearboxes and rebuild internals.
          </p>
        </div>
      </section>
      <VehicleShowcase />
      <Parts />
    </>
  );
}
