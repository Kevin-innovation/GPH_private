import assert from "node:assert/strict";
import { readFile, stat } from "node:fs/promises";
import { join } from "node:path";
import test from "node:test";

const projectRoot = new URL("../", import.meta.url).pathname;
const contentFiles = [
  "content/case-studies.ts",
  "content/countries.ts",
  "content/nutrients.ts",
  "content/sources.ts",
];

async function readProjectFile(path) {
  return readFile(join(projectRoot, path), "utf8");
}

test("production build emits the client and server entry points", async () => {
  const [clientManifest, serverEntry] = await Promise.all([
    stat(join(projectRoot, "dist/client/.vite/manifest.json")),
    stat(join(projectRoot, "dist/server/index.js")),
  ]);

  assert.ok(clientManifest.size > 0, "client manifest should not be empty");
  assert.ok(serverEntry.size > 0, "server entry should not be empty");
});

test("editorial source URLs use HTTPS and review dates are valid", async () => {
  const today = new Date();
  today.setUTCHours(23, 59, 59, 999);

  for (const path of contentFiles) {
    const source = await readProjectFile(path);
    const urls = [...source.matchAll(/(?:url|sourceUrl):\s*"([^"]+)"/g)].map((match) => match[1]);
    const inlineDates = [...source.matchAll(/reviewedAt:\s*"([^"]+)"/g)].map((match) => match[1]);
    const sharedDates = [...source.matchAll(/const reviewedAt = "([^"]+)"/g)].map((match) => match[1]);
    const dates = [...inlineDates, ...sharedDates];

    assert.ok(urls.length > 0, `${path} should include at least one source URL`);
    assert.ok(dates.length > 0, `${path} should include at least one review date`);

    for (const url of urls) {
      assert.doesNotThrow(() => new URL(url), `${path} contains an invalid URL: ${url}`);
      assert.ok(url.startsWith("https://"), `${path} source URL must use HTTPS: ${url}`);
    }

    for (const date of dates) {
      assert.match(date, /^\d{4}-\d{2}-\d{2}$/, `${path} review date must use YYYY-MM-DD`);
      const parsed = new Date(`${date}T00:00:00Z`);
      assert.ok(Number.isFinite(parsed.getTime()), `${path} contains an invalid review date: ${date}`);
      assert.ok(parsed <= today, `${path} review date cannot be in the future: ${date}`);
    }
  }
});

test("country spotlight keeps the five agreed examples", async () => {
  const source = await readProjectFile("content/countries.ts");
  const countryIds = [...source.matchAll(/^\s{4}id:\s*"([^"]+)",/gm)].map((match) => match[1]);

  assert.deepEqual(countryIds, ["south-korea", "india", "mexico", "france", "united-states"]);
});

test("Three.js remains lazy-loaded and the globe uses the compact texture", async () => {
  const files = [
    "components/hero/HeroVisual.tsx",
    "components/global-lens/CountrySpotlight.tsx",
  ];

  for (const path of files) {
    const source = await readProjectFile(path);
    assert.doesNotMatch(source, /^import \* as THREE from "three";/m, `${path} must not statically import Three.js`);
    assert.match(source, /await import\("three"\)/, `${path} should lazy-load Three.js`);
  }

  const countryGlobe = await readProjectFile("components/global-lens/CountrySpotlight.tsx");
  assert.match(countryGlobe, /\/brand\/earth-atmos-2048\.jpg/);
  assert.doesNotMatch(countryGlobe, /earth-clear-8192/);
});

