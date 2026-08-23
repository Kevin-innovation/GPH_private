// Sentence-case section label. Carbon resists all-caps tracking, so the only
// upper-case eyebrow in the system is the app product mark.
export function Eyebrow({ children }: { children: React.ReactNode }) {
  return <p className="eyebrow">{children}</p>;
}
