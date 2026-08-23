export type Nutrient = {
  slug: string;
  name: string;
  category: "vitamin" | "mineral";
  bodyFunctions: string[];
  summary: string;
  whatItDoes: string;
  foodSources: string;
  globalLens: string;
  safetyNote: string;
  source: string;
  sourceUrl: string;
  reviewedAt: string;
};

export type Source = {
  organization: string;
  title: string;
  url: string;
  reviewedAt: string;
};

export type CaseStudy = {
  slug: string;
  title: string;
  location: string;
  issue: string;
  population: string;
  intervention: string;
  lessons: string;
  sources: Source[];
  reviewedAt: string;
};
