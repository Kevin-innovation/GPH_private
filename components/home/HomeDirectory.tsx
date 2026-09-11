"use client";

import { Eyebrow } from "@/components/ui/Eyebrow";
import { SectionShell } from "@/components/ui/SectionShell";

const destinations = [
  {
    label: "About",
    links: [
      { title: "Our Mission", body: "Why health has to be understood in context.", href: "/about/mission" },
      { title: "Our Team", body: "The people and questions behind the lens.", href: "/about/team" },
    ],
  },
  {
    label: "The Lens",
    links: [
      { title: "Country Spotlight", body: "Five places, five public-health starting points.", href: "/country-spotlight" },
      { title: "Micronutrients", body: "A nutrition entry point for a wider system.", href: "/lens/micronutrients" },
      { title: "How the Lens Works", body: "From bodies to communities to systems.", href: "/lens/how-it-works" },
      { title: "Solutions & Action", body: "Conditions and interventions that can change outcomes.", href: "/lens/solutions" },
    ],
  },
  {
    label: "Continue",
    links: [
      { title: "Nutrition App", body: "Explore the first practical tool.", href: "/nutrition-app" },
      { title: "Evidence Base", body: "Read the public sources behind the project.", href: "/evidence-base" },
      { title: "Contact", body: "Questions, feedback, or collaboration.", href: "/contact" },
    ],
  },
] as const;

export function HomeDirectory() {
  return (
    <SectionShell id="home-directory" surface="white" labelledBy="home-directory-title" className="home-directory">
      <div className="page-width">
        <div className="directory-intro">
          <div>
            <Eyebrow>Explore the project</Eyebrow>
            <h2 id="home-directory-title">One project, several ways <span className="no-orphan">in.</span></h2>
          </div>
          <p>Start with a place, a nutrient, a story, or the evidence. Each page follows one question and gives it room to breathe.</p>
        </div>

        <div className="directory-groups">
          {destinations.map((group) => (
            <div className="directory-group" key={group.label}>
              <Eyebrow>{group.label}</Eyebrow>
              <ul>
                {group.links.map((link) => (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      onClick={(event) => {
                        event.preventDefault();
                        window.location.assign(link.href);
                      }}
                    >
                      <span className="directory-link-title">{link.title}</span>
                      <span className="directory-link-body">{link.body}</span>
                      <span className="directory-link-arrow" aria-hidden="true">→</span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </SectionShell>
  );
}
