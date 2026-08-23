import { Eyebrow } from "@/components/ui/Eyebrow";
import { ExternalLink } from "@/components/ui/ExternalLink";
import type { Nutrient } from "@/content/types";

// Native <details> keeps the expand/collapse behaviour on the server with no client JS.
export function NutrientRow({ nutrient, index, defaultOpen }: { nutrient: Nutrient; index: number; defaultOpen?: boolean }) {
  return (
    <details className="nutrient-row" open={defaultOpen}>
      <summary>
        <span className="nutrient-name">
          <span className="row-index">0{index + 1}</span>
          {nutrient.name}
        </span>
        <span className="nutrient-summary">{nutrient.summary}</span>
        <span className="summary-mark" aria-hidden="true">
          +
        </span>
      </summary>
      <div className="nutrient-detail">
        <div>
          <Eyebrow>What it does in the body</Eyebrow>
          <p>{nutrient.whatItDoes}</p>
        </div>
        <div>
          <Eyebrow>Food sources</Eyebrow>
          <p>{nutrient.foodSources}</p>
        </div>
        <div>
          <Eyebrow>Global public-health lens</Eyebrow>
          <p>{nutrient.globalLens}</p>
        </div>
        <div className="safety-note">
          <Eyebrow>Safety</Eyebrow>
          <p>{nutrient.safetyNote}</p>
        </div>
        <ExternalLink href={nutrient.sourceUrl}>Read the {nutrient.source} fact sheet</ExternalLink>
      </div>
    </details>
  );
}
