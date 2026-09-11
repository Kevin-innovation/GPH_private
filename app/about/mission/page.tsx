import type { Metadata } from "next";
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
    </RoutePage>
  );
}
