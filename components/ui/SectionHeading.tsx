import { Eyebrow } from "./Eyebrow";
import type { ReactNode } from "react";
import { orphanSafeText } from "./orphanSafeText";

function protectPlainText(content: ReactNode) {
  return typeof content === "string" ? orphanSafeText(content) : content;
}

export function SectionHeading({
  eyebrow,
  title,
  intro,
  id,
  level = "h2",
}: {
  eyebrow: string;
  title: ReactNode;
  intro?: ReactNode;
  id?: string;
  level?: "h1" | "h2";
}) {
  const Heading = level;

  return (
    <div className="section-heading">
      <Eyebrow>{eyebrow}</Eyebrow>
      <Heading id={id}>{protectPlainText(title)}</Heading>
      {intro ? <p className="section-intro">{protectPlainText(intro)}</p> : null}
    </div>
  );
}
