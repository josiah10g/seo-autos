import { createFileRoute } from "@tanstack/react-router";
import { Hero, WhyUs } from "@/components/site/Sections";

const title = "SEO Autos Investment Limited | Honda & Acura Specialists";
const description =
  "SEO Autos Investment Limited sells and buys Honda and Acura vehicles, swaps and installs engines, gearboxes and accessories, and provides car repair services in Lagos, Nigeria.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <>
      <Hero />
      <WhyUs />
    </>
  );
}

