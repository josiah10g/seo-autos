import { createFileRoute } from "@tanstack/react-router";
import { Inventory, Parts } from "@/components/site/Sections";

const title = "Cars & Parts Services | SEO Autos Investment Limited";
const description =
  "Browse inspected cars for sale and order genuine OEM-grade auto parts, with inspection reports and nationwide delivery.";

export const Route = createFileRoute("/services")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
    ],
  }),
  component: ServicesPage,
});

function ServicesPage() {
  return (
    <>
      <section className="bg-brand-ink py-14 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <span className="text-xs font-bold uppercase tracking-[0.25em] text-secondary">Services</span>
          <h1 className="mt-3 font-display text-4xl font-bold uppercase leading-tight tracking-tight text-primary-foreground sm:text-5xl">
            Cars for sale &amp; parts supply
          </h1>
          <p className="mt-4 max-w-2xl text-primary-foreground/75">
            Vehicle sales, parts sourcing, inspection support and nationwide logistics — all under one roof.
          </p>
        </div>
      </section>
      <Inventory />
      <Parts />
    </>
  );
}
