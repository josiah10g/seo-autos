import { createFileRoute } from "@tanstack/react-router";
import { Hero, WhyUs } from "@/components/site/Sections";

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
