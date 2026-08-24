import { Reveal } from "./Reveal";
import collage from "@/assets/seo-autos-collage.jpeg.asset.json";

export function Showcase() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
      <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
        <Reveal>
          <img
            src={collage.url}
            alt="SEO Autos collage of Honda engines and vehicles"
            loading="lazy"
            width={1200}
            height={800}
            className="rounded-xl border border-border bg-card object-cover shadow-card"
          />
        </Reveal>
        <div>
          <span className="text-xs font-bold uppercase tracking-[0.25em] text-primary">What we handle</span>
          <h2 className="mt-3 font-display text-3xl font-bold uppercase leading-tight tracking-tight text-foreground sm:text-4xl">
            Honda engines, gearboxes & vehicles
          </h2>
          <p className="mt-4 text-muted-foreground">
            We work with Honda and Acura powertrains, body parts, interior accessories and complete vehicles. From engine swaps to general repairs, our focus is on getting your car back on the road.
          </p>
          <p className="mt-4 text-muted-foreground">
            Visit us in Lagos or send a message — we will tell you honestly what is available and what the work involves.
          </p>
        </div>
      </div>
    </section>
  );
}
