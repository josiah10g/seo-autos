import { createFileRoute } from "@tanstack/react-router";
import { Nav } from "@/components/site/Nav";
import { Hero, Inventory, Parts, WhyUs, Contact, Footer } from "@/components/site/Sections";

const title = "SEO Autos Investment Limited | Quality Cars & Auto Parts";
const description =
  "Buy inspected cars and genuine auto parts from SEO Autos Investment Limited — honest pricing, verified papers and nationwide delivery.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <div className="min-h-screen bg-background font-sans">
      <Nav />
      <main>
        <Hero />
        <Inventory />
        <Parts />
        <WhyUs />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}
