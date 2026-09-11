import type { Metadata } from "next";
import { CountrySpotlightSection } from "@/components/global-lens/CountrySpotlight";
import { RoutePage } from "@/components/layout/RoutePage";
import { RelatedPages } from "@/components/layout/RelatedPages";

export const metadata: Metadata = {
  title: "Country Spotlight | Global Public Health Lens",
  description: "Explore how local health challenges connect to social, environmental, and policy conditions.",
};

export default function CountrySpotlightPage() {
  return (
    <RoutePage breadcrumb="Country Spotlight">
      <CountrySpotlightSection />
      <div className="page-width route-related-wrap">
        <RelatedPages
          pages={[
            {
              label: "How the Lens Works",
              href: "/lens/how-it-works",
              description: "Follow one health question from the body to public-health systems.",
            },
          ]}
        />
      </div>
    </RoutePage>
  );
}
