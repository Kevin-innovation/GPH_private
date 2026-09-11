import type { Metadata } from "next";
import { GlobalLensSection } from "@/components/global-lens/GlobalLensSection";
import { RoutePage } from "@/components/layout/RoutePage";

export const metadata: Metadata = {
  title: "How the Lens Works | Global Public Health Lens",
  description: "Follow one health issue from the body to community conditions and public-health systems.",
};

export default function HowItWorksPage() {
  return (
    <RoutePage breadcrumb="How the Lens Works">
      <GlobalLensSection />
    </RoutePage>
  );
}
