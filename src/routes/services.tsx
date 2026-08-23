import { createFileRoute } from "@tanstack/react-router";
import { Inventory, Parts } from "@/components/site/Sections";

const title = "Services | SEO Autos Investment Limited";
const description =
  "Honda and Acura sales, buy, swap and installation of engines, gearboxes and accessories, plus general car repair services in Lagos, Nigeria.";

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
            Honda &amp; Acura specialists
          </h1>
          <p className="mt-4 max-w-2xl text-primary-foreground/75">
            We sell and buy Honda and Acura vehicles, swap and install engines, gearboxes and accessories, and handle general car repairs.
          </p>
        </div>
      </section>
      <Inventory />
      <Parts />
    </>
  );
}

