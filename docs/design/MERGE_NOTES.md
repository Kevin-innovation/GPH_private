# Design merge notes

## Adopted

- IBM: square geometry, 4px spacing base, light display typography, surface
  changes and hairlines instead of shadows, calm light-first layout, and a
  single restrained primary action treatment.
- WIRED: editorial story rows, hairline dividers, asymmetric magazine rhythm,
  one-column stacks, and content-led hierarchy.
- Notion: warm off-white reading canvas, body weight 400, quiet chrome, and
  accent colors reserved for actions and signals.

## Replaced for Global Public Health Lens

- IBM Blue becomes Deep Navy `#12314B`; the brand's Public Health Teal,
  Green, and Gold provide limited semantic accents.
- IBM white canvas becomes Cloud `#F5F8F7` alternating with White.
- IBM Plex Sans, WIRED display serif, and Notion's heavier display weights become
  one Inter family with weight 300 display and weight 400 body for a calm,
  approachable learning experience.
- Vendor component cards become semantic sections, story rows, connected
  sequences, and flat bands. No reusable generic `Card` component is created.

## Rejected

- Gradients, glassmorphism, glow, drop shadows, floating decorative shapes,
  pill buttons, dark-first hero areas, and repeated three-column card grids.
- Decorative icon systems, unverified statistic counters, and product-dashboard
  mockups. The supplied app preview image is shown as replaceable artwork only.

## Accessibility corrections

The original brand colors are preserved for large graphics and fills, but the
text-only derivatives `#117E76`, `#4B7E36`, and `#99670B` are used where AA
contrast is needed. White text is never placed on Teal or Gold.
