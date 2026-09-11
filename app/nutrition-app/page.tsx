import type { Metadata } from "next";
import { NutritionAppPreview } from "@/components/app-preview/NutritionAppPreview";
import { RoutePage } from "@/components/layout/RoutePage";

export const metadata: Metadata = {
  title: "Nutrition App | Global Public Health Lens",
  description: "Explore micronutrients through an evidence-led nutrition tool.",
};

export default function NutritionAppPage() {
  return (
    <RoutePage breadcrumb="Nutrition App">
      <NutritionAppPreview />
    </RoutePage>
  );
}
