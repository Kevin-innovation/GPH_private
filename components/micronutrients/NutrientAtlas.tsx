"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { nutrients } from "@/content/nutrients";
import type { Nutrient } from "@/content/types";

type Filter = "all" | Nutrient["category"];

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

const nutrientImages: Record<string, string> = {
  "vitamin-a": "/brand/nutrients/vitamin-a.webp",
  "vitamin-d": "/brand/nutrients/vitamin-d.webp",
  "vitamin-b12": "/brand/nutrients/vitamin-b12.webp",
  folate: "/brand/nutrients/folate.webp",
  iron: "/brand/nutrients/iron.webp",
  iodine: "/brand/nutrients/iodine.webp",
  zinc: "/brand/nutrients/zinc.webp",
  magnesium: "/brand/nutrients/magnesium.webp",
};

function NutrientIcon({ nutrient }: { nutrient: Nutrient }) {
  return (
    <span className={`atlas-icon atlas-icon-${nutrient.slug}`} aria-hidden="true">
      {nutrientMarks[nutrient.slug]}
    </span>
  );
}

function NutrientVisual({ nutrient, className }: { nutrient: Nutrient; className: string }) {
  return (
    <Image
      className={className}
      src={nutrientImages[nutrient.slug]}
      alt=""
      width={512}
      height={512}
    />
  );
}

function NutrientDetail({ nutrient }: { nutrient: Nutrient }) {
  return (
    <aside className="atlas-detail" aria-live="polite">
      <div className="atlas-detail-sticky-visual">
        <div className="atlas-detail-topline">
          <span>Selected nutrient</span>
          <span>{nutrient.category === "vitamin" ? "Vitamin" : "Mineral"}</span>
        </div>
        <div className="atlas-detail-visual">
          <NutrientVisual nutrient={nutrient} className="atlas-detail-image" />
        </div>
        <div className="atlas-detail-sticky-copy">
          <div className="atlas-detail-title">
            <NutrientIcon nutrient={nutrient} />
            <div>
              <span className="atlas-detail-type">{nutrient.category}</span>
              <h3>{nutrient.name}</h3>
            </div>
          </div>
          <p className="atlas-detail-summary">{nutrient.summary}</p>
        </div>
      </div>
      <div className="atlas-detail-body">
        <div className="atlas-detail-facts">
          <div>
            <span>In the body</span>
            <p>{nutrient.whatItDoes}</p>
          </div>
          <div>
            <span>Food sources</span>
            <p>{nutrient.foodSources}</p>
          </div>
          <div>
            <span>Public-health lens</span>
            <p>{nutrient.globalLens}</p>
          </div>
          <div className="atlas-detail-safety">
            <span>Safety context</span>
            <p>{nutrient.safetyNote}</p>
          </div>
        </div>
        <a href={nutrient.sourceUrl} target="_blank" rel="noreferrer">
          Read the {nutrient.source} fact sheet <span aria-hidden="true">↗</span>
        </a>
      </div>
    </aside>
  );
}

