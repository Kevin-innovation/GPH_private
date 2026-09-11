import type { Metadata } from "next";
import { SourcesSection } from "@/components/sources/SourcesSection";
import { RoutePage } from "@/components/layout/RoutePage";

export const metadata: Metadata = {
  title: "Evidence Base | Global Public Health Lens",
  description: "The public sources and evidence behind Global Public Health Lens.",
};

export default function EvidenceBasePage() {
  return (
    <RoutePage breadcrumb="Evidence Base">
      <SourcesSection />
    </RoutePage>
  );
}
