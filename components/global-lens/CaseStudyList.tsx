import { Eyebrow } from "@/components/ui/Eyebrow";
import { ExternalLink } from "@/components/ui/ExternalLink";
import { orphanSafeText } from "@/components/ui/orphanSafeText";
import { caseStudies } from "@/content/case-studies";

// Every case study follows the same three beats. Rendered as a vertical stepped
// rule rather than a boxed row: it sits in a narrow column where three across
// wrapped every label, and it matches the LensChain pattern used higher up.
const pathwaySteps = [
  { step: "01", title: "Need", detail: "Spot the gap" },
  { step: "02", title: "Reach", detail: "Deliver through food" },
  { step: "03", title: "Learn", detail: "Sustain the change" },
];

function CasePathway() {
  return (
    <div className="case-pathway">
      <p className="case-pathway-label">From evidence to action</p>
      <ol className="case-pathway-track">
        {pathwaySteps.map((item) => (
          <li className="case-pathway-step" key={item.step}>
            <span className="case-pathway-dot">{item.step}</span>
            <b>{orphanSafeText(item.title)}</b>
            <small>{orphanSafeText(item.detail)}</small>
          </li>
        ))}
      </ol>
    </div>
  );
}

export function CaseStudyList() {
  return (
    <div className="case-studies">
      <div>
        <Eyebrow>First initiative: nutrition</Eyebrow>
        <h3>One lens, applied <span className="no-orphan">in practice.</span></h3>
        {/* One instance, not one per study: these three beats are the same for
            every case below, so this is a key for reading them — repeating it
            inside each panel just printed identical content three times. */}
        <CasePathway />
      </div>
      <div className="case-list">
        {caseStudies.map((study, index) => (
          <details key={study.slug} className="case-row">
            <summary>
              <span className="row-index">0{index + 1}</span>
              <span>{orphanSafeText(study.title)}</span>
              <span className="summary-mark" aria-hidden="true">
                <span className="summary-action" />
                <b>+</b>
              </span>
            </summary>
            <div className="case-detail">
              <div className="case-detail-copy">
                <p>
                  <b>Location:</b> {orphanSafeText(study.location)}
                </p>
                <p>
                  <b>Issue:</b> {orphanSafeText(study.issue)}
                </p>
                <p>
                  <b>Population:</b> {orphanSafeText(study.population)}
                </p>
                <p>
                  <b>Intervention:</b> {orphanSafeText(study.intervention)}
                </p>
                <p>
                  <b>Lessons:</b> {orphanSafeText(study.lessons)}
                </p>
                <ExternalLink href={study.sources[0].url}>
                  {orphanSafeText(`Read the ${study.sources[0].organization} source`)}
                </ExternalLink>
              </div>
            </div>
          </details>
        ))}
      </div>
    </div>
  );
}
