const stages = [
  {
    step: "01",
    title: "Body",
    detail: "what happens in us",
    icon: (
      <>
        <path d="M24 39S11.5 31.7 8 23.8C5.2 17.5 8.5 10 15.2 10c3.9 0 6.8 2.1 8.8 5.5C26 12.1 28.9 10 32.8 10 39.5 10 42.8 17.5 40 23.8 36.5 31.7 24 39 24 39Z" />
        <path d="M10 24h7l2.5-5 4.5 10 3-6 2.5 3H38" />
      </>
    ),
  },
  {
    step: "02",
    title: "Food",
    detail: "what reaches the plate",
    icon: (
      <>
        <path d="M24 15c-4-5-11-3-13 3-2 7 2 18 9 18 2 0 3-1 4-1s2 1 4 1c7 0 11-11 9-18-2-6-9-8-13-3Z" />
        <path d="M25 13c0-4 2-7 6-8" />
        <path d="M31 5c-2 3-5 4-8 3" />
      </>
    ),
  },
  {
    step: "03",
    title: "Systems",
    detail: "what shapes access",
    icon: (
      <>
        <circle cx="24" cy="24" r="4" />
        <circle cx="11" cy="14" r="4" />
        <circle cx="37" cy="14" r="4" />
        <circle cx="11" cy="36" r="4" />
        <circle cx="37" cy="36" r="4" />
        <path d="m14 16 6 5m8-5-4 5m-4 3-6 8m14-8 6 8" />
      </>
    ),
  },
];

// ALTERNATE HERO VISUAL — the three-level diagram.
//
// This is the live, type-checked alternative to the brand illustration currently
// used in the hero. It is kept as a real module rather than a commented-out block
// so it stays compiled and cannot rot.
//
// To switch the hero back to this diagram, change one line in HeroVisual.tsx:
//     import { LensDiagram } from "./LensDiagram";
//     export function HeroVisual() { return <LensDiagram />; }
// Its styles live in globals.css under "15. Lens diagram" and are still present.
//
// Server component. The previous version tracked pointer position in state and
// listened to scroll to drive a spotlight and parallax that no longer render —
// it shipped client JS to move things that had been removed.
//
// The connector is CSS rather than SVG. The old version drew the line in a
// 720x420 viewBox with preserveAspectRatio="none", squashed it to 540x136, and
// positioned the icons separately in HTML: the two coordinate systems disagreed
// by 26px at each end, and the animated dot rendered as a 9x3.9px sliver. Here
// the rule and the icons share one grid, so the line ends exactly on the outer
// icon centres at any width.
export function LensDiagram() {
  return (
    <figure className="lens-diagram">
        <figcaption className="lens-diagram-kicker">
          <span>One nutrient</span>
          <i aria-hidden="true" />
          <span>Three levels</span>
        </figcaption>

        <div className="lens-diagram-core">
          <span className="lens-diagram-tag">GPHL / 01</span>
          <strong>
            One
            <br />
            lens
          </strong>
          <small>read the whole chain</small>
        </div>

        <ol className="lens-diagram-track">
          <span className="lens-diagram-rule" aria-hidden="true">
            <i />
          </span>
          {stages.map((stage, index) => (
            <li className="lens-diagram-stage" style={{ "--step": index } as React.CSSProperties} key={stage.step}>
              <span className="lens-diagram-icon" aria-hidden="true">
                <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                  {stage.icon}
                </svg>
              </span>
              <span className="lens-diagram-step">{stage.step}</span>
              <strong>{stage.title}</strong>
              <small>{stage.detail}</small>
            </li>
          ))}
        </ol>

        <p className="lens-diagram-foot">
          <span>Biology</span>
          <i aria-hidden="true" />
          <span>Food access</span>
          <i aria-hidden="true" />
          <span>Public action</span>
        </p>
    </figure>
  );
}
