import { SectionHeading } from "@/components/ui/SectionHeading";
import { SectionShell } from "@/components/ui/SectionShell";
import { NutrientAtlas } from "./NutrientAtlas";

export function MicronutrientSection() {
  return (
    <SectionShell id="micronutrients" surface="cloud" labelledBy="micronutrients-title">
      <div className="page-width micronutrient-shell">
        <div className="micronutrient-intro">
          <div>
            <SectionHeading
              eyebrow="Our first applied lens"
              title={<>Nutrition is one lens in a much <span className="no-orphan">bigger picture.</span></>}
              id="micronutrients-title"
            />
          </div>
          <div className="micronutrient-intro-copy">
            <p>
              Explore micronutrients as a worked example — connecting biology and food with access, environment, policy, and
              <span className="no-orphan"> public-health systems.</span>
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
