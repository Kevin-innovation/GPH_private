import type { ReactNode } from "react";

export function ContentBand({
  children,
  surface = "white",
  className,
  labelledBy,
}: {
  children: ReactNode;
  surface?: "white" | "cloud" | "navy";
  className?: string;
  labelledBy?: string;
}) {
  return (
    <section className={`content-band content-band-${surface}${className ? ` ${className}` : ""}`} aria-labelledby={labelledBy}>
      <div className="page-width content-band-inner">{children}</div>
    </section>
  );
}
