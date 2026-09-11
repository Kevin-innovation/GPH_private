import type { Metadata } from "next";
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
    </RoutePage>
  );
}
