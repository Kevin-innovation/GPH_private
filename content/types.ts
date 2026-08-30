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

export type CountrySpotlight = {
  id: string;
  name: string;
  region: string;
  latitude: number;
  longitude: number;
  issueLabel: string;
  issue: string;
  driversLabel: string;
  drivers: string;
  responseLabel: string;
  response: string;
  sources: Source[];
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
