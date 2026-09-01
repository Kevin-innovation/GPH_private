import { Eyebrow } from "./Eyebrow";
import type { ReactNode } from "react";
import { orphanSafeText } from "./orphanSafeText";

function protectPlainText(content: ReactNode) {
  return typeof content === "string" ? orphanSafeText(content) : content;
}

export function SectionHeading({ eyebrow, title, intro, id }: { eyebrow: string; title: ReactNode; intro?: ReactNode; id?: string }) {
  return (
    <div className="section-heading">
      <Eyebrow>{eyebrow}</Eyebrow>
      <h2 id={id}>{protectPlainText(title)}</h2>
      {intro ? <p className="section-intro">{protectPlainText(intro)}</p> : null}
    </div>
  );
}
