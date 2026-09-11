import { ButtonLink, StatusPill } from "@/components/ui/ButtonLink";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { SectionShell } from "@/components/ui/SectionShell";
import { appFeatures } from "@/content/app-preview";
import { legal } from "@/content/legal";
import { orphanSafeText } from "@/components/ui/orphanSafeText";
import { siteConfig } from "@/content/site-config";
import { AppScreenshots } from "./AppScreenshots";
import { AppWorkflow } from "./AppWorkflow";

export function NutritionAppPreview() {
  const isLive = siteConfig.nutritionApp.status === "live" && siteConfig.nutritionApp.webUrl;

  return (
    <SectionShell id="app" surface="cloud" labelledBy="app-title" className="nutrition-app-section">
      <div className="page-width app-grid">
        <div className="app-copy">
          <Eyebrow>First tool · Nutrition</Eyebrow>
          <h2 id="app-title">Explore one public-health lens through <span className="no-orphan">everyday food.</span></h2>
          <p>Use a 240-food catalog to see 13 micronutrients respond and learn how personal patterns connect to a wider public-health context. Guest data stays in your browser — <span className="no-orphan">no install or account.</span></p>
          <AppWorkflow />
          <div className="feature-line">
            <span>What it does</span>
            {appFeatures.map((feature) => (
              <span key={feature}>{feature}</span>
            ))}
          </div>
          <p className="app-disclaimer">{orphanSafeText(legal.appDisclaimer)}</p>
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
