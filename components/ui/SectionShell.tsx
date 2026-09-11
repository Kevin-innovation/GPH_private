"use client";

import { useEffect, useRef, useState } from "react";

// Every section shares one wrapper so the canvas/surface rhythm, anchor offset,
// vertical spacing, and one-shot chapter entrance are declared in a single place.
export function SectionShell({
  id,
  surface,
  labelledBy,
  className,
  children,
}: {
  id: string;
  surface: "white" | "cloud";
  labelledBy?: string;
  className?: string;
  children: React.ReactNode;
}) {
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

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
      { rootMargin: "0px 0px -10% 0px", threshold: 0.08 },
    );

    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className={`section section-${surface} chapter-reveal${isVisible ? " is-chapter-visible" : ""}${className ? ` ${className}` : ""}`}
      id={id}
      aria-labelledby={labelledBy}
    >
      {children}
    </section>
  );
}
