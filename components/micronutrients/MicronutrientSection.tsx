import { SectionHeading } from "@/components/ui/SectionHeading";
import { SectionShell } from "@/components/ui/SectionShell";
import { NutrientAtlas } from "./NutrientAtlas";

export function MicronutrientSection() {
  return (
    <SectionShell id="micronutrients" surface="cloud" labelledBy="micronutrients-title">
      <div className="page-width micronutrient-shell">
        <div className="micronutrient-intro">
          <div>
            <SectionHeading eyebrow="A first initiative" title="A clearer way into micronutrients." id="micronutrients-title" />
          </div>
          <div className="micronutrient-intro-copy">
            <p>
              Start with one nutrient, then connect the body, food sources, and public-health systems around it.
            </p>
            <div className="side-note">
              <span className="note-marker">Note</span>
              <p>Educational context only — not a diagnosis or supplement recommendation.</p>
            </div>
          </div>
        </div>
        <NutrientAtlas />
      </div>
    </SectionShell>
  );
}
