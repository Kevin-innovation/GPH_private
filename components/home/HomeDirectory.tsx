import { Eyebrow } from "@/components/ui/Eyebrow";
import { SectionShell } from "@/components/ui/SectionShell";

const pathways = [
  {
    kicker: "Start with a place",
    title: "Country Spotlight",
    body: "Compare five public-health starting points and the local conditions behind them.",
    href: "/country-spotlight",
  },
  {
    kicker: "Start with a daily pattern",
    title: "Nutrition App",
    body: "Explore the first practical tool built from the same body–environment–systems lens.",
    href: "/nutrition-app",
  },
] as const;

export function HomeDirectory() {
  return (
    <SectionShell id="home-directory" surface="white" labelledBy="home-directory-title" className="home-directory">
      <div className="page-width">
        <div className="home-definition">
          <div>
            <Eyebrow>Project in brief</Eyebrow>
            <h2 id="home-directory-title">
              A public-health lens for <span className="no-orphan">the conditions around us.</span>
            </h2>
          </div>
          <p>
            Global Public Health Lens connects what happens in the body with place, environment, inequality, policy,
            and access to care. Nutrition is our first lens — <span className="no-orphan">not our last.</span>
          </p>
        </div>

        <nav className="home-pathways" aria-label="Start exploring the project">
          <Eyebrow>Choose a starting point</Eyebrow>
          <ul>
            {pathways.map((pathway) => (
              <li key={pathway.href}>
                <a href={pathway.href}>
                  <span className="home-pathway-kicker">{pathway.kicker}</span>
                  <span className="home-pathway-title">{pathway.title}</span>
                  <span className="home-pathway-body">{pathway.body}</span>
                  <span className="home-pathway-arrow" aria-hidden="true">→</span>
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="home-evidence-strip">
          <div>
            <Eyebrow>Evidence base</Eyebrow>
            <p>
              The lens starts with public sources and stays open to review. See the organisations and references behind
              <span className="no-orphan"> each page.</span>
            </p>
          </div>
          <a className="button button-secondary button-cta" href="/evidence-base">
            <span>Read the evidence base</span>
            <span className="button-arrow" aria-hidden="true">→</span>
          </a>
        </div>
      </div>
    </SectionShell>
  );
}
