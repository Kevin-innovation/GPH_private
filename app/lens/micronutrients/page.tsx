import type { Metadata } from "next";
import { MicronutrientSection } from "@/components/micronutrients/MicronutrientSection";
import { RoutePage } from "@/components/layout/RoutePage";

export const metadata: Metadata = {
  title: "Micronutrients | Global Public Health Lens",
  description: "A practical guide to micronutrients, food sources, and public-health context.",
};

export default function MicronutrientsPage() {
  return (
    <RoutePage breadcrumb="Micronutrients">
      <MicronutrientSection />
    </RoutePage>
  );
}
