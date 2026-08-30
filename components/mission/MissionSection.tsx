import { Eyebrow } from "@/components/ui/Eyebrow";
import { SectionShell } from "@/components/ui/SectionShell";

// The six determinants read as one continuous rule-bounded row rather than six cards.
const determinants = ["nutrition", "access", "environment", "geography", "policy", "inequality"];

export function MissionSection() {
  return (
    <SectionShell id="about" surface="white" labelledBy="about-title">
      <div className="page-width mission-grid">
        <div>
          <Eyebrow>Our mission</Eyebrow>
          <h2 id="about-title">Health is shaped by more than individual choices.</h2>
        </div>
        <div className="mission-copy">
          <p className="lead-copy">
            Health is shaped by food access, services, place, and policy — not individual choices alone. Global Public
            Health Lens makes those connections easier to understand.
          </p>
          <div className="mission-story">
            <Eyebrow>Why this project</Eyebrow>
            <p>
              Global Public Health Lens began with a simple question: what changes when we look beyond the nutrient,
              symptom, or individual choice? The project connects evidence about bodies with the places, environments,
              policies, and services that shape everyday health.
            </p>
          </div>
          <div className="determinants" aria-label="Connected health determinants">
            {determinants.map((item, index) => (
              <span key={item}>
                <b>0{index + 1}</b>
                {item}
              </span>
            ))}
          </div>
          <p className="mission-coda">Nutrition is our first lens — not our last.</p>
        </div>
      </div>
    </SectionShell>
  );
}
