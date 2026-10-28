import { AboutStory, WhyUs } from "@/components/site/Sections";
import { Showcase } from "@/components/site/Showcase";

function PageHeader({ eyebrow, title, copy }: { eyebrow: string; title: string; copy: string }) {
  return (
    <section className="bg-brand-ink py-14 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <span className="text-xs font-bold uppercase tracking-[0.25em] text-secondary">{eyebrow}</span>
        <h1 className="mt-3 font-display text-4xl font-bold uppercase leading-tight tracking-tight text-primary-foreground sm:text-5xl">
          {title}
        </h1>
        <p className="mt-4 max-w-2xl text-primary-foreground/75">{copy}</p>
      </div>
    </section>
  );
}

export default function AboutPage() {
  return (
    <>
      <PageHeader
        eyebrow="About us"
        title="Who we are"
        copy="A trusted Honda and Acura engine specialist in Lagos focused on compression-tested Tokunbo powertrains, fair pricing, and dependable mechanical work."
      />
      <Showcase />
      <AboutStory />
      <WhyUs />
    </>
  );
}
