"use client";

import { useRef, useState } from "react";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { SectionShell } from "@/components/ui/SectionShell";
import { SectionVisual } from "@/components/ui/SectionVisual";

const determinants = [
  {
    id: "nutrition",
    label: "Nutrition",
    title: "Food is never only an individual choice.",
    body: "Food access, affordability, culture, and knowledge shape who can turn dietary guidance into",
    ending: "everyday nourishment.",
  },
  {
    id: "access",
    label: "Access",
    title: "Care only works when people can reach it.",
    body: "Distance, cost, trust, and service capacity determine whether prevention and care are",
    ending: "within reach.",
  },
  {
    id: "environment",
    label: "Environment",
    title: "Health begins long before a clinic visit.",
    body: "Air, water, housing, climate, and the built environment create risks and protections before",
    ending: "clinical care begins.",
  },
  {
    id: "geography",
    label: "Geography",
    title: "Place changes the pathways to health.",
    body: "Where people live changes exposure, infrastructure, transport, food systems, and the practical routes to",
    ending: "better health.",
  },
  {
    id: "policy",
    label: "Policy",
    title: "Public decisions shape everyday possibilities.",
    body: "Policies influence prices, standards, services, information, and the conditions that make healthy lives",
    ending: "more achievable.",
  },
  {
    id: "inequality",
    label: "Inequality",
    title: "Health burdens and benefits are not shared equally.",
    body: "Power, income, discrimination, and unequal opportunity influence who carries the heaviest burden and who benefits",
    ending: "from progress.",
  },
] as const;

type DeterminantId = (typeof determinants)[number]["id"];

function ProtectedEnding({ text, words = 2 }: { text: string; words?: number }) {
  const parts = text.split(" ");
  const splitAt = Math.max(0, parts.length - words);
  const lead = parts.slice(0, splitAt).join(" ");
  const ending = parts.slice(splitAt).join(" ");

  return (
    <>
      {lead ? `${lead} ` : null}
      <span className="no-orphan">{ending}</span>
    </>
  );
}

export function MissionSection() {
  const [activeId, setActiveId] = useState<DeterminantId>("nutrition");
  const buttonRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const activeDeterminant = determinants.find((item) => item.id === activeId) ?? determinants[0];

  const moveFocus = (index: number, direction: number) => {
    const nextIndex = (index + direction + determinants.length) % determinants.length;
    const nextItem = determinants[nextIndex];
    setActiveId(nextItem.id);
    buttonRefs.current[nextIndex]?.focus();
  };

  return (
    <SectionShell id="about" surface="white" labelledBy="about-title" className="mission-signature">
      <SectionVisual variant="mission" />
      <div className="page-width mission-grid mission-stage">
        <div className="mission-heading-column">
          <Eyebrow>Our mission</Eyebrow>
          <h1 id="about-title">
            Health is shaped by more than <span className="no-orphan">individual choices.</span>
          </h1>
          {/* .mission-prompt is a two-column grid whose ::before draws the rule.
              The sentence has to be a single grid item, otherwise the trailing
              no-orphan span becomes a third item and drops to its own row. */}
          <p className="mission-prompt">
            <span>
              Follow the six forces that connect personal health with the{" "}
              <span className="no-orphan">conditions around us.</span>
            </span>
          </p>
        </div>
        <div className="mission-copy">
          <p className="lead-copy">
            You can only eat what reaches your market, and only visit the clinic you can afford to reach. Global Public
            Health Lens follows those limits back to <span className="no-orphan">where they get set.</span>
          </p>
          <div className="mission-story">
            <Eyebrow>Why this project</Eyebrow>
            <p>
              Global Public Health Lens began with a simple question: what changes when we look beyond the nutrient,
              symptom, or individual choice? The project connects evidence about bodies with the places, environments,
              policies, and services that shape <span className="no-orphan">everyday health.</span>
            </p>
          </div>

          <div className="mission-interactive">
            <div className="mission-network-header" aria-hidden="true">
              <span>Explore the determinants</span>
              <span>Choose a topic · six forces</span>
            </div>

            <div className="mission-storyline">
              <div className="determinants" role="group" aria-label="Explore health determinants">
              {determinants.map((item, index) => {
                const isActive = activeId === item.id;
                return (
                  <button
                    key={item.id}
                    ref={(node) => {
                      buttonRefs.current[index] = node;
                    }}
                    type="button"
                    className={isActive ? "is-active" : undefined}
                    aria-pressed={isActive}
                    aria-controls="mission-determinant-detail"
                    onClick={() => setActiveId(item.id)}
                    onFocus={() => setActiveId(item.id)}
                    onKeyDown={(event) => {
                      if (event.key === "ArrowRight" || event.key === "ArrowDown") {
                        event.preventDefault();
                        moveFocus(index, 1);
                      }
                      if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
                        event.preventDefault();
                        moveFocus(index, -1);
                      }
                      if (event.key === "Home") {
                        event.preventDefault();
                        setActiveId(determinants[0].id);
                        buttonRefs.current[0]?.focus();
                      }
                      if (event.key === "End") {
                        event.preventDefault();
                        const lastIndex = determinants.length - 1;
                        setActiveId(determinants[lastIndex].id);
                        buttonRefs.current[lastIndex]?.focus();
                      }
                    }}
                  >
                    <span className="mission-determinant-index">0{index + 1}</span>
                    <span className="mission-determinant-label">{item.label}</span>
                    <span className="mission-determinant-state" aria-hidden="true">
                      {isActive ? "Selected" : "Explore"}
                    </span>
                  </button>
                );
              })}
              </div>

              <div
                className="mission-focus-panel"
                id="mission-determinant-detail"
                role="status"
                aria-live="polite"
                aria-atomic="true"
              >
                <div className="mission-focus-index" aria-hidden="true">
                  0{determinants.findIndex((item) => item.id === activeId) + 1}
                </div>
                <div className="mission-focus-copy" key={activeId}>
                  <span>{activeDeterminant.label}</span>
                  <h3>
                    <ProtectedEnding text={activeDeterminant.title} />
                  </h3>
                  <p>
                    {activeDeterminant.body} <span className="no-orphan">{activeDeterminant.ending}</span>
                  </p>
                </div>
              </div>
            </div>
          </div>

          <p className="mission-coda">
            We start with nutrition because everyone eats. The rest of the system <span className="no-orphan">comes next.</span>
          </p>
        </div>
      </div>
    </SectionShell>
  );
}
