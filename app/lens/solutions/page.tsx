import type { Metadata } from "next";
import { RelatedPages } from "@/components/layout/RelatedPages";
import { SolutionsPageSection } from "@/components/global-lens/SolutionsPageSection";
import { RoutePage } from "@/components/layout/RoutePage";

export const metadata: Metadata = {
  title: "Solutions & Action | Global Public Health Lens",
  description: "See the public-health actions and conditions that can change outcomes.",
};

export default function SolutionsPage() {
  return (
    <RoutePage breadcrumb="Solutions & Action">
      <SolutionsPageSection />
      <div className="page-width route-related-wrap">
        <RelatedPages
          pages={[
            {
              label: "Evidence Base",
              href: "/evidence-base",
              description: "Read the public sources behind the action pathways.",
            },
          ]}
        />
      </div>
    </RoutePage>
  );
}
