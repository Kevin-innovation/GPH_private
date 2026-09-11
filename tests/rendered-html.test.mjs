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

  for (const route of expectedRoutes) {
    const routeFile = join(projectRoot, "app", route.slice(1), "page.tsx");
    await stat(routeFile);
    if (route !== "/evidence-base") {
      assert.match(navigation, new RegExp(route.replaceAll("/", "\\/")), `navigation should include ${route}`);
    }
  }

  assert.doesNotMatch(header, /Explore the Map/, "the header must not duplicate Country Spotlight with a map CTA");
  assert.match(header, /href="\/"/, "the brand lockup should have a native home destination");
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
  assert.match(header, /data-scrolled/, "header should expose its scroll state");
});
