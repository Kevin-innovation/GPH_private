"use client";

import { type CSSProperties, useEffect, useRef, useState } from "react";
import { nutrients } from "@/content/nutrients";
import type { Nutrient } from "@/content/types";
import { ExternalLink } from "@/components/ui/ExternalLink";
import { orphanSafeText } from "@/components/ui/orphanSafeText";

const nutrientMarks: Record<string, string> = {
  "vitamin-a": "A",
  "vitamin-d": "D",
  "vitamin-b12": "B12",
  folate: "F",
  iron: "Fe",
  iodine: "I",
  zinc: "Zn",
  magnesium: "Mg",
};

function NutrientIcon({ nutrient }: { nutrient: Nutrient }) {
  return (
    <span className={`nutrient-icon nutrient-icon-${nutrient.slug}`} aria-hidden="true">
      {nutrientMarks[nutrient.slug]}
    </span>
  );
}

function NutrientPanel({ nutrient, index }: { nutrient: Nutrient; index: number }) {
  return (
    <div className="nutrient-panel" aria-live="polite">
      <div className="nutrient-panel-topline">
        <span>Now in focus</span>
        <span>
          0{index + 1} / 08
        </span>
      </div>
      <div className="nutrient-panel-heading">
        <div className="nutrient-panel-name">
          <NutrientIcon nutrient={nutrient} />
          <div>
            <span className="nutrient-category">{nutrient.category}</span>
            <h3>{orphanSafeText(nutrient.name)}</h3>
          </div>
        </div>
        <p>{orphanSafeText(nutrient.summary)}</p>
      </div>
      <div className="nutrient-axis" aria-hidden="true">
        <span>body</span>
        <i />
        <span>food</span>
        <i />
        <span>systems</span>
      </div>
      <div className="nutrient-panel-facts">
        <div>
          <span className="eyebrow">In the body</span>
          <p>{orphanSafeText(nutrient.whatItDoes)}</p>
        </div>
        <div>
          <span className="eyebrow">Food sources</span>
          <p>{orphanSafeText(nutrient.foodSources)}</p>
        </div>
        <div>
          <span className="eyebrow">Public-health lens</span>
          <p>{orphanSafeText(nutrient.globalLens)}</p>
        </div>
      </div>
      <div className="nutrient-panel-safety">
        <span className="eyebrow">Safety context</span>
        <p>{orphanSafeText(nutrient.safetyNote)}</p>
      </div>
      <ExternalLink href={nutrient.sourceUrl}>
        {orphanSafeText(`Read the ${nutrient.source} fact sheet`)} <span aria-hidden="true">↗</span>
      </ExternalLink>
    </div>
  );
}

export function NutrientScrollStory() {
  const [activeIndex, setActiveIndex] = useState(0);
  const stepRefs = useRef<Array<HTMLElement | null>>([]);

  useEffect(() => {
    const steps = stepRefs.current.filter((step): step is HTMLElement => Boolean(step));
    if (!steps.length || !("IntersectionObserver" in window)) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => Math.abs(a.boundingClientRect.top) - Math.abs(b.boundingClientRect.top));
        const next = visible[0]?.target.getAttribute("data-index");
        if (next) setActiveIndex(Number(next));
      },
      { rootMargin: "-34% 0px -48% 0px", threshold: [0, 0.25, 0.5] },
    );

    steps.forEach((step) => observer.observe(step));
    return () => observer.disconnect();
  }, []);

  const scrollToNutrient = (index: number) => {
    stepRefs.current[index]?.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  return (
    <div className="nutrient-story" aria-label="Explore the eight nutrients">
      <div className="nutrient-story-panel">
        <NutrientPanel nutrient={nutrients[activeIndex]} index={activeIndex} />
        <div className="nutrient-story-note">
          <span className="note-marker">How to explore</span>
          <p>Scroll to move through the guide, or choose a nutrient directly.</p>
        </div>
      </div>

      <div className="nutrient-story-steps">
        <div className="nutrient-story-header">
          <span>Eight nutrients to begin</span>
          <span>Scroll to explore</span>
        </div>
        <nav className="nutrient-step-nav" aria-label="Nutrient chapters">
          {nutrients.map((nutrient, index) => (
            <button
              key={nutrient.slug}
              className={index === activeIndex ? "is-active" : ""}
              type="button"
              aria-current={index === activeIndex ? "step" : undefined}
              onClick={() => scrollToNutrient(index)}
            >
              <span>0{index + 1}</span>
              <strong>{nutrient.name}</strong>
              <i aria-hidden="true">{index === activeIndex ? "●" : "○"}</i>
            </button>
          ))}
        </nav>
        <div
          className="nutrient-story-track"
          style={{ "--story-progress": `${(activeIndex / (nutrients.length - 1)) * 100}%` } as CSSProperties}
        >
          {nutrients.map((nutrient, index) => (
            <article
              key={nutrient.slug}
              ref={(element) => {
                stepRefs.current[index] = element;
              }}
              className={`nutrient-story-step${index === activeIndex ? " is-active" : ""}`}
              data-index={index}
            >
              <span className="nutrient-step-number">0{index + 1}</span>
              <div className="nutrient-step-copy">
                <div className="nutrient-step-label">
                  <NutrientIcon nutrient={nutrient} />
                  <span>{nutrient.category}</span>
                </div>
                <h3>{orphanSafeText(nutrient.name)}</h3>
                <p>{orphanSafeText(nutrient.summary)}</p>
              </div>
              <span className="step-arrow" aria-hidden="true">→</span>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
