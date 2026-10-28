import { ContactSection } from "@/components/site/Sections";

export default function ContactPage() {
  return (
    <>
      <section className="py-14 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <span className="text-xs font-bold uppercase tracking-[0.25em] text-primary">Contact us</span>
          <h1 className="mt-3 font-display text-4xl font-bold uppercase leading-tight tracking-tight text-foreground sm:text-5xl">
            We're ready to help
          </h1>
          <p className="mt-4 max-w-2xl text-muted-foreground">
            Tell us what you need — a Honda or Acura vehicle, an engine or gearbox swap, accessories, or a repair — and we will get back to you.
          </p>
        </div>
      </section>
      <ContactSection />
    </>
  );
}