export function NutrientAtlas() {
  const [filter, setFilter] = useState<Filter>("all");
  const [activeSlug, setActiveSlug] = useState(nutrients[0].slug);
  const activeSlugRef = useRef(nutrients[0].slug);
  const cardGridRef = useRef<HTMLDivElement>(null);
  const visibleNutrients = filter === "all" ? nutrients : nutrients.filter((nutrient) => nutrient.category === filter);
  const activeNutrient = nutrients.find((nutrient) => nutrient.slug === activeSlug) ?? nutrients[0];

  const selectNutrient = (nextSlug: string) => {
    activeSlugRef.current = nextSlug;
    setActiveSlug((currentSlug) => (currentSlug === nextSlug ? currentSlug : nextSlug));
  };

  useEffect(() => {
    // Mobile is a reading surface: selection changes by tap, not by the
    // scroll position. This keeps the featured detail from changing while a
    // reader is trying to read a nutrient card.
    if (window.matchMedia("(max-width: 900px)").matches) return;

    const cardGrid = cardGridRef.current;
    if (!cardGrid) return;

    const cards = Array.from(cardGrid.querySelectorAll<HTMLElement>("[data-nutrient-slug]"));
    if (!cards.length) return;

    let frame = 0;
    const syncActiveCard = () => {
      frame = 0;
      const headerOffset = Math.min(window.innerHeight * 0.18, 150);
      const anchor = headerOffset + (window.innerHeight - headerOffset) * 0.42;
      const viewportBottom = window.innerHeight;
      const visibleCards = cards.filter((card) => {
        const rect = card.getBoundingClientRect();
        return rect.bottom > headerOffset && rect.top < viewportBottom;
      });
      const candidates = visibleCards.length ? visibleCards : cards;
      const closestCard = candidates.reduce((closest, card) => {
        const cardRect = card.getBoundingClientRect();
        const closestRect = closest.getBoundingClientRect();
        return Math.abs(cardRect.top + cardRect.height / 2 - anchor) <
          Math.abs(closestRect.top + closestRect.height / 2 - anchor)
          ? card
          : closest;
      });
      const nextSlug = closestCard.getAttribute("data-nutrient-slug");
      if (!nextSlug || nextSlug === activeSlugRef.current) return;

      const currentCard = cards.find((card) => card.dataset.nutrientSlug === activeSlugRef.current);
      const currentRect = currentCard?.getBoundingClientRect();
      const closestRect = closestCard.getBoundingClientRect();
      const nextDistance = Math.abs(closestRect.top + closestRect.height / 2 - anchor);
      const currentDistance = currentRect
        ? Math.abs(currentRect.top + currentRect.height / 2 - anchor)
        : Number.POSITIVE_INFINITY;

      // Keep the active card stable while the current card is still close to
      // the reading anchor. This prevents tiny scroll deltas and content
      // reflow from flipping the detail panel back and forth at card edges.
      if (currentCard && currentDistance - nextDistance < 24) return;
      selectNutrient(nextSlug);
    };

    const requestSync = () => {
      if (!frame) frame = window.requestAnimationFrame(syncActiveCard);
    };

    requestSync();
    window.addEventListener("scroll", requestSync, { passive: true });
    window.addEventListener("resize", requestSync);
    return () => {
      window.removeEventListener("scroll", requestSync);
      window.removeEventListener("resize", requestSync);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, [filter]);

  const selectFilter = (nextFilter: Filter) => {
    setFilter(nextFilter);
    if (nextFilter !== "all" && activeNutrient.category !== nextFilter) {
      const firstMatch = nutrients.find((nutrient) => nutrient.category === nextFilter);
      if (firstMatch) selectNutrient(firstMatch.slug);
    }
  };

  return (
    <div className="nutrient-atlas" aria-label="Nutrient atlas">
      <div className="atlas-toolbar">
        <div>
          <span className="atlas-toolbar-label">Current editorial scope</span>
          <strong>8 nutrients to begin</strong>
        </div>
        <div className="atlas-filters" role="tablist" aria-label="Filter nutrients by type">
          {(["all", "vitamin", "mineral"] as Filter[]).map((option) => (
            <button
              key={option}
              className={filter === option ? "is-active" : ""}
              type="button"
              role="tab"
              aria-selected={filter === option}
              onClick={() => selectFilter(option)}
            >
              {option === "all" ? "All" : option === "vitamin" ? "Vitamins" : "Minerals"}
            </button>
          ))}
        </div>
      </div>

      <div className="atlas-layout">
        <NutrientDetail key={activeNutrient.slug} nutrient={activeNutrient} />
        <div className="atlas-card-grid" ref={cardGridRef}>
          {visibleNutrients.map((nutrient) => {
            const index = nutrients.findIndex((item) => item.slug === nutrient.slug);
            const isActive = nutrient.slug === activeNutrient.slug;
            return (
              <button
                key={nutrient.slug}
                className={`atlas-card${isActive ? " is-active" : ""}`}
                type="button"
                aria-pressed={isActive}
                data-nutrient-slug={nutrient.slug}
                onClick={() => selectNutrient(nutrient.slug)}
              >
                <span className="atlas-card-index">0{index + 1}</span>
                <div className="atlas-card-visual">
                  <NutrientVisual nutrient={nutrient} className="atlas-card-image" />
                </div>
                <span className="atlas-card-type">{nutrient.category}</span>
                <strong>{nutrient.name}</strong>
                <span className="atlas-card-summary">{nutrient.summary}</span>
                <span className="atlas-card-arrow" aria-hidden="true">→</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
