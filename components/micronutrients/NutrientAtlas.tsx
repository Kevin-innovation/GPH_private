"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { nutrients } from "@/content/nutrients";
import type { Nutrient } from "@/content/types";
import { ExternalLink } from "@/components/ui/ExternalLink";
import { orphanSafeText } from "@/components/ui/orphanSafeText";

type Filter = "all" | Nutrient["category"];
type AtlasUrlMode = "push" | "replace";

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

function readAtlasUrlState() {
  if (typeof window === "undefined") {
    return { filter: "all" as Filter, activeSlug: nutrients[0].slug };
  }

  const params = new URLSearchParams(window.location.search);
  const requestedFilter = params.get("filter");
  const filter: Filter = requestedFilter === "vitamin" || requestedFilter === "mineral" ? requestedFilter : "all";
  const requestedNutrient = nutrients.find((nutrient) => nutrient.slug === params.get("nutrient"));
  const fallbackNutrient = filter === "all"
    ? nutrients[0]
    : nutrients.find((nutrient) => nutrient.category === filter) ?? nutrients[0];
  const activeNutrient = requestedNutrient && (filter === "all" || requestedNutrient.category === filter)
    ? requestedNutrient
    : fallbackNutrient;

  return { filter, activeSlug: activeNutrient.slug };
}

function writeAtlasUrl(filter: Filter, activeSlug: string, mode: AtlasUrlMode) {
  if (typeof window === "undefined") return;

  const url = new URL(window.location.href);
  if (filter === "all") url.searchParams.delete("filter");
  else url.searchParams.set("filter", filter);

  if (filter === "all" && activeSlug === nutrients[0].slug) url.searchParams.delete("nutrient");
  else url.searchParams.set("nutrient", activeSlug);

  const nextUrl = `${url.pathname}${url.search}${url.hash}`;
  if (nextUrl === `${window.location.pathname}${window.location.search}${window.location.hash}`) return;

  const method = mode === "push" ? "pushState" : "replaceState";
  window.history[method]({ ...window.history.state, atlas: { filter, activeSlug } }, "", nextUrl);
}

function NutrientDetail({ nutrient }: { nutrient: Nutrient }) {
  return (
    <aside className="atlas-detail">
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
              <h3>{orphanSafeText(nutrient.name)}</h3>
            </div>
          </div>
          <p className="atlas-detail-summary">{orphanSafeText(nutrient.summary)}</p>
        </div>
      </div>
      <div className="atlas-detail-body">
        <div className="atlas-detail-facts">
          <div>
            <span>In the body</span>
            <p>{orphanSafeText(nutrient.whatItDoes)}</p>
          </div>
          <div>
            <span>Food sources</span>
            <p>{orphanSafeText(nutrient.foodSources)}</p>
          </div>
          <div>
            <span>Public-health lens</span>
            <p>{orphanSafeText(nutrient.globalLens)}</p>
          </div>
          <div className="atlas-detail-safety">
            <span>Safety context</span>
            <p>{orphanSafeText(nutrient.safetyNote)}</p>
          </div>
        </div>
        <ExternalLink href={nutrient.sourceUrl}>
          {orphanSafeText(`Read the ${nutrient.source} fact sheet`)} <span aria-hidden="true">↗</span>
        </ExternalLink>
      </div>
    </aside>
  );
}

function MobileNutrientList({
  nutrients: visibleNutrients,
  activeSlug,
  onSelect,
}: {
  nutrients: Nutrient[];
  activeSlug: string;
  onSelect: (slug: string) => void;
}) {
  return (
    <div className="atlas-mobile-list" aria-label="Nutrients to explore">
      {visibleNutrients.map((nutrient) => {
        const index = nutrients.findIndex((item) => item.slug === nutrient.slug);
        const isActive = nutrient.slug === activeSlug;
        const detailId = `mobile-nutrient-detail-${nutrient.slug}`;

        return (
          <article className={`atlas-mobile-item${isActive ? " is-active" : ""}`} key={nutrient.slug}>
            <button
              className="atlas-mobile-trigger"
              type="button"
              aria-expanded={isActive}
              aria-controls={detailId}
              onClick={() => onSelect(nutrient.slug)}
            >
              <span className="atlas-mobile-index">0{index + 1}</span>
              <div className="atlas-mobile-thumb">
                <NutrientVisual nutrient={nutrient} className="atlas-mobile-thumb-image" />
              </div>
              <div className="atlas-mobile-trigger-copy">
                <span className="atlas-card-type">{nutrient.category}</span>
                <strong>{orphanSafeText(nutrient.name)}</strong>
                <span className="atlas-card-summary">{orphanSafeText(nutrient.summary)}</span>
              </div>
              <span className="atlas-mobile-trigger-arrow" aria-hidden="true">
                {isActive ? "−" : "+"}
              </span>
            </button>

            {isActive ? (
              <div className="atlas-mobile-detail" id={detailId}>
                <div className="atlas-mobile-detail-head">
                  <div className="atlas-mobile-detail-visual">
                    <NutrientVisual nutrient={nutrient} className="atlas-mobile-detail-image" />
                  </div>
                  <div className="atlas-mobile-detail-copy">
                    <div className="atlas-detail-title">
                      <NutrientIcon nutrient={nutrient} />
                      <div>
                        <span className="atlas-detail-type">{nutrient.category}</span>
                        <h3>{orphanSafeText(nutrient.name)}</h3>
                      </div>
                    </div>
                    <p className="atlas-detail-summary">{orphanSafeText(nutrient.summary)}</p>
                  </div>
                </div>
                <div className="atlas-mobile-facts">
                  <div>
                    <span>In the body</span>
                    <p>{orphanSafeText(nutrient.whatItDoes)}</p>
                  </div>
                  <div>
                    <span>Food sources</span>
                    <p>{orphanSafeText(nutrient.foodSources)}</p>
                  </div>
                  <div>
                    <span>Public-health lens</span>
                    <p>{orphanSafeText(nutrient.globalLens)}</p>
                  </div>
                  <div className="atlas-detail-safety">
                    <span>Safety context</span>
                    <p>{orphanSafeText(nutrient.safetyNote)}</p>
                  </div>
                </div>
                <ExternalLink href={nutrient.sourceUrl}>
                  {orphanSafeText(`Read the ${nutrient.source} fact sheet`)} <span aria-hidden="true">↗</span>
                </ExternalLink>
              </div>
            ) : null}
          </article>
        );
      })}
    </div>
  );
}

