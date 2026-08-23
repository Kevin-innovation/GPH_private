"use client";

import Image from "next/image";
import { useCallback, useState, type PointerEvent } from "react";

type NutrientZone = {
  id: string;
  ingredient: string;
  nutrient: string;
  detail: string;
  icon: string;
  x: number;
  y: number;
};

const nutrientZones: NutrientZone[] = [
  {
    id: "greens",
    ingredient: "Leafy greens",
    nutrient: "Vitamin K + folate",
    detail: "Kale and spinach are a dense source of leafy-green micronutrients.",
    icon: "/brand/nutrients/vitamin-k.webp",
    x: 73,
    y: 23,
  },
  {
    id: "citrus",
    ingredient: "Citrus",
    nutrient: "Vitamin C",
    detail: "Orange brings vitamin C and a bright, naturally familiar signal.",
    icon: "/brand/nutrients/vitamin-c.webp",
    x: 84,
    y: 38,
  },
  {
    id: "chickpeas",
    ingredient: "Chickpeas",
    nutrient: "Plant protein + fiber",
    detail: "Chickpeas connect everyday food access with protein and fiber.",
    icon: "/brand/nutrients/iron.webp",
    x: 54,
    y: 51,
  },
  {
    id: "grains",
    ingredient: "Whole grains",
    nutrient: "B vitamins + fiber",
    detail: "Oats and grains make the less-visible building blocks of a meal tangible.",
    icon: "/brand/nutrients/vitamin-b.webp",
    x: 30,
    y: 59,
  },
  {
    id: "beans",
    ingredient: "Beans",
    nutrient: "Iron + folate",
    detail: "Beans offer plant-based iron and folate alongside protein and fiber.",
    icon: "/brand/nutrients/iron.webp",
    x: 66,
    y: 65,
  },
  {
    id: "seeds",
    ingredient: "Seeds",
    nutrient: "Magnesium + zinc",
    detail: "Pumpkin seeds add mineral density and healthy unsaturated fats.",
    icon: "/brand/nutrients/zinc.webp",
    x: 48,
    y: 75,
  },
  {
    id: "berries",
    ingredient: "Blueberries",
    nutrient: "Polyphenols + vitamin C",
    detail: "Blueberries add color from naturally occurring plant compounds.",
    icon: "/brand/nutrients/vitamin-c.webp",
    x: 71,
    y: 82,
  },
];

const defaultPointer = { x: 72, y: 52 };

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

export function HeroVisual() {
  const [pointer, setPointer] = useState(defaultPointer);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [isInspecting, setIsInspecting] = useState(false);
  const activeZone = nutrientZones.find((zone) => zone.id === activeId) ?? null;

  const updateInspection = useCallback((event: PointerEvent<HTMLDivElement>) => {
    const bounds = event.currentTarget.getBoundingClientRect();
    const x = clamp(((event.clientX - bounds.left) / bounds.width) * 100, 0, 100);
    const y = clamp(((event.clientY - bounds.top) / bounds.height) * 100, 0, 100);
    const nearest = nutrientZones.reduce<{ zone: NutrientZone; distance: number } | null>((closest, zone) => {
      const distance = Math.hypot((zone.x - x) * 0.92, zone.y - y);
      return !closest || distance < closest.distance ? { zone, distance } : closest;
    }, null);

    setPointer({ x, y });
    setIsInspecting(true);
    setActiveId(nearest && nearest.distance < 18 ? nearest.zone.id : null);
  }, []);

  const handleLeave = () => {
    setActiveId(null);
    setIsInspecting(false);
  };

  const handlePointerEnter = (event: PointerEvent<HTMLDivElement>) => {
    if (event.pointerType !== "touch") setIsInspecting(true);
  };

  const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (event.pointerType !== "touch") updateInspection(event);
  };

  const handlePointerDown = (event: PointerEvent<HTMLDivElement>) => {
    if (event.pointerType === "touch") updateInspection(event);
  };

  const calloutLeft = clamp(pointer.x > 58 ? pointer.x - 48 : pointer.x + 5, 2, 42);
  const calloutTop = clamp(pointer.y - 32, 4, 46);

  return (
    <div className="hero-art-wrap">
      <div
        className="hero-illustration hero-interactive-art"
        data-inspecting={isInspecting}
        onPointerEnter={handlePointerEnter}
        onPointerMove={handlePointerMove}
        onPointerDown={handlePointerDown}
        onPointerLeave={handleLeave}
        aria-label="Move across or tap the ingredients to inspect their representative nutrients"
      >
        <Image
          src="/brand/hero-nutrition-ingredients-cutout.webp"
          alt="A photographic cutout of leafy greens, chickpeas, beans, whole grains, seeds, citrus, and blueberries."
          width={1536}
          height={1024}
          priority
          sizes="(max-width: 900px) 100vw, 46vw"
        />
        <span className="hero-inspection-hint hero-inspection-hint-desktop" aria-hidden="true">
          Move across the ingredients to inspect
        </span>
        <span className="hero-inspection-hint hero-inspection-hint-mobile" aria-hidden="true">
          Tap an ingredient to inspect
        </span>
        <span className="hero-hover-lens" aria-hidden="true" style={{ left: `${pointer.x}%`, top: `${pointer.y}%` }} />
        {activeZone ? (
          <div
            className="hero-nutrient-callout"
            style={{ left: `${calloutLeft}%`, top: `${calloutTop}%` }}
            aria-live="polite"
          >
            <div className="hero-nutrient-callout-head">
              <Image className="hero-nutrient-callout-icon" src={activeZone.icon} alt="" width={36} height={36} />
              <span>LOOKING CLOSER</span>
            </div>
            <strong>{activeZone.nutrient}</strong>
            <small>{activeZone.ingredient}</small>
            <p>{activeZone.detail}</p>
          </div>
        ) : null}
      </div>
    </div>
  );
}
