import { Eyebrow } from "./Eyebrow";
import type { ReactNode } from "react";

export function SectionHeading({ eyebrow, title, intro, id }: { eyebrow: string; title: ReactNode; intro?: string; id?: string }) {
  return (
    <div className="section-heading">
      <Eyebrow>{eyebrow}</Eyebrow>
      <h2 id={id}>{title}</h2>
      {intro ? <p className="section-intro">{intro}</p> : null}
    </div>
  );
}
