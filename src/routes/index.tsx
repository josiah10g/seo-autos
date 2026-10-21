import { createFileRoute } from "@tanstack/react-router";
import { Hero, WhyUs } from "@/components/site/Sections";
import { VehicleShowcase } from "@/components/site/VehicleShowcase";

const title = "SEO Autos Investment Limited | Tested Honda & Acura Engines";
const description =
  "Buy genuine, foreign-used (Tokunbo) Honda and Acura engines, VTEC powertrains, and engine components in Lagos, Nigeria with SEO Autos Investment Limited.";

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
      <VehicleShowcase />
      <WhyUs />
    </>
  );
}

