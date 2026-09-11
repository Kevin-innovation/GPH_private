import type { Metadata } from "next";
import { GlobalLensSection } from "@/components/global-lens/GlobalLensSection";
import { RelatedPages } from "@/components/layout/RelatedPages";
import { RoutePage } from "@/components/layout/RoutePage";

export const metadata: Metadata = {
  title: "How the Lens Works | Global Public Health Lens",
  description: "Follow one health issue from the body to community conditions and public-health systems.",
};

export default function HowItWorksPage() {
  return (
    <RoutePage breadcrumb="How the Lens Works">
      <GlobalLensSection />
      <div className="page-width route-related-wrap">
        <RelatedPages
          pages={[
            {
              label: "Micronutrients",
              href: "/lens/micronutrients",
              description: "Explore the first applied lens in detail.",
            },
            {
              label: "Solutions & Action",
              href: "/lens/solutions",
              description: "Follow the conditions that can change outcomes.",
            },
          ]}
        />
      </div>
    </RoutePage>
  );
}
