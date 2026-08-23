export function ExternalLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer">
      {children} <span className="sr-only">(opens in a new tab)</span>
    </a>
  );
}
