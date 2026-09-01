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
