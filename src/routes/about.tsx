import { createFileRoute } from "@tanstack/react-router";
import { AboutStory, WhyUs } from "@/components/site/Sections";

const title = "About Us | SEO Autos Investment Limited";
const description =
  "Learn how SEO Autos Investment Limited became a trusted plug for verified vehicles, genuine auto parts and straight dealing in Lagos, Nigeria.";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <>
      <PageHeader
        eyebrow="About us"
        title="Who we are"
        copy="A car and auto parts business built on verified stock, honest pricing and long-term customer relationships."
      />
      <AboutStory />
      <WhyUs />
    </>
  );
}

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
