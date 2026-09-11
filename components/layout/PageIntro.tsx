import type { ReactNode } from "react";
import { Eyebrow } from "@/components/ui/Eyebrow";

export function PageIntro({ eyebrow, title, intro, className }: { eyebrow: ReactNode; title: ReactNode; intro?: ReactNode; className?: string }) {
  return (
    <header className={`page-intro${className ? ` ${className}` : ""}`}>
      <Eyebrow>{eyebrow}</Eyebrow>
      <h1>{title}</h1>
      {intro ? <div className="page-intro-copy">{intro}</div> : null}
    </header>
  );
}
