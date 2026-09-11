import type { Metadata } from "next";
import { NutritionAppPreview } from "@/components/app-preview/NutritionAppPreview";
import { RelatedPages } from "@/components/layout/RelatedPages";
import { RoutePage } from "@/components/layout/RoutePage";

export const metadata: Metadata = {
  title: "Nutrition App | Global Public Health Lens",
  description: "Explore micronutrients through an evidence-led nutrition tool.",
};

export default function NutritionAppPage() {
  return (
    <RoutePage breadcrumb="Nutrition App">
      <NutritionAppPreview />
      <div className="page-width route-related-wrap">
        <RelatedPages
          pages={[
            {
              label: "Micronutrients",
              href: "/lens/micronutrients",
              description: "Start with the evidence behind the app's first lens.",
            },
          ]}
        />
      </div>
    </RoutePage>
  );
}
