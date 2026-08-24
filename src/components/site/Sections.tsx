import {
  ShieldCheck,
  Wrench,
  Truck,
  BadgeCheck,
  Phone,
  Mail,
  MapPin,
  Users,
  Target,
  Award,
  Clock,
  Settings,
  RefreshCcw,
  CircleDollarSign,
  Car,
  MessageCircle,
} from "lucide-react";
import heroCar from "@/assets/hero-car.jpg";
import parts from "@/assets/parts.jpg";
import { Link } from "@tanstack/react-router";
import { WhatsAppLink } from "./WhatsAppButton";
import { Reveal } from "@/components/site/Reveal";

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
        <span className="page-enter inline-flex items-center gap-2 rounded-full bg-secondary px-4 py-1.5 text-xs font-bold uppercase tracking-[0.2em] text-secondary-foreground">
          Honda & Acura specialists
        </span>
        <h1 style={{ animationDelay: "90ms" }} className="page-enter mt-6 max-w-3xl font-display text-4xl font-bold uppercase leading-[0.95] tracking-tight text-primary-foreground sm:text-6xl lg:text-7xl">
          Sell, buy, swap &
          <span className="text-secondary"> install</span> with confidence
        </h1>
        <p style={{ animationDelay: "180ms" }} className="page-enter mt-5 max-w-xl text-base text-primary-foreground/80 sm:text-lg">
          SEO Autos Investment Limited handles Honda and Acura vehicles, engines, gearboxes, accessories and general car repairs in Lagos.
        </p>
        <div style={{ animationDelay: "270ms" }} className="page-enter mt-8 flex flex-wrap items-center gap-4 text-primary-foreground">
          <a href="tel:+2348138946058" className="inline-flex items-center gap-2 text-base font-bold">
            <Phone className="h-5 w-5 text-secondary" /> +234 813 894 6058
          </a>
          <a href="mailto:blessedsolo6614@gmail.com" className="inline-flex items-center gap-2 text-base font-bold break-all">
            <Mail className="h-5 w-5 text-secondary" /> blessedsolo6614@gmail.com
          </a>
        </div>
      </div>
    </section>
  );
}

export function Inventory() {
  return (
    <section id="inventory" className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
      <SectionHead
        eyebrow="Inventory"
        title="Honda & Acura vehicles"
        copy="We sell and buy Honda and Acura vehicles. Stock changes often, so call or send an enquiry to see what is available right now."
      />
      <Reveal>
        <div className="mt-10 rounded-xl border border-dashed border-border bg-card p-10 text-center shadow-card transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:bg-secondary/10">
          <p className="text-muted-foreground">
            Current Honda and Acura listings will be posted here. For now, reach us directly and we will share what we have in stock.
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-4">
            <a
              href="tel:+2348138946058"
              className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-bold uppercase tracking-wide text-primary-foreground transition-opacity hover:opacity-90"
            >
              <Phone className="h-4 w-4" /> Call +234 813 894 6058
            </a>
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-6 py-3 text-sm font-bold uppercase tracking-wide text-foreground transition-colors hover:bg-muted"
            >
              Send enquiry
            </Link>
          </div>
        </div>
      </Reveal>
    </section>
  );
}

export function Parts() {
  const items = [
    { icon: RefreshCcw, t: "Engine swap", d: "Remove and replace Honda/Acura engines with matched units." },
    { icon: Settings, t: "Gearbox work", d: "Swap and install automatic and manual gearboxes." },
    { icon: Car, t: "Accessories", d: "Body, interior, electrical and performance accessories." },
    { icon: Wrench, t: "Car repairs", d: "General diagnostics, servicing and mechanical repairs." },
  ];

  return (
    <section id="parts" className="bg-muted py-20">
      <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 sm:px-6 lg:grid-cols-2">
        <Reveal>
          <img
            src={parts}
            alt="Engine, gearbox and auto parts on a workbench"
            loading="lazy"
            width={1200}
            height={900}
            className="rounded-xl border border-border bg-card object-cover shadow-card"
          />
        </Reveal>
        <div>
          <SectionHead
            eyebrow="Parts & repairs"
            title="Engines, gearboxes & accessories"
            copy="We swap and install engines and gearboxes, supply accessories and carry out general car repairs for Honda and Acura vehicles."
            align="left"
          />
          <ul className="mt-8 grid gap-4 sm:grid-cols-2">
            {items.map(({ icon: Icon, t, d }) => (
              <li key={t} className="rounded-lg border border-border bg-card p-4 transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:bg-secondary/20 hover:shadow-card">
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-secondary transition-colors hover:bg-primary">
                  <Icon className="h-5 w-5 text-primary" />
                </span>
                <p className="mt-3 font-display text-lg uppercase tracking-wide text-card-foreground">{t}</p>
                <p className="mt-1 text-sm text-muted-foreground">{d}</p>
              </li>
            ))}
          </ul>
          <Link
            to="/contact"
            className="mt-8 inline-block rounded-full bg-brand-ink px-7 py-3.5 text-sm font-bold uppercase tracking-wide text-primary-foreground transition-opacity hover:opacity-90"
          >
            Request a service
          </Link>
        </div>
      </div>
    </section>
  );
}

