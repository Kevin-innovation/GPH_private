/**
 * Keeps the final two words of plain editorial copy together. CSS `text-wrap:
 * pretty` improves the whole paragraph; this non-breaking final space is the
 * deterministic fallback that prevents a single-word last line.
 */
export function orphanSafeText(text: string) {
  const words = text.trim().split(/\s+/);

  if (words.length < 2) return text;
  if (words.length === 2) return words.join("\u00a0");

  return `${words.slice(0, -2).join(" ")} ${words.slice(-2).join("\u00a0")}`;
}
