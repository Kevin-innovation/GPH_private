export const siteConfig = {
  organization: "Global Public Health Lens",
  shortName: "GPHL",
  tagline: "Understanding health through a global lens.",
  email: "[INSERT ORGANIZATION EMAIL]",
  socialLinks: [] as { label: string; url: string }[],
  domain: "[INSERT DOMAIN]",
  nutritionApp: {
    name: "GPH Lens: Nutrition",
    status: "coming-soon" as "coming-soon" | "live",
    webUrl: "",
    appStoreUrl: "",
    googlePlayUrl: "",
  },
  contact: {
    endpoint: "",
    responseTime: "[INSERT, E.G. 3-5 WORKING DAYS]",
  },
  lastReviewedAt: "2026-08-20",
} as const;
