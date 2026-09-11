import type { Metadata } from "next";
import { RelatedPages } from "@/components/layout/RelatedPages";
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
      <div className="page-width route-related-wrap">
        <RelatedPages
          title="Continue to action"
          pages={[
            {
              label: "Solutions & Action",
              href: "/lens/solutions",
              description: "See how evidence becomes practical public-health action.",
            },
            {
              label: "Contact",
              href: "/contact",
              description: "Ask a question about the sources or the project.",
            },
          ]}
        />
      </div>
    </RoutePage>
  );
}
