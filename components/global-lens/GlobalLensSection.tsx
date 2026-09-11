import { SectionHeading } from "@/components/ui/SectionHeading";
import { SectionShell } from "@/components/ui/SectionShell";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { HeroVisual } from "@/components/hero/HeroVisual";
import { LensChain } from "./LensChain";

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
        <div className="global-lens-hero">
          <HeroVisual />
        </div>
        <LensChain />
        <div className="lens-next-step">
          <div>
            <Eyebrow>Continue the lens</Eyebrow>
            <h3>From understanding to <span className="no-orphan">action.</span></h3>
            <p>See the conditions and public-health responses that can change outcomes.</p>
          </div>
          <a className="button button-secondary button-cta" href="/lens/solutions">
            <span>Solutions &amp; Action</span>
            <span className="button-arrow" aria-hidden="true">→</span>
          </a>
        </div>
      </div>
    </SectionShell>
  );
}
