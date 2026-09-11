import type { Metadata } from "next";
import { FounderSection } from "@/components/founder/FounderSection";
import { RelatedPages } from "@/components/layout/RelatedPages";
import { RoutePage } from "@/components/layout/RoutePage";

export const metadata: Metadata = {
  title: "Our Team | Global Public Health Lens",
  description: "Meet the people building an evidence-led public-health lens.",
};

export default function TeamPage() {
  return (
    <RoutePage breadcrumb="Our Team">
      <FounderSection />
      <RelatedPages
        title="Continue through About"
        pages={[
          {
            label: "Contact",
            description: "Questions, feedback, or collaboration.",
            href: "/contact",
          },
          {
            label: "Our Mission",
            description: "Return to the six forces that shape health.",
            href: "/about/mission",
          },
        ]}
      />
    </RoutePage>
  );
}
