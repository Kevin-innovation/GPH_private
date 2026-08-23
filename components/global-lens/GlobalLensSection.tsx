import { SectionHeading } from "@/components/ui/SectionHeading";
import { SectionShell } from "@/components/ui/SectionShell";
import { CaseStudyList } from "./CaseStudyList";
import { LensChain } from "./LensChain";
import { SolutionsList } from "./SolutionsList";

export function GlobalLensSection() {
  return (
    <SectionShell id="global-lens" surface="white" labelledBy="global-lens-title" className="global-section">
      <div className="page-width">
        <div className="global-intro">
          <SectionHeading
            eyebrow="The GPHL difference"
            title="One nutrient. Three connected levels."
            id="global-lens-title"
          />
        </div>
        <LensChain />
        <SolutionsList />
        <CaseStudyList />
      </div>
    </SectionShell>
  );
}
