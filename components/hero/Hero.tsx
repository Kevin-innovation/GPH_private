import { ButtonLink } from "@/components/ui/ButtonLink";
import { HeroVisual } from "./HeroVisual";

export function Hero() {
  return (
    <section className="hero-section hero-section-home" id="hero" aria-labelledby="hero-title">
      <div className="page-width hero-grid">
        <div className="hero-heading">
          <p className="hero-wordmark">
            Global Public Health <span>Lens</span>
          </p>
          <h1 id="hero-title">
            See what shapes health
            <br />
            around <span className="no-orphan">the world.</span>
          </h1>
        </div>
        <div className="hero-copy">
          <p className="hero-supporting">
            Explore how place, environment, inequality, policy, access to care, and nutrition combine to shape health — and
            what <span className="no-orphan">public-health action can change.</span>
          </p>
          <div className="button-row">
            <ButtonLink href="/country-spotlight">Explore Country Spotlight</ButtonLink>
            <ButtonLink href="/lens/how-it-works" variant="secondary">
              See the Public-Health Lens
            </ButtonLink>
          </div>
          <p className="hero-note">
            <span>
              An evidence-led educational project connecting lived experience, local context, and{" "}
              <span className="no-orphan">public systems.</span>
            </span>
          </p>
        </div>
        <HeroVisual />
      </div>
    </section>
  );
}
