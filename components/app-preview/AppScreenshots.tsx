"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";

// Three product screens composited into device frames so the stage reads as a
// journey: enter the app, use it, then inspect the nutrition context.
const screens = [
  {
    src: "/brand/app/screen-today-3d.webp",
    width: 588,
    height: 1302,
    alt: "The app's Today screen with a daily nutrition score, logged foods, and nutrient balance gauges for thirteen nutrients.",
  },
  {
    src: "/brand/app/screen-welcome-3d.webp",
    width: 588,
    height: 1302,
    alt: "The app's welcome and sign-in screen with a prominent option to continue as a guest.",
  },
  {
    src: "/brand/app/screen-lens-3d.webp",
    width: 588,
    height: 1302,
    alt: "The app's nutrient detail for iron: what it does, food sources, the global health context, and a safety note.",
  },
];

export function AppScreenshots() {
  const stageRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion || !("IntersectionObserver" in window)) {
      const frame = window.requestAnimationFrame(() => setIsVisible(true));
      return () => window.cancelAnimationFrame(frame);
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setIsVisible(true);
        observer.disconnect();
      },
      { rootMargin: "0px 0px -12% 0px", threshold: 0.14 },
    );

    observer.observe(stage);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="app-art-wrap">
      <div className="app-stage">
        <div
          ref={stageRef}
          className={`app-stage-inner media-clip-reveal${isVisible ? " is-visible" : ""}`}
        >
          {screens.map((screen, index) => (
            <div className="app-phone" data-phone={index + 1} key={screen.src}>
              <Image
                src={screen.src}
                alt={screen.alt}
                width={screen.width}
                height={screen.height}
                loading="lazy"
                sizes="(max-width: 900px) 32vw, 220px"
              />
            </div>
          ))}
        </div>
        <p className="image-caption">From welcome to daily nutrition learning</p>
      </div>
    </div>
  );
}
