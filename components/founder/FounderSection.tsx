import { Eyebrow } from "@/components/ui/Eyebrow";
import { ExternalLink } from "@/components/ui/ExternalLink";
import { SectionShell } from "@/components/ui/SectionShell";
import { SectionVisual } from "@/components/ui/SectionVisual";
import { orphanSafeText } from "@/components/ui/orphanSafeText";
import { founder } from "@/content/founder";
import { siteConfig } from "@/content/site-config";

// The page is otherwise full of machinery — a globe, an atlas, a scroll story.
// This section is deliberately the quiet one: no selector, no state, no canvas.
// It is a byline page, so the weight is carried by typography and rhythm, and
// the whole thing stays a server component with zero client JavaScript.
const appIsLive = siteConfig.nutritionApp.status === "live" && siteConfig.nutritionApp.webUrl.length > 0;

export function FounderSection() {
  return (
    <SectionShell id="founder" surface="white" labelledBy="founder-title" className="founder-section">
      <SectionVisual variant="team" />
      <div className="page-width founder-grid">
        <div className="founder-identity">
          <Eyebrow>Our team · Founder</Eyebrow>
          {/* Same circular letter-mark language as the nutrient icons, so the
              person who assembled the index appears inside its own system. */}
          <span className="founder-mark" aria-hidden="true">
            {founder.initials}
          </span>
          <h1 id="founder-title">{founder.name}</h1>
          <p className="founder-role">{founder.role}</p>
          <p className="founder-affiliation">{founder.affiliation}</p>

          <dl className="founder-facts">
            {founder.facts.map((fact) => (
              <div key={fact.term}>
                <dt>{fact.term}</dt>
                <dd>{orphanSafeText(fact.detail)}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="founder-story">
          <p className="founder-standfirst">{orphanSafeText(founder.standfirst)}</p>

          <ol className="founder-chapters">
            {founder.chapters.map((chapter, index) => (
              <li key={chapter.id}>
                <span className="founder-chapter-index" aria-hidden="true">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <div className="founder-chapter-copy">
                  <h3>{chapter.label}</h3>
                  <p>{orphanSafeText(chapter.body)}</p>
                </div>
              </li>
            ))}
          </ol>

          {appIsLive ? (
            <p className="founder-signoff">
              <ExternalLink href={siteConfig.nutritionApp.webUrl}>
                Open {siteConfig.nutritionApp.name}
                <span className="founder-signoff-arrow" aria-hidden="true">
                  ↗
                </span>
              </ExternalLink>
            </p>
          ) : null}
        </div>
      </div>
    </SectionShell>
  );
}
