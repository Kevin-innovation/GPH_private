// The three-level chain is the brand promise made concrete: every topic connects
// what happens in the body, what happens in communities, and what systems can do.
// Iron is the worked example specified in the brief.
export const lensChain = [
  {
    step: "01",
    level: "What happens in the body",
    claim: "Iron supports hemoglobin and oxygen transport.",
    detail: "At the biological level, iron helps blood carry oxygen and supports energy metabolism.",
  },
  {
    step: "02",
    level: "What happens in communities",
    claim: "Deficiency affects some populations more strongly.",
    detail: "Food access, infections, socioeconomic conditions, and healthcare access influence outcomes.",
  },
  {
    step: "03",
    level: "What public-health systems can do",
    claim: "Solutions work across food, services, and policy.",
    detail: "Interventions may include dietary diversity, food fortification, and targeted public-health programs.",
  },
] as const;
