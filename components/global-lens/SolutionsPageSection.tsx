import { CaseStudyList } from "./CaseStudyList";
import { SolutionsList } from "./SolutionsList";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { SectionShell } from "@/components/ui/SectionShell";
import { SectionVisual } from "@/components/ui/SectionVisual";

export function SolutionsPageSection() {
  return (
    <SectionShell id="solutions" surface="white" labelledBy="solutions-page-title" className="solutions-page-section">
      <SectionVisual variant="solutions" />
      <div className="page-width">
        <div className="global-intro">
          <SectionHeading
            eyebrow="Solutions & action"
            title={<>Health changes when <span className="no-orphan">conditions change.</span></>}
            intro={<>Explore practical public-health responses across food, services, environments, policy, and <span className="no-orphan">accountability.</span></>}
            id="solutions-page-title"
            level="h1"
          />
        </div>
        <SolutionsList />
        <CaseStudyList />
      </div>
    </SectionShell>
  );
}
