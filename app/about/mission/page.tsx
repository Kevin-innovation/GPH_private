import type { Metadata } from "next";
import { RelatedPages } from "@/components/layout/RelatedPages";
import { MissionSection } from "@/components/mission/MissionSection";
import { RoutePage } from "@/components/layout/RoutePage";

export const metadata: Metadata = {
  title: "Our Mission | Global Public Health Lens",
  description: "How place, access, environment, policy, and inequality shape everyday health.",
};

export default function MissionPage() {
  return (
    <RoutePage breadcrumb="Our Mission">
      <MissionSection />
      <RelatedPages
        title="Continue through About"
        pages={[
          {
            label: "Our Team",
            description: "Meet the founder and the questions behind the lens.",
            href: "/about/team",
          },
        ]}
      />
    </RoutePage>
  );
}
