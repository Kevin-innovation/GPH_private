import { nutrients } from "@/content/nutrients";
import { NutrientRow } from "./NutrientRow";

// Iron opens by default because it is the nutrient the Global Lens section works through.
const DEFAULT_OPEN_SLUG = "iron";

export function NutrientList() {
  return (
    <div className="nutrient-list">
      {nutrients.map((nutrient, index) => (
        <NutrientRow
          key={nutrient.slug}
          nutrient={nutrient}
          index={index}
          defaultOpen={nutrient.slug === DEFAULT_OPEN_SLUG}
        />
      ))}
    </div>
  );
}
