export const siteConfig = {
  organization: "Global Public Health Lens",
  shortName: "GPHL",
  tagline: "Understanding health through a global lens.",
  email: "[INSERT ORGANIZATION EMAIL]",
  socialLinks: [] as { label: string; url: string }[],
  domain: "[INSERT DOMAIN]",
  nutritionApp: {
    name: "GPH Lens: Nutrition",
    // Keep the launch gated while the app is still in development. The URL is
    // retained for the eventual hand-off, but the landing page renders a
    // non-interactive status pill until this is explicitly switched to live.
    status: "coming-soon" as "coming-soon" | "live",
    webUrl: "https://global-lens-app.vercel.app",
    appStoreUrl: "",
    googlePlayUrl: "",
  },
  contact: {
    endpoint: "",
    responseTime: "[INSERT, E.G. 3-5 WORKING DAYS]",
  },
  lastReviewedAt: "2026-08-20",
} as const;
