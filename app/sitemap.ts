import type { MetadataRoute } from "next";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://global-lens-gamma.vercel.app";
const paths = [
  "/",
  "/about/mission",
  "/about/team",
  "/country-spotlight",
  "/lens/micronutrients",
  "/lens/how-it-works",
  "/lens/solutions",
  "/nutrition-app",
  "/evidence-base",
  "/contact",
] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  return paths.map((path) => ({ url: `${siteUrl}${path}`, lastModified: new Date("2026-09-01") }));
}