export function WhyUs() {
  const items = [
    { icon: Car, t: "Honda & Acura focus", d: "We specialize in Honda and Acura vehicles and their parts." },
    { icon: BadgeCheck, t: "Straight pricing", d: "We agree on one clear price with no surprise charges." },
    { icon: Wrench, t: "Install & repair", d: "We do the work — not just supply the parts." },
    { icon: Truck, t: "Local handover", d: "Pick up your purchase in Lagos, or arrange your own transport." },
  ];
  return (
    <section id="why" className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
      <SectionHead eyebrow="Why SEO Autos" title="Straight dealing, clear terms" copy="We focus on honest communication and making sure you know what you are paying for." />
      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {items.map(({ icon: Icon, t, d }, i) => (
          <Reveal key={t} delay={i * 80}>
            <div className="h-full rounded-xl border border-border bg-card p-6 shadow-card transition-all duration-300 hover:-translate-y-2 hover:border-primary/40 hover:bg-secondary/15 hover:shadow-brand">
              <span className="inline-flex h-12 w-12 items-center justify-center rounded-lg bg-secondary">
                <Icon className="h-6 w-6 text-primary" />
              </span>
              <h3 className="mt-4 font-display text-xl uppercase tracking-wide text-card-foreground">{t}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{d}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

export function AboutStory() {
  const values = [
    { icon: Users, t: "Customer first", d: "We listen to your budget and needs before recommending any car or part." },
    { icon: Target, t: "Transparency", d: "We share price and condition details clearly before you decide." },
    { icon: Award, t: "Quality focus", d: "We only offer vehicles and parts we are happy to stand behind." },
    { icon: Clock, t: "Reachable", d: "Contact us by phone or email and we will get back to you." },
  ];

  return (
    <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
      <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
        <div>
          <SectionHead
            eyebrow="About us"
            title="Your Honda & Acura partner"
            copy="SEO Autos Investment Limited helps buyers and owners in Lagos get the right Honda and Acura vehicles, engines, gearboxes and accessories."
            align="left"
          />
          <p className="mt-6 text-muted-foreground">
            We keep things simple: tell us what you need, we check what is available, and we agree on a fair price. No hidden fees, no stories.
          </p>
          <p className="mt-4 text-muted-foreground">
            Whether you are buying a vehicle, swapping an engine, replacing a gearbox, fitting accessories or booking a repair, our team will guide you through the process.
          </p>
          <Link
            to="/contact"
            className="mt-8 inline-block rounded-full bg-primary px-7 py-3.5 text-sm font-bold uppercase tracking-wide text-primary-foreground shadow-brand transition-transform hover:scale-[1.03]"
          >
            Work with us
          </Link>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {values.map(({ icon: Icon, t, d }, i) => (
            <Reveal key={t} delay={i * 80}>
              <div className="h-full rounded-xl border border-border bg-card p-6 shadow-card transition-all duration-300 hover:-translate-y-2 hover:border-primary/40 hover:bg-secondary/15 hover:shadow-brand">
                <span className="inline-flex h-12 w-12 items-center justify-center rounded-lg bg-secondary">
                  <Icon className="h-6 w-6 text-primary" />
                </span>
                <h3 className="mt-4 font-display text-lg uppercase tracking-wide text-card-foreground">{t}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{d}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

export function ContactSection() {
  return (
    <section id="contact" className="bg-brand-ink py-20">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[1fr_1.1fr]">
        <div>
          <h2 className="font-display text-4xl font-bold uppercase leading-tight text-primary-foreground sm:text-5xl">
            Ready to buy? <span className="text-secondary">Let's talk.</span>
          </h2>
          <p className="mt-4 max-w-md text-primary-foreground/75">
            Tell us the Honda or Acura service you need and your budget. We will get back to you as soon as possible.
          </p>
          <ul className="mt-8 space-y-4 text-sm text-primary-foreground/85">
            <li className="flex items-center gap-3"><Phone className="h-5 w-5 shrink-0 text-secondary" /> <a href="tel:+2348138946058">+234 813 894 6058</a></li>
            <li className="flex items-center gap-3"><Mail className="h-5 w-5 shrink-0 text-secondary" /> <a href="mailto:blessedsolo6614@gmail.com" className="break-all">blessedsolo6614@gmail.com</a></li>
            <li className="flex items-center gap-3"><MapPin className="h-5 w-5 shrink-0 text-secondary" /> Lagos, Nigeria</li>
          </ul>
        </div>
        <form
          className="rounded-xl bg-card p-6 shadow-card sm:p-8"
          onSubmit={(e) => e.preventDefault()}
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Full name" placeholder="Type your full name here" />
            <Field label="Phone" placeholder="+234 ..." type="tel" />
          </div>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <Field label="Gmail" placeholder="yourname@gmail.com" type="email" />
            <Field label="Budget" placeholder="₦20,000,000" />
          </div>
          <label className="mt-4 block">
            <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
              What do you need?
            </span>
            <textarea
              rows={4}
              placeholder="e.g. Honda Accord 2010 engine swap, or Acura MDX gearbox"
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
    <Reveal className={align === "center" ? "mx-auto max-w-2xl text-center" : "max-w-xl"}>
      <span className="text-xs font-bold uppercase tracking-[0.25em] text-primary">{eyebrow}</span>
      <h2 className="mt-3 font-display text-3xl font-bold uppercase leading-tight tracking-tight text-foreground sm:text-4xl">
        {title}
      </h2>
      <p className="mt-3 text-muted-foreground">{copy}</p>
    </Reveal>
  );
}