export function NutrientAtlas() {
  const [filter, setFilter] = useState<Filter>("all");
  const [activeSlug, setActiveSlug] = useState(nutrients[0].slug);
  const [isUrlRestored, setIsUrlRestored] = useState(false);
  const activeSlugRef = useRef(nutrients[0].slug);
  const isUrlRestoredRef = useRef(false);
  const cardGridRef = useRef<HTMLDivElement>(null);
  const visibleNutrients = filter === "all" ? nutrients : nutrients.filter((nutrient) => nutrient.category === filter);
  const activeNutrient = nutrients.find((nutrient) => nutrient.slug === activeSlug) ?? nutrients[0];

  const applyUrlState = () => {
    const nextState = readAtlasUrlState();
    activeSlugRef.current = nextState.activeSlug;
    setFilter(nextState.filter);
    setActiveSlug(nextState.activeSlug);
    isUrlRestoredRef.current = true;
    setIsUrlRestored(true);
  };

  useEffect(() => {
    const restoreFrame = window.requestAnimationFrame(applyUrlState);
    const handlePopState = () => applyUrlState();
    window.addEventListener("popstate", handlePopState);
    return () => {
      window.cancelAnimationFrame(restoreFrame);
      window.removeEventListener("popstate", handlePopState);
    };
  }, []);

  const selectNutrient = useCallback((nextSlug: string, mode: AtlasUrlMode = "push") => {
    const nextNutrient = nutrients.find((nutrient) => nutrient.slug === nextSlug);
    if (!nextNutrient) return;

    const changed = activeSlugRef.current !== nextSlug;
    activeSlugRef.current = nextSlug;
    if (changed) setActiveSlug(nextSlug);
    if (changed && isUrlRestoredRef.current) writeAtlasUrl(filter, nextSlug, mode);
  }, [filter]);

  useEffect(() => {
    if (!isUrlRestored) return;

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
      selectNutrient(nextSlug, "replace");
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
  }, [filter, isUrlRestored, selectNutrient]);

  const selectFilter = (nextFilter: Filter) => {
    const currentNutrient = nutrients.find((nutrient) => nutrient.slug === activeSlugRef.current) ?? nutrients[0];
    const nextNutrient = nextFilter !== "all" && currentNutrient.category !== nextFilter
      ? nutrients.find((nutrient) => nutrient.category === nextFilter) ?? currentNutrient
      : currentNutrient;
    const changed = filter !== nextFilter || activeSlugRef.current !== nextNutrient.slug;

    setFilter(nextFilter);
    activeSlugRef.current = nextNutrient.slug;
    setActiveSlug(nextNutrient.slug);
    if (changed && isUrlRestoredRef.current) writeAtlasUrl(nextFilter, nextNutrient.slug, "push");
  };

  return (
    <div className="nutrient-atlas" aria-label="Nutrient atlas">
      <div className="atlas-toolbar">
        <div>
          <span className="atlas-toolbar-label">Current editorial scope</span>
          <strong>8 nutrients to begin</strong>
        </div>
        <div className="atlas-filters" role="group" aria-label="Filter nutrients by type">
          {(["all", "vitamin", "mineral"] as Filter[]).map((option) => (
            <button
              key={option}
              className={filter === option ? "is-active" : ""}
              type="button"
              aria-pressed={filter === option}
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
                <strong>{orphanSafeText(nutrient.name)}</strong>
                <span className="atlas-card-summary">{orphanSafeText(nutrient.summary)}</span>
                <span className="atlas-card-arrow" aria-hidden="true"><span>Explore</span><b>→</b></span>
              </button>
            );
          })}
        </div>
      </div>
      <MobileNutrientList
        nutrients={visibleNutrients}
        activeSlug={activeNutrient.slug}
        onSelect={selectNutrient}
      />
      <p className="sr-only" role="status" aria-live="polite" aria-atomic="true">
        Selected nutrient: {orphanSafeText(activeNutrient.name)}
      </p>
    </div>
  );
}
