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
            eyebrow="How the lens works"
            title={<>One health issue. Three <span className="no-orphan">levels of action.</span></>}
            intro={<>Using iron as a worked example, follow one question from the body to community conditions and <span className="no-orphan">public-health systems.</span></>}
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
