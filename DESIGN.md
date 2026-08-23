# Global Public Health Lens — Design System

This project uses a merged design direction: IBM Carbon supplies the structural
discipline, WIRED supplies the editorial story-row rhythm, and Notion supplies
the calm reading canvas. The brand palette and content rules below override the
vendor references in `docs/design/vendor/`.

## Product expression

- Feel: scientific, civic, editorial, calm, and useful; never clinical, salesy,
  or like a supplement shop.
- Primary story: every topic connects the body, communities, and public-health
  systems.
- Default alignment is left. Use centered content only for the hero CTA row.
- Use one asymmetric 5:7 split and one-column editorial stacks. Do not use a
  repeated three-column card grid.

## Colors

```css
--color-white: #FFFFFF;
--color-cloud: #F5F8F7;
--color-ink: #17252E;
--color-navy: #12314B;
--color-hairline: rgba(18, 49, 75, 0.12);
--color-teal: #159A91;
--color-teal-text: #117E76;
--color-green: #75B85A;
--color-green-text: #4B7E36;
--color-gold: #F2B84B;
--color-gold-text: #99670B;
```

Navy and Ink carry readable text. Teal, Green, and Gold are restrained accents:
use `teal-text`, `green-text`, and `gold-text` when they must appear as small
text. Never place white text on Gold or Teal, and never use the original Green
as text. Gold always pairs with Navy text. Do not communicate state through
color alone; pair the color with a visible label.

## Typography

- Font: Inter, with Arial and system sans fallbacks.
- Display: weight 300, tight tracking, fluid `clamp()` sizes.
- Body: weight 400, minimum 16px, line-height 1.6 or higher.
- Eyebrows: sentence case, normal tracking; the app eyebrow may be uppercase by
  explicit product convention.
- Links and emphasis use color, underline, or a small weight change rather than
  heavy bold body paragraphs.

## Geometry and rhythm

- Base spacing unit: 4px. Use 4 / 8 / 12 / 16 / 24 / 32 / 48 / 96px rhythm.
- Global radius: `0`. The only exception is a genuinely circular icon mark.
- Shadows: none. Elevation comes from Cloud/White surface changes and 1px
  hairlines.
- Backgrounds alternate between Cloud and White. No gradients, glass, glow, or
  decorative floating shapes.
- Desktop content max width: 1280px. Section padding: 96px desktop and 56px
  mobile. Header controls and form controls meet a 48px minimum touch target.
- Motion is limited to 150–300ms opacity/transform transitions and must honor
  `prefers-reduced-motion`.

## Components and interaction

- Use semantic HTML first: `header`, `nav`, `main`, `section`, `details`,
  `summary`, `form`, and real buttons/links.
- Buttons are square and readable: Navy filled primary, white outlined
  secondary, visible focus ring. Never use pill CTAs.
- Nutrients are WIRED-style story rows with a hairline divider and inline
  `details` expansion, not generic cards.
- The Global Lens chain is a connected vertical sequence with a visible line,
  step markers, and arrows/labels. The connection matters more than decoration.
- Use Lucide icons only when they clarify interaction; maximum eight total.
- External links open in a new tab with `rel="noopener noreferrer"` and an
  accessible “(opens in a new tab)” label.
- Images have explicit dimensions, meaningful alt text when informative, and
  empty alt text when decorative. The supplied hero and app artwork are the
  only photographic/illustrated visual surfaces.

## Accessibility and quality gates

- `lang="en"`, logical heading order, keyboard-complete navigation, visible
  focus rings, skip link, and no keyboard traps.
- Sticky header offsets all anchor targets with `scroll-margin-top`.
- Mobile navigation closes on Escape, returns focus to its trigger, and does not
  leave the document inert after closing.
- Contact form has native labels, client validation, error/success states, a
  honeypot, and a minimum submit-time check without CAPTCHA.
- Confirm no horizontal overflow at 320, 375, 768, 1024, 1440, and 1920px.
- Keep UI copy in English. Keep implementation names and comments in English.

## Sources

Structural reference: IBM Carbon-inspired analysis. Editorial reference:
WIRED-inspired analysis. Reading-canvas reference: Notion-inspired analysis.
The source files are retained in `docs/design/vendor/`; project-specific
decisions and accessibility corrections in this file are authoritative.
