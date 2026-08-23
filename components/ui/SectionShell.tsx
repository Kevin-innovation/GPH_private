// Every section shares one wrapper so the canvas/surface rhythm, anchor offset,
// and vertical spacing are declared in a single place.
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
  return (
    <section className={`section section-${surface}${className ? ` ${className}` : ""}`} id={id} aria-labelledby={labelledBy}>
      {children}
    </section>
  );
}
