import type { ReactNode } from "react";

type RelatedPage = { label: string; href: string; description?: ReactNode };

export function RelatedPages({ pages, title = "Continue reading" }: { pages: readonly RelatedPage[]; title?: string }) {
  if (pages.length === 0) return null;

  const columnCount = Math.min(pages.length, 3);

  return (
    <nav className={`related-pages related-pages-count-${columnCount}`} aria-label={title}>
      <p className="eyebrow">{title}</p>
      <ul>
        {pages.map((page) => (
          <li key={page.href}>
            <a href={page.href}>
              <span className="related-page-label">{page.label}</span>
              {page.description ? <span className="related-page-description">{page.description}</span> : null}
              <span className="related-page-arrow" aria-hidden="true">→</span>
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
