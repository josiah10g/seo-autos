import {
  ShieldCheck,
  Wrench,
  Truck,
  BadgeCheck,
  Gauge,
  Fuel,
  Cog,
  Phone,
  Mail,
  MapPin,
} from "lucide-react";
import heroCar from "@/assets/hero-car.jpg";
import parts from "@/assets/parts.jpg";
import carSuv from "@/assets/car-suv.jpg";
import carPickup from "@/assets/car-pickup.jpg";
import logo from "@/assets/logo.png.asset.json";

export function Hero() {
  return (
    <section id="top" className="relative overflow-hidden bg-brand-ink">
      <img
        src={heroCar}
        alt="Red performance sedan in a showroom"
        width={1920}
        height={1088}
        className="absolute inset-0 h-full w-full object-cover opacity-70"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-brand-ink via-brand-ink/80 to-transparent" />
      <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-28 lg:py-36">
        <span className="inline-flex items-center gap-2 rounded-full bg-secondary px-4 py-1.5 text-xs font-bold uppercase tracking-[0.2em] text-secondary-foreground">
          Your reliable plug
        </span>
        <h1 className="mt-6 max-w-3xl font-display text-4xl font-bold uppercase leading-[0.95] tracking-tight text-primary-foreground sm:text-6xl lg:text-7xl">
          Quality cars &amp; genuine
          <span className="text-secondary"> auto parts</span> you can trust
        </h1>
        <p className="mt-5 max-w-xl text-base text-primary-foreground/80 sm:text-lg">
          SEO Autos Investment Limited sells verified vehicles and OEM-grade parts, with
          honest pricing, inspection reports and nationwide delivery.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <a
            href="#inventory"
            className="rounded-full bg-primary px-7 py-3.5 text-sm font-bold uppercase tracking-wide text-primary-foreground shadow-brand transition-transform hover:scale-[1.03]"
          >
            Browse cars for sale
          </a>
          <a
            href="tel:+2348000000000"
            className="inline-flex items-center gap-2 rounded-full border border-primary-foreground/30 px-7 py-3.5 text-sm font-bold uppercase tracking-wide text-primary-foreground transition-colors hover:bg-primary-foreground/10"
          >
            <Phone className="h-4 w-4" /> Talk to sales
          </a>
        </div>
        <dl className="mt-12 grid max-w-2xl grid-cols-2 gap-6 sm:grid-cols-4">
          {[
            ["1,200+", "Cars sold"],
            ["15k+", "Parts in stock"],
            ["36", "States delivered"],
            ["4.9/5", "Buyer rating"],
          ].map(([v, k]) => (
            <div key={k}>
              <dt className="font-display text-3xl text-secondary">{v}</dt>
              <dd className="text-xs font-semibold uppercase tracking-widest text-primary-foreground/70">
                {k}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}

const cars = [
  { name: "Toyota Camry SE", year: "2020", price: "₦18,500,000", km: "42,000 km", fuel: "Petrol", gear: "Automatic", img: heroCar },
  { name: "Lexus RX 350", year: "2019", price: "₦34,900,000", km: "58,300 km", fuel: "Petrol", gear: "Automatic", img: carSuv },
  { name: "Honda Accord Sport", year: "2021", price: "₦22,750,000", km: "31,900 km", fuel: "Petrol", gear: "Automatic", img: heroCar },
  { name: "Mercedes-Benz GLE 450", year: "2020", price: "₦59,000,000", km: "27,400 km", fuel: "Petrol", gear: "Automatic", img: carSuv },
  { name: "Hyundai Elantra", year: "2022", price: "₦16,200,000", km: "19,800 km", fuel: "Petrol", gear: "Automatic", img: heroCar },
  { name: "Ford Ranger Wildtrak", year: "2019", price: "₦28,400,000", km: "66,100 km", fuel: "Diesel", gear: "Manual", img: carPickup },
];

export function Inventory() {
  return (
    <section id="inventory" className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
      <SectionHead
        eyebrow="Inventory"
        title="Cars available now"
        copy="Every vehicle is inspected, documented and priced transparently. Reserve with a call."
      />
      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {cars.map((c) => (
          <article
            key={c.name}
            className="group overflow-hidden rounded-xl border border-border bg-card shadow-card transition-transform hover:-translate-y-1"
          >
            <div className="relative">
              <img
                src={c.img}
                alt={c.name}
                loading="lazy"
                width={1600}
                height={1000}
                className="h-48 w-full object-cover"
              />
              <span className="absolute left-4 top-4 rounded-full bg-secondary px-3 py-1 text-xs font-bold uppercase tracking-wider text-secondary-foreground">
                {c.year}
              </span>
            </div>
            <div className="p-5">
              <h3 className="font-display text-2xl uppercase tracking-wide text-card-foreground">
                {c.name}
              </h3>
              <p className="mt-1 text-xl font-bold text-primary">{c.price}</p>
              <ul className="mt-4 grid grid-cols-3 gap-2 text-xs font-semibold text-muted-foreground">
                <li className="flex items-center gap-1.5"><Gauge className="h-4 w-4 shrink-0 text-primary" />{c.km}</li>
                <li className="flex items-center gap-1.5"><Fuel className="h-4 w-4 shrink-0 text-primary" />{c.fuel}</li>
                <li className="flex items-center gap-1.5"><Cog className="h-4 w-4 shrink-0 text-primary" />{c.gear}</li>
              </ul>
              <a
                href="#contact"
                className="mt-5 block rounded-full bg-primary px-5 py-3 text-center text-sm font-bold uppercase tracking-wide text-primary-foreground transition-opacity hover:opacity-90"
              >
                Request price &amp; inspection
              </a>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

export function Parts() {
  return (
    <section id="parts" className="bg-muted py-20">
      <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 sm:px-6 lg:grid-cols-2">
        <img
          src={parts}
          alt="Brake discs, filters, spark plugs and an alternator"
          loading="lazy"
          width={1200}
          height={900}
          className="rounded-xl border border-border bg-card object-cover shadow-card"
        />
        <div>
          <SectionHead
            eyebrow="Parts department"
            title="Genuine parts, no guesswork"
            copy="From brakes and filters to engines and electricals — we source original and OEM-grade parts for Toyota, Lexus, Honda, Mercedes, Ford and more."
            align="left"
          />
          <ul className="mt-8 grid gap-4 sm:grid-cols-2">
            {[
              ["Engine & transmission", "Blocks, gearboxes, mounts"],
              ["Brakes & suspension", "Pads, discs, shocks, arms"],
              ["Electricals", "Alternators, starters, sensors"],
              ["Body & interior", "Bumpers, lights, mirrors"],
            ].map(([t, d]) => (
              <li key={t} className="rounded-lg border border-border bg-card p-4">
                <p className="font-display text-lg uppercase tracking-wide text-card-foreground">{t}</p>
                <p className="mt-1 text-sm text-muted-foreground">{d}</p>
              </li>
            ))}
          </ul>
          <a
            href="#contact"
            className="mt-8 inline-block rounded-full bg-brand-ink px-7 py-3.5 text-sm font-bold uppercase tracking-wide text-primary-foreground transition-opacity hover:opacity-90"
          >
            Request a part
          </a>
        </div>
      </div>
    </section>
  );
}

export function WhyUs() {
  const items = [
    { icon: ShieldCheck, t: "Verified papers", d: "Clean documentation and customs clearance on every vehicle." },
    { icon: BadgeCheck, t: "Honest pricing", d: "One clear price. No hidden charges after agreement." },
    { icon: Wrench, t: "After-sales support", d: "Servicing advice and parts supply long after you buy." },
    { icon: Truck, t: "Nationwide delivery", d: "Safe logistics to your city, tracked from our yard to you." },
  ];
  return (
    <section id="why" className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
      <SectionHead eyebrow="Why SEO Autos" title="Built on trust, not talk" copy="Thousands of buyers rely on us as their plug for quality cars and parts." />
      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {items.map(({ icon: Icon, t, d }) => (
          <div key={t} className="rounded-xl border border-border bg-card p-6 shadow-card">
            <span className="inline-flex h-12 w-12 items-center justify-center rounded-lg bg-secondary">
              <Icon className="h-6 w-6 text-primary" />
            </span>
            <h3 className="mt-4 font-display text-xl uppercase tracking-wide text-card-foreground">{t}</h3>
            <p className="mt-2 text-sm text-muted-foreground">{d}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export function Contact() {
  return (
    <section id="contact" className="bg-brand-ink py-20">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[1fr_1.1fr]">
        <div>
          <h2 className="font-display text-4xl font-bold uppercase leading-tight text-primary-foreground sm:text-5xl">
            Ready to buy? <span className="text-secondary">Let's talk.</span>
          </h2>
          <p className="mt-4 max-w-md text-primary-foreground/75">
            Tell us the car or part you need and your budget. Our sales team responds the
            same day.
          </p>
          <ul className="mt-8 space-y-4 text-sm text-primary-foreground/85">
            <li className="flex items-center gap-3"><Phone className="h-5 w-5 shrink-0 text-secondary" /> +234 800 000 0000</li>
            <li className="flex items-center gap-3"><Mail className="h-5 w-5 shrink-0 text-secondary" /> sales@seoautos.com</li>
            <li className="flex items-center gap-3"><MapPin className="h-5 w-5 shrink-0 text-secondary" /> Lagos, Nigeria</li>
          </ul>
        </div>
        <form
          className="rounded-xl bg-card p-6 shadow-card sm:p-8"
          onSubmit={(e) => e.preventDefault()}
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Full name" placeholder="Josiah Adeyemi" />
            <Field label="Phone" placeholder="+234 ..." type="tel" />
          </div>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <Field label="Email" placeholder="you@email.com" type="email" />
            <Field label="Budget" placeholder="₦20,000,000" />
          </div>
          <label className="mt-4 block">
            <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
              What do you need?
            </span>
            <textarea
              rows={4}
              placeholder="e.g. 2020 Toyota Camry, or front brake pads for Lexus RX 350"
              className="mt-2 w-full rounded-lg border border-input bg-background px-4 py-3 text-sm text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-ring/30"
            />
          </label>
          <button
            type="submit"
            className="mt-6 w-full rounded-full bg-primary px-6 py-3.5 text-sm font-bold uppercase tracking-wide text-primary-foreground shadow-brand transition-transform hover:scale-[1.01]"
          >
            Send enquiry
          </button>
        </form>
      </div>
    </section>
  );
}

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

function Field({ label, placeholder, type = "text" }: { label: string; placeholder: string; type?: string }) {
  return (
    <label className="block">
      <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">{label}</span>
      <input
        type={type}
        placeholder={placeholder}
        className="mt-2 w-full rounded-lg border border-input bg-background px-4 py-3 text-sm text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-ring/30"
      />
    </label>
  );
}

function SectionHead({
  eyebrow,
  title,
  copy,
  align = "center",
}: {
  eyebrow: string;
  title: string;
  copy: string;
  align?: "center" | "left";
}) {
  return (
    <div className={align === "center" ? "mx-auto max-w-2xl text-center" : "max-w-xl"}>
      <span className="text-xs font-bold uppercase tracking-[0.25em] text-primary">{eyebrow}</span>
      <h2 className="mt-3 font-display text-3xl font-bold uppercase leading-tight tracking-tight text-foreground sm:text-4xl">
        {title}
      </h2>
      <p className="mt-3 text-muted-foreground">{copy}</p>
    </div>
  );
}
