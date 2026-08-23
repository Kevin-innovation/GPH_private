import { ButtonLink } from "@/components/ui/ButtonLink";
import { HeroVisual } from "./HeroVisual";

export function Hero() {
  return (
    <section className="hero-section" id="hero" aria-labelledby="hero-title">
      <div className="page-width hero-grid">
        <div className="hero-heading">
          {/* The organisation name, not a section kicker. It was rendering at the
              same 12.5px as every other eyebrow on the page, which put the site's
              own name a rung below its tagline. Set as the wordmark instead, in
              the header lockup's own treatment so the brand reads consistently. */}
          <p className="hero-wordmark">
            Global Public Health <span>Lens</span>
          </p>
          <h1 id="hero-title">
            Understanding health
            <br />
            through a global lens.
          </h1>
        </div>
        <div className="hero-copy">
          <p className="hero-supporting">
            Explore how nutrition, food access, geography, policy, and inequality shape the health of communities around the
            world.
          </p>
          {/* Two routes out of the hero, per the brief: into the guide, or to the app.
              The header already carries "Explore the App", so the primary here leads
              into the content rather than duplicating that link. */}
          <div className="button-row">
            <ButtonLink href="#micronutrients">Explore Micronutrients</ButtonLink>
            <ButtonLink href="#app" variant="secondary">
              Discover the Nutrition App
            </ButtonLink>
          </div>
          <p className="hero-note">
            Learning that connects what happens in the body with what communities and public-health systems can do.
          </p>
        </div>
        <HeroVisual />
      </div>
    </section>
  );
}
