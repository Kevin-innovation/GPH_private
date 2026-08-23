import type { CaseStudy } from "./types";

const reviewedAt = "2026-08-20";

export const caseStudies: CaseStudy[] = [
  {
    slug: "universal-salt-iodization",
    title: "Universal salt iodization",
    location: "Multiple countries",
    issue: "Iodine deficiency can affect thyroid function and child development when diets do not provide enough iodine.",
    population: "Communities reached through household and commercially produced salt.",
    intervention: "Iodine is added to salt, with standards, monitoring, and public-health coordination.",
    lessons: "A common food vehicle can make prevention more equitable when quality control and coverage are sustained.",
    sources: [{ organization: "WHO", title: "Micronutrients", url: "https://www.who.int/health-topics/micronutrients", reviewedAt }],
    reviewedAt,
  },
  {
    slug: "fortifying-staple-flours-and-grains",
    title: "Fortifying staple flours and grains",
    location: "Programs across regions",
    issue: "Staple diets can provide energy without enough of the vitamins and minerals needed for health.",
    population: "People who regularly consume centrally processed flour or grain products.",
    intervention: "Selected staple foods are fortified through standards, supply-chain controls, and quality monitoring.",
    lessons: "Fortification works best alongside dietary diversity, transparent standards, and attention to who is not reached.",
    sources: [{ organization: "WHO", title: "Food fortification", url: "https://www.who.int/health-topics/food-fortification", reviewedAt }],
    reviewedAt,
  },
  {
    slug: "vitamin-a-programs-for-young-children",
    title: "Vitamin A programs for young children",
    location: "Countries with high deficiency risk",
    issue: "Young children may face increased risk when diets are limited and infection burden is high.",
    population: "Young children reached through child-health and community delivery programs.",
    intervention: "Programs combine supplementation with child health services, nutrition education, and monitoring.",
    lessons: "Delivery systems and local context matter as much as the nutrient itself; programs need reliable follow-through.",
    sources: [{ organization: "UNICEF", title: "Child Nutrition", url: "https://data.unicef.org/topic/nutrition/child-nutrition/", reviewedAt }],
    reviewedAt,
  },
];
