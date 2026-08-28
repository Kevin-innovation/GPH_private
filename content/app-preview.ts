export const appWorkflow = [
  { step: "01", title: "Add Food", body: "Choose from 240 foods." },
  { step: "02", title: "Enter Amount", body: "Use grams or servings." },
  { step: "03", title: "Track Micronutrients", body: "See 13 vitamins + minerals." },
  { step: "04", title: "Review Your Pattern", body: "Compare gaps, score + trends." },
] as const;

export const appFeatures = [
  "240 foods",
  "Grams or servings",
  "13 micronutrients",
  "Daily score and gaps",
  "7 / 30-day trends",
] as const;
