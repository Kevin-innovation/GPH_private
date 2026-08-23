type Variant = "primary" | "secondary";

export function ButtonLink({ href, variant = "primary", children }: { href: string; variant?: Variant; children: React.ReactNode }) {
  return (
    <a className={`button button-${variant}`} href={href}>
      {children}
    </a>
  );
}

// Rendered when the linked destination does not exist yet (app pre-launch).
// A status pill rather than a greyed-out button: nothing here is clickable,
// so nothing should look like it failed to become clickable.
export function StatusPill({ children }: { children: React.ReactNode }) {
  return <span className="status-pill">{children}</span>;
}
