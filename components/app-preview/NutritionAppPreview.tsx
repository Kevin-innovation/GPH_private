import { ButtonLink, StatusPill } from "@/components/ui/ButtonLink";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { SectionShell } from "@/components/ui/SectionShell";
import { appFeatures } from "@/content/app-preview";
import { legal } from "@/content/legal";
import { siteConfig } from "@/content/site-config";
import { AppScreenshots } from "./AppScreenshots";
import { AppWorkflow } from "./AppWorkflow";

export function NutritionAppPreview() {
  const isLive = siteConfig.nutritionApp.status === "live" && siteConfig.nutritionApp.webUrl;

  return (
    <SectionShell id="app" surface="cloud" labelledBy="app-title">
      <div className="page-width app-grid">
        <div className="app-copy">
          <Eyebrow>GPH LENS: NUTRITION</Eyebrow>
          <h2 id="app-title">Turn everyday food choices into a learning experience.</h2>
          <p>A planned app for logging food, seeing nutrient balance, and connecting everyday intake to global nutrition.</p>
          <AppWorkflow />
          <div className="feature-line">
            <span>Planned features</span>
            {appFeatures.map((feature) => (
              <span key={feature}>{feature}</span>
            ))}
          </div>
          <p className="app-disclaimer">{legal.appDisclaimer}</p>
          {isLive ? (
            <ButtonLink href={siteConfig.nutritionApp.webUrl}>Open Nutrition App</ButtonLink>
          ) : (
            <StatusPill>App Coming Soon</StatusPill>
          )}
        </div>
        <AppScreenshots />
      </div>
    </SectionShell>
  );
}
