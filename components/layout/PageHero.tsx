import type { ReactNode } from "react";

export function PageHero({
  eyebrow,
  title,
  intro,
  media,
  context,
  className,
}: {
  eyebrow: ReactNode;
  title: ReactNode;
  intro?: ReactNode;
  media?: ReactNode;
  context?: ReactNode;
  className?: string;
}) {
  return (
    <section className={`page-hero${className ? ` ${className}` : ""}`}>
      <div className="page-width page-hero-inner">
        {context ? <div className="page-hero-context">{context}</div> : null}
        <div className="page-hero-copy">
          <p className="eyebrow">{eyebrow}</p>
          <h1>{title}</h1>
          {intro ? <div className="page-hero-intro">{intro}</div> : null}
        </div>
        {media ? <div className="page-hero-media">{media}</div> : null}
      </div>
    </section>
  );
}
