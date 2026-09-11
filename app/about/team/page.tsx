import type { Metadata } from "next";
import { FounderSection } from "@/components/founder/FounderSection";
import { RoutePage } from "@/components/layout/RoutePage";

export const metadata: Metadata = {
  title: "Our Team | Global Public Health Lens",
  description: "Meet the people building an evidence-led public-health lens.",
};

export default function TeamPage() {
  return (
    <RoutePage breadcrumb="Our Team">
      <FounderSection />
    </RoutePage>
  );
}
