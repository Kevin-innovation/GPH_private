import type { Metadata } from "next";
import { CountrySpotlightSection } from "@/components/global-lens/CountrySpotlight";
import { RoutePage } from "@/components/layout/RoutePage";

export const metadata: Metadata = {
  title: "Country Spotlight | Global Public Health Lens",
  description: "Explore how local health challenges connect to social, environmental, and policy conditions.",
};

export default function CountrySpotlightPage() {
  return (
    <RoutePage breadcrumb="Country Spotlight">
      <CountrySpotlightSection />
    </RoutePage>
  );
}
