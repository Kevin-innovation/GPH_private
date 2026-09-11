import type { Metadata } from "next";
import { RelatedPages } from "@/components/layout/RelatedPages";
import { MicronutrientSection } from "@/components/micronutrients/MicronutrientSection";
import { RoutePage } from "@/components/layout/RoutePage";

export const metadata: Metadata = {
  title: "Micronutrients | Global Public Health Lens",
  description: "A practical guide to micronutrients, food sources, and public-health context.",
};

export default function MicronutrientsPage() {
  return (
    <RoutePage breadcrumb="Micronutrients">
      <MicronutrientSection />
      <div className="page-width route-related-wrap">
        <RelatedPages
          pages={[
            {
              label: "Nutrition App",
              href: "/nutrition-app",
              description: "Put the micronutrient lens into a daily food routine.",
            },
          ]}
        />
      </div>
    </RoutePage>
  );
}
