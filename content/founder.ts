// The founder's own words, supplied by the owner and kept verbatim. The only
// edits are typographic: em dashes are spaced to match the rest of the site.
// Chapter labels are editorial furniture, not claims — they name the passage
// the reader is entering and never add a fact the bio does not state.
export const founder = {
  name: "Caden Choi",
  initials: "CC",
  role: "Founder, Global Public Health Lens",
  affiliation: "Student, Episcopal High School",
  standfirst:
    "I founded Global Public Health Lens because I believe people should understand the healthcare systems and nutritional conditions surrounding them.",
  chapters: [
    {
      id: "starting-point",
      label: "Starting point",
      body: "The places where we grow up can continue to shape our health, opportunities, and perspectives throughout our lives. Understanding these influences is an important first step toward creating healthier communities.",
    },
    {
      id: "research",
      label: "Research",
      body: "As a student at Episcopal High School, I have explored public health through independent research, scientific writing, and conversations with experts. My research into malnutrition — particularly pellagra, a disease caused by severe niacin deficiency — showed me how nutrition, education, access to care, and social conditions are deeply connected.",
    },
    {
      id: "interviews",
      label: "Interviews",
      body: "Interviewing professors has also shaped the way I approach health and science. A conversation with Professor Koo about neurology inspired me to conduct further research into Parkinson’s disease. That experience showed me that interviews can do more than communicate information: they can introduce new perspectives, deepen understanding, and inspire people to investigate important questions for themselves.",
    },
    {
      id: "the-project",
      label: "The project",
      body: "Through Global Public Health Lens, I hope to make complex health topics more understandable and encourage a shared view of healthcare as an interconnected system. The project’s free nutrition web app also gives people a practical way to learn about their nutritional intake and recognize how everyday choices connect to the wider public-health picture.",
    },
  ],
  // Each entry is drawn directly from the bio above; nothing here is inferred.
  facts: [
    { term: "Research focus", detail: "Malnutrition and pellagra" },
    { term: "Further study", detail: "Neurology and Parkinson’s disease" },
    { term: "Practice", detail: "Scientific writing and expert interviews" },
  ],
} as const;