test("multi-page information architecture exposes canonical destinations", async () => {
  const expectedRoutes = [
    "/about/mission",
    "/about/team",
    "/country-spotlight",
    "/lens/micronutrients",
    "/lens/how-it-works",
    "/lens/solutions",
    "/nutrition-app",
    "/evidence-base",
    "/contact",
  ];
  const navigation = await readProjectFile("content/navigation.ts");
  const header = await readProjectFile("components/layout/Header.tsx");
  const directory = await readProjectFile("components/home/HomeDirectory.tsx");
  const globalLens = await readProjectFile("components/global-lens/GlobalLensSection.tsx");
  const solutionsPage = await readProjectFile("components/global-lens/SolutionsPageSection.tsx");
  const css = await readProjectFile("app/globals.css");

  for (const route of expectedRoutes) {
    const routeFile = join(projectRoot, "app", route.slice(1), "page.tsx");
    await stat(routeFile);
    if (route !== "/evidence-base") {
      assert.match(navigation, new RegExp(route.replaceAll("/", "\\/")), `navigation should include ${route}`);
    }
  }

  assert.doesNotMatch(header, /Explore the Map/, "the header must not duplicate Country Spotlight with a map CTA");
  assert.match(header, /href="\/"/, "the brand lockup should have a native home destination");
  assert.match(header, /className=\{`menu-toggle\$\{mobileOpen/, "mobile navigation should expose a stateful hamburger control");
  assert.match(header, /aria-controls="mobile-navigation"/, "hamburger control should own the mobile navigation surface");
  assert.match(header, /didMountPathRef/, "initial pathname hydration should not close an immediately opened mobile menu");
  assert.match(css, /filtered header becomes the fixed-position containing block/, "mobile menu should document the filtered-header positioning fix");
  assert.match(css, /\.menu-toggle\.is-open \.menu-lines i:nth-child\(1\)/, "hamburger should show an explicit open state");
  assert.ok(
    navigation.indexOf('label: "About"') < navigation.indexOf('label: "The Lens"')
      && navigation.indexOf('label: "The Lens"') < navigation.indexOf('label: "Country Spotlight"')
      && navigation.indexOf('label: "Country Spotlight"') < navigation.indexOf('label: "Nutrition App"')
      && navigation.indexOf('label: "Nutrition App"') < navigation.indexOf('label: "Contact"'),
    "primary navigation should follow the approved About → Lens → Country → App → Contact order",
  );
  assert.match(header, /nav-direct-link/, "direct destinations should expose a themed navigation class");
  assert.match(directory, /className="home-pathways"/, "home should expose a concise pathway navigation");
  assert.match(directory, /href=\{pathway\.href\}/, "home pathway rows should expose real href values");
  assert.doesNotMatch(directory, /directory-groups|One project, several ways/, "home must not repeat the full sitemap");
  assert.doesNotMatch(globalLens, /SolutionsList|CaseStudyList|Conditions for health/, "How the Lens Works must not duplicate the Solutions content");
  assert.match(solutionsPage, /SolutionsList/, "Solutions & Action should own the Conditions for health list");
});

test("vertical shell foundations stay in place", async () => {
  const routePage = await readProjectFile("components/layout/RoutePage.tsx");
  const header = await readProjectFile("components/layout/Header.tsx");
  const css = await readProjectFile("app/globals.css");

  assert.match(routePage, /route-main route-frame/, "detail routes should use the vertical shell frame");
  assert.match(css, /--primitive-navy:/, "primitive design tokens should be declared");
  assert.match(css, /--surface-page:/, "semantic surface tokens should be declared");
  assert.match(css, /--header-background-scrolled:/, "header component tokens should be declared");
  assert.match(css, /\.route-main\s*\{\s*min-height:\s*0;/, "route main should not force a viewport-sized blank area");
  assert.match(css, /\.page-hero-inner/, "page hero shell styles should exist");
  assert.match(css, /\.related-pages/, "related page shell styles should exist");
  assert.match(header, /is-home/, "home header should expose its immersive overlay state");
  assert.match(css, /\.site-header\.is-home:not\(\.is-scrolled\)/, "home header should transition from overlay to raised surface");
  assert.match(header, /data-scrolled/, "header should expose its scroll state");
});

test("About pages keep the mission rail and founder pathways distinct", async () => {
  const mission = await readProjectFile("components/mission/MissionSection.tsx");
  const founder = await readProjectFile("components/founder/FounderSection.tsx");
  const missionPage = await readProjectFile("app/about/mission/page.tsx");
  const teamPage = await readProjectFile("app/about/team/page.tsx");

  assert.match(mission, /className="mission-storyline"/, "Mission should use the vertical determinant story rail");
  assert.match(mission, /determinants\.map/, "Mission should retain all determinant controls");
  assert.doesNotMatch(mission, /onMouseEnter/, "determinants should not switch state on hover");
  assert.match(founder, /Our team · Founder/, "Team should identify the founder within the team page");
  assert.match(founder, /founder\.facts/, "Team should render founder facts");
  assert.match(missionPage, /RelatedPages/, "Mission should link to the next About page");
  assert.match(teamPage, /RelatedPages/, "Team should expose related About/contact paths");
});

test("Country and Lens routes keep the vertical interactive story", async () => {
  const country = await readProjectFile("components/global-lens/CountrySpotlight.tsx");
  const countryPage = await readProjectFile("app/country-spotlight/page.tsx");
  const lens = await readProjectFile("components/global-lens/GlobalLensSection.tsx");
  const chain = await readProjectFile("components/global-lens/LensChain.tsx");
  const css = await readProjectFile("app/globals.css");

  assert.match(country, /SphereGeometry\(0\.035/,
    "capital markers should stay compact at country zoom");
  assert.match(country, /RingGeometry\(0\.052, 0\.064/,
    "capital pulse rings should stay compact and readable");
  assert.match(countryPage, /RelatedPages/, "Country Spotlight should hand off to the Lens story");
  assert.match(lens, /HeroVisual/, "How the Lens Works should open with the interactive lens stage");
  assert.match(chain, /lens-chain-editorial/, "Lens levels should use the vertical editorial chain");
  assert.match(css, /\.country-spotlight-layout\s*\{\s*display:\s*block;/,
    "Country Spotlight should not force a desktop split layout");
  assert.match(css, /\.global-lens-hero/, "How the Lens Works should have a dedicated interactive hero surface");
});

test("Phase 5 lens content uses vertical lists and connected handoffs", async () => {
  const micronutrients = await readProjectFile("components/micronutrients/NutrientAtlas.tsx");
  const micronutrientsPage = await readProjectFile("app/lens/micronutrients/page.tsx");
  const solutions = await readProjectFile("components/global-lens/SolutionsPageSection.tsx");
  const solutionsList = await readProjectFile("components/global-lens/SolutionsList.tsx");
  const appPreview = await readProjectFile("components/app-preview/NutritionAppPreview.tsx");
  const appPage = await readProjectFile("app/nutrition-app/page.tsx");
  const css = await readProjectFile("app/globals.css");

  assert.match(micronutrients, /MobileNutrientList/, "Micronutrients should keep the inline vertical detail list");
  assert.match(micronutrientsPage, /RelatedPages/, "Micronutrients should hand off to Nutrition App");
  assert.match(solutions, /SolutionsList/, "Solutions should own the conditions list");
  assert.match(solutionsList, /solutions\.map/, "Solutions should retain all six action conditions");
  assert.match(appPreview, /nutrition-app-section/, "Nutrition App should expose a scoped vertical layout hook");
  assert.match(appPage, /RelatedPages/, "Nutrition App should hand off to Micronutrients");
  assert.match(css, /\.micronutrient-shell \.atlas-mobile-list/, "Micronutrients should render a desktop vertical list");
  assert.match(css, /\.solutions-page-section \.solutions-wrap/, "Solutions should remove the desktop split");
  assert.match(css, /\.nutrition-app-section \.app-grid/, "Nutrition App should remove the desktop split");
  assert.match(micronutrients, /expandedSlug/, "Micronutrient rows should track their expanded detail independently");
  assert.match(micronutrients, /toggleMobileNutrient/, "Micronutrient minus controls should collapse an open detail");
  assert.match(micronutrients, /IntersectionObserver/, "Micronutrient scroll reveals should have a browser-safe fallback");
  assert.match(micronutrients, /onAutoSelect/, "Micronutrient rows should advance the expanded detail from scroll position");
  assert.match(micronutrients, /rootMargin: "-42% 0px -42% 0px"/, "Micronutrient auto-expansion should use a stable viewport reading band");
  assert.match(micronutrients, /autoSuppressedUntilRef/, "Manual nutrient toggles should not be overridden by layout-triggered observer callbacks");
  assert.match(micronutrients, /waitForInputAfterHandoff = false/, "A new scroll gesture should resume the nutrient hand-off sequence");
  assert.match(micronutrients, /settleDelay = 180/, "Scroll-driven nutrient selection should respond after a short quiet reading window");
  assert.match(micronutrients, /currentDistance - targetDistance < 32/, "Nutrient focus should use hysteresis at row boundaries");
  assert.match(micronutrients, /atlas-mobile-detail-shell/, "Nutrient details should keep a transition shell to avoid layout jumps");
  assert.match(micronutrients, /lastAutoSelectScrollYRef/, "Scroll hand-offs should remember the reader position without moving it");
  assert.doesNotMatch(micronutrients, /window\.scrollTo\(\{ top: window\.scrollY/, "Nutrient hand-offs should not pull the page upward while a detail opens");
  assert.match(css, /\.micronutrient-shell \.atlas-mobile-item\.is-reveal-visible/, "Micronutrient rows should animate into view without hiding by default");
  assert.match(css, /phase5-nutrient-detail-in/, "The active nutrient detail should enter with a smooth scroll-linked transition");
  assert.match(css, /phase5-nutrient-detail-settle/, "Nutrient detail changes should use a settled transition");
  assert.match(css, /grid-template-rows: 0fr/, "Nutrient detail shells should collapse without removing layout in one frame");
  assert.match(css, /\.micronutrient-shell \.atlas-mobile-list[\s\S]*overflow-anchor: none/, "Nutrient hand-offs should not be moved by native scroll anchoring");
});

test("Phase 6 keeps evidence, contact, and typography connected", async () => {
  const contact = await readProjectFile("app/contact/page.tsx");
  const contactSection = await readProjectFile("components/contact/ContactSection.tsx");
  const evidence = await readProjectFile("app/evidence-base/page.tsx");
  const sources = await readProjectFile("components/sources/SourcesSection.tsx");
  const lensPage = await readProjectFile("app/lens/how-it-works/page.tsx");
  const layout = await readProjectFile("app/layout.tsx");
  const css = await readProjectFile("app/globals.css");

  assert.match(contact, /RelatedPages/, "Contact should expose meaningful next paths");
  assert.match(contactSection, /className="contact-section"/, "Contact should keep a scoped vertical layout hook");
  assert.match(evidence, /RelatedPages/, "Evidence Base should connect back to action and contact");
  assert.match(sources, /eyebrow="Evidence Base"/, "Evidence Base label should match the route name");
  assert.match(lensPage, /RelatedPages/, "How the Lens Works should expose its next lens paths");
  assert.match(layout, /globals\.css/, "The root layout should load the shared typography stylesheet");
  assert.match(css, /api\.fontshare\.com\/v2\/css\?f\[\]=satoshi/, "Typography should load Satoshi from Fontshare");
  assert.match(css, /body > main\.route-main\s*\{\s*flex: 1 0 auto;/, "short routes should keep the footer at the viewport floor");
  assert.match(css, /h1,\s*h2\s*\{\s*font-weight: 700 !important;/, "display headings should not render as hairline text");
});

test("Phase 7 makes typography and action targets unmistakable", async () => {
  const home = await readProjectFile("components/home/HomeDirectory.tsx");
  const lens = await readProjectFile("components/global-lens/GlobalLensSection.tsx");
  const related = await readProjectFile("components/layout/RelatedPages.tsx");
  const appScreenshots = await readProjectFile("components/app-preview/AppScreenshots.tsx");
  const sectionShell = await readProjectFile("components/ui/SectionShell.tsx");
  const sectionVisual = await readProjectFile("components/ui/SectionVisual.tsx");
  const mission = await readProjectFile("components/mission/MissionSection.tsx");
  const founder = await readProjectFile("components/founder/FounderSection.tsx");
  const solutionsPage = await readProjectFile("components/global-lens/SolutionsPageSection.tsx");
  const css = await readProjectFile("app/globals.css");

  assert.match(home, /button button-secondary button-cta/, "home evidence handoff should use the shared button treatment");
  assert.match(lens, /button button-secondary button-cta/, "lens handoff should use the shared button treatment");
  assert.match(related, /related-page-link/, "related routes should expose a stable button-like target");
  assert.match(css, /h1,\s*h2,\s*h3,\s*h4\s*\{\s*font-weight: 700 !important;/, "all display headings should use a bold Satoshi weight");
  assert.match(css, /\.desktop-nav > a,\s*\.desktop-nav \.nav-disclosure/, "primary navigation should expose outlined hit areas");
  assert.match(css, /\.country-spotlight-country-list button\s*\{[\s\S]*border-radius: 999px;/, "country selectors should read as pill controls");
  assert.match(css, /\.country-spotlight-country-list\s*\{\s*border-top: 0 !important;\s*border-bottom: 0 !important;/, "country selector rail should not duplicate wrapper borders");
  assert.match(css, /\.desktop-nav > a\.nav-direct-nutrition-app[\s\S]*backdrop-filter: blur\(16px\)/, "Nutrition App should be the only colored glass navigation destination");
  assert.match(css, /\.desktop-nav > a\.nav-direct-country-spotlight,\s*\.desktop-nav > a\.nav-direct-contact\s*\{\s*border-color: rgba\(18, 49, 75, 0\.16\)/, "Country and Contact should remain neutral at rest");
  assert.match(appScreenshots, /media-clip-reveal/, "app imagery should expose a stable scroll-reveal hook");
  assert.match(appScreenshots, /IntersectionObserver/, "app imagery reveal should have a browser fallback");
  assert.match(css, /@keyframes phase7-media-clip-reveal/, "app imagery should define a clip-path reveal animation");
  assert.match(css, /\.media-clip-reveal\s*\{[\s\S]*clip-path:\s*inset\(0 0 0 0 round 0\)/, "app imagery should remain visible before the reveal observer runs");
  assert.match(sectionShell, /chapter-reveal/, "shared sections should expose a chapter reveal hook");
  assert.match(sectionShell, /IntersectionObserver/, "chapter reveal should have a browser fallback");
  assert.match(css, /@keyframes phase7-chapter-reveal/, "sections should define a chapter entrance animation");
  assert.match(css, /\.chapter-reveal\s*\{[\s\S]*opacity:\s*1;[\s\S]*transform:\s*none;/, "sections should remain visible before the reveal observer runs");
  assert.match(sectionVisual, /variant === "mission"[\s\S]*variant === "team"[\s\S]*variant === "solutions"/, "section visuals should provide the three editorial variants");
  assert.match(mission, /SectionVisual variant="mission"/, "Our Mission should carry its own visual atmosphere");
  assert.match(founder, /SectionVisual variant="team"/, "Our Team should carry its own visual atmosphere");
  assert.match(solutionsPage, /SectionVisual variant="solutions"/, "Solutions & Action should carry its own visual atmosphere");
  assert.match(css, /@keyframes phase7-section-visual-reveal/, "section visuals should reveal as a background atmosphere");
  assert.match(css, /\.section-visual::after\s*\{[\s\S]*linear-gradient\(90deg/, "section visuals should fade into the content background");
});
