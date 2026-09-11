"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { nutrients } from "@/content/nutrients";
import type { Nutrient } from "@/content/types";
import { ExternalLink } from "@/components/ui/ExternalLink";
import { orphanSafeText } from "@/components/ui/orphanSafeText";

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

function NutrientVisual({
  nutrient,
  className,
  loading = "lazy",
}: {
  nutrient: Nutrient;
  className: string;
  loading?: "eager" | "lazy";
}) {
  return (
    <Image
      className={className}
      src={nutrientImages[nutrient.slug]}
      alt=""
      width={512}
      height={512}
      loading={loading}
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
  expandedSlug,
  onSelect,
  onToggle,
  onAutoSelect,
}: {
  nutrients: Nutrient[];
  activeSlug: string;
  expandedSlug: string | null;
  onSelect: (slug: string) => void;
  onToggle: (slug: string) => void;
  onAutoSelect: (slug: string) => void;
}) {
  const listRef = useRef<HTMLDivElement>(null);
  const activeSlugRef = useRef(activeSlug);
  const onAutoSelectRef = useRef(onAutoSelect);
  const autoSuppressedUntilRef = useRef(0);
  const revealKey = visibleNutrients.map((nutrient) => nutrient.slug).join("|");

  useEffect(() => {
    activeSlugRef.current = activeSlug;
  }, [activeSlug]);

  useEffect(() => {
    onAutoSelectRef.current = onAutoSelect;
  }, [onAutoSelect]);

  useEffect(() => {
    const list = listRef.current;
    if (!list) return;

    const items = Array.from(list.querySelectorAll<HTMLElement>(".atlas-mobile-item"));
    if (!items.length) return;

    const reveal = (item: HTMLElement) => item.classList.add("is-reveal-visible");

    // Keep the rows visible when the browser does not support Intersection
    // Observer (or when motion is reduced). The reveal class only adds an
    // entrance animation; it never controls layout or content visibility.
    if (!("IntersectionObserver" in window)) {
      items.forEach(reveal);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          reveal(entry.target as HTMLElement);
          observer.unobserve(entry.target);
        });
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.01 },
    );

    items.forEach((item) => observer.observe(item));
    return () => observer.disconnect();
  }, [revealKey]);

  useEffect(() => {
    const list = listRef.current;
    if (!list) return;

    const triggers = Array.from(list.querySelectorAll<HTMLElement>(".atlas-mobile-trigger"));
    if (!triggers.length) return;

    let frame = 0;
    let settleTimer: number | null = null;
    const pendingSlugRef = { current: null as string | null };
    const settleDelay = 140;
    const handoffDuration = 620;
    const getTargetTrigger = () => {
      const activationLine = Math.min(window.innerHeight * 0.52, window.innerHeight - 140);
      const rows = triggers.map((trigger) => ({ trigger, rect: trigger.getBoundingClientRect() }));
      const inReadingBand = rows.filter(
        ({ rect }) => rect.bottom > activationLine - 80 && rect.top < activationLine + 80,
      );
      const inViewport = rows.filter(({ rect }) => rect.bottom > 0 && rect.top < window.innerHeight);
      const candidates = inReadingBand.length
        ? inReadingBand
        : inViewport.length
          ? inViewport
          : rows;

      return candidates.sort((a, b) => {
        const aCenter = a.rect.top + a.rect.height / 2;
        const bCenter = b.rect.top + b.rect.height / 2;
        return Math.abs(aCenter - activationLine) - Math.abs(bCenter - activationLine);
        })[0]?.trigger;
    };

    const cancelPendingSelection = () => {
      pendingSlugRef.current = null;
      if (settleTimer !== null) {
        window.clearTimeout(settleTimer);
        settleTimer = null;
      }
    };

    const scheduleAutoSelect = (targetSlug: string) => {
      const currentSlug = activeSlugRef.current;
      if (!targetSlug || targetSlug === currentSlug) {
        cancelPendingSelection();
        return;
      }

      // Wheel and trackpad momentum can cross two trigger boundaries in a
      // handful of frames. Wait for the reading line to settle before
      // changing the expanded row; otherwise every tiny delta causes a
      // visible open/close/open flicker and makes the nutrient art feel
      // unnaturally fast.
      pendingSlugRef.current = targetSlug;
      if (settleTimer !== null) window.clearTimeout(settleTimer);
      settleTimer = window.setTimeout(() => {
        settleTimer = null;
        const nextSlug = pendingSlugRef.current;
        pendingSlugRef.current = null;
        if (!nextSlug || performance.now() < autoSuppressedUntilRef.current) return;
        if (nextSlug !== activeSlugRef.current) {
          // Expanding one detail and collapsing the previous one can emit
          // layout-driven scroll events of its own. Give that hand-off the
          // duration of the visual transition so it cannot immediately pick
          // the previous row again; real wheel/touch input clears this window.
          autoSuppressedUntilRef.current = performance.now() + handoffDuration;
          onAutoSelectRef.current(nextSlug);
        }
      }, settleDelay);
    };

    const syncFromScroll = () => {
      frame = 0;
      if (performance.now() < autoSuppressedUntilRef.current) return;
      const targetSlug = getTargetTrigger()?.dataset.nutrientSlug;
      const currentSlug = activeSlugRef.current;
      if (!targetSlug || targetSlug === currentSlug) return;

      const activationLine = Math.min(window.innerHeight * 0.52, window.innerHeight - 140);
      const currentTrigger = triggers.find((trigger) => trigger.dataset.nutrientSlug === currentSlug);
      const targetTrigger = triggers.find((trigger) => trigger.dataset.nutrientSlug === targetSlug);
      if (currentTrigger && targetTrigger) {
        const currentRect = currentTrigger.getBoundingClientRect();
        const targetRect = targetTrigger.getBoundingClientRect();
        const currentDistance = Math.abs(currentRect.top + currentRect.height / 2 - activationLine);
        const targetDistance = Math.abs(targetRect.top + targetRect.height / 2 - activationLine);
        // Hysteresis keeps the active row stable at a boundary. The next row
        // must be meaningfully closer to the reading line before it can win.
        if (currentDistance - targetDistance < 32) return;
      }

      scheduleAutoSelect(targetSlug);
    };

    const requestSync = () => {
      if (!frame) frame = window.requestAnimationFrame(syncFromScroll);
    };

    // Scroll is the source of truth for the reading sequence. Unlike a
    // view-timeline animation, this also works when the user drags the bar or
    // jumps several rows with a trackpad.
    requestSync();
    window.addEventListener("scroll", requestSync, { passive: true });
    window.addEventListener("resize", requestSync);

    // A manual toggle can change the document height and make the next row
    // intersect the reading band without any user scroll. Keep that toggle
    // authoritative for a short handoff window; wheel/touch/keyboard input
    // immediately returns control to scroll-driven selection.
    const resumeAutoSelection = () => {
      autoSuppressedUntilRef.current = 0;
    };
    const resumeAfterScrollEnd = () => {
      autoSuppressedUntilRef.current = 0;
      requestSync();
    };
    window.addEventListener("wheel", resumeAutoSelection, { passive: true });
    window.addEventListener("touchmove", resumeAutoSelection, { passive: true });
    window.addEventListener("keydown", resumeAutoSelection);
    window.addEventListener("scrollend", resumeAfterScrollEnd);

    const observer = "IntersectionObserver" in window
      ? new IntersectionObserver(
        (entries) => {
          if (entries.some((entry) => entry.isIntersecting)) requestSync();
        },
        { rootMargin: "-42% 0px -42% 0px", threshold: 0 },
      )
      : null;

    triggers.forEach((trigger) => observer?.observe(trigger));
    return () => {
      window.removeEventListener("scroll", requestSync);
      window.removeEventListener("resize", requestSync);
      window.removeEventListener("wheel", resumeAutoSelection);
      window.removeEventListener("touchmove", resumeAutoSelection);
      window.removeEventListener("keydown", resumeAutoSelection);
      window.removeEventListener("scrollend", resumeAfterScrollEnd);
      if (frame) window.cancelAnimationFrame(frame);
      cancelPendingSelection();
      observer?.disconnect();
    };
  }, [revealKey]);

  return (
    <div ref={listRef} className="atlas-mobile-list" aria-label="Nutrients to explore">
      {visibleNutrients.map((nutrient) => {
        const index = nutrients.findIndex((item) => item.slug === nutrient.slug);
        const isExpanded = nutrient.slug === expandedSlug;
        const detailId = `mobile-nutrient-detail-${nutrient.slug}`;

        return (
          <article
            className={`atlas-mobile-item${isExpanded ? " is-active" : ""}`}
            data-nutrient-slug={nutrient.slug}
            key={nutrient.slug}
          >
            <button
              className="atlas-mobile-trigger"
              type="button"
              data-nutrient-slug={nutrient.slug}
              aria-expanded={isExpanded}
              aria-controls={detailId}
              onClick={() => {
                autoSuppressedUntilRef.current = performance.now() + 450;
                onSelect(nutrient.slug);
                onToggle(nutrient.slug);
              }}
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
                {isExpanded ? "−" : "+"}
              </span>
            </button>

            <div
              className={`atlas-mobile-detail-shell${isExpanded ? " is-expanded" : ""}`}
              aria-hidden={!isExpanded}
              inert={!isExpanded}
            >
              <div className="atlas-mobile-detail" id={detailId} aria-live={isExpanded ? "polite" : "off"}>
                <div className="atlas-mobile-detail-head">
                  <div className="atlas-mobile-detail-visual">
                    <NutrientVisual nutrient={nutrient} className="atlas-mobile-detail-image" loading="eager" />
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
            </div>
          </article>
        );
      })}
    </div>
  );
}

