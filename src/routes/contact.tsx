import { createFileRoute } from "@tanstack/react-router";
import { ContactSection } from "@/components/site/Sections";

const title = "Contact Us | SEO Autos Investment Limited";
const description =
  "Call, email or send an enquiry to SEO Autos Investment Limited for cars and genuine auto parts. Same-day response from our sales team.";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
    ],
  }),
  component: ContactPage,
});

function ContactPage() {
  return (
    <>
      <section className="py-14 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <span className="text-xs font-bold uppercase tracking-[0.25em] text-primary">Contact us</span>
          <h1 className="mt-3 font-display text-4xl font-bold uppercase leading-tight tracking-tight text-foreground sm:text-5xl">
            We're ready to help
          </h1>
          <p className="mt-4 max-w-2xl text-muted-foreground">
            Share the car or part you need with your budget and we'll get back to you the same day.
          </p>
        </div>
      </section>
      <ContactSection />
    </>
  );
}
