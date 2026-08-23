export const appWorkflow = [
  { step: "01", title: "Add Food", body: "Record a food from your day." },
  { step: "02", title: "Enter Amount", body: "Use grams or familiar servings." },
  { step: "03", title: "Track Micronutrients", body: "See vitamins and minerals together." },
  { step: "04", title: "Review Daily Balance", body: "Reflect on the bigger picture." },
] as const;

export const appFeatures = [
  "Record foods",
  "Enter grams or servings",
  "Track vitamins and minerals",
  "Review daily nutrient balance",
  "View a nutrition score",
] as const;