export function NutrientAtlas() {
  const [filter, setFilter] = useState<Filter>("all");
  const [activeSlug, setActiveSlug] = useState(nutrients[0].slug);
  const [expandedSlug, setExpandedSlug] = useState<string | null>(nutrients[0].slug);
  const activeSlugRef = useRef(nutrients[0].slug);
  const cardGridRef = useRef<HTMLDivElement>(null);
  const visibleNutrients = filter === "all" ? nutrients : nutrients.filter((nutrient) => nutrient.category === filter);
  const activeNutrient = nutrients.find((nutrient) => nutrient.slug === activeSlug) ?? nutrients[0];

  const selectNutrient = useCallback((nextSlug: string) => {
    activeSlugRef.current = nextSlug;
    setActiveSlug((currentSlug) => (currentSlug === nextSlug ? currentSlug : nextSlug));
  }, []);

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
  }, [filter, selectNutrient]);

  const selectFilter = (nextFilter: Filter) => {
    setFilter(nextFilter);
    if (nextFilter !== "all" && activeNutrient.category !== nextFilter) {
      const firstMatch = nutrients.find((nutrient) => nutrient.category === nextFilter);
      if (firstMatch) {
        selectNutrient(firstMatch.slug);
        setExpandedSlug(firstMatch.slug);
      }
    }
  };

  const toggleMobileNutrient = (slug: string) => {
    setExpandedSlug((currentSlug) => (currentSlug === slug ? null : slug));
  };

  const autoSelectNutrient = (slug: string) => {
    selectNutrient(slug);
    setExpandedSlug(slug);
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
        expandedSlug={expandedSlug}
        onSelect={selectNutrient}
        onToggle={toggleMobileNutrient}
        onAutoSelect={autoSelectNutrient}
      />
    </div>
  );
}
