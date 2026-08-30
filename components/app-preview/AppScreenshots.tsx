import Image from "next/image";

// Three product screens composited into device frames so the stage reads as a
// journey: enter the app, use it, then inspect the nutrition context.
const screens = [
  {
    src: "/brand/app/screen-today-3d.webp",
    width: 588,
    height: 1302,
    alt: "The app's Today screen with a daily nutrition score, logged foods, and nutrient balance gauges for thirteen nutrients.",
  },
  {
    src: "/brand/app/screen-welcome-3d.webp",
    width: 588,
    height: 1302,
    alt: "The app's welcome and sign-in screen with a prominent option to continue as a guest.",
  },
  {
    src: "/brand/app/screen-lens-3d.webp",
    width: 588,
    height: 1302,
    alt: "The app's nutrient detail for iron: what it does, food sources, the global health context, and a safety note.",
  },
];

export function AppScreenshots() {
  return (
    <div className="app-art-wrap">
      <div className="app-stage">
        <div className="app-stage-inner">
          {screens.map((screen, index) => (
            <div className="app-phone" data-phone={index + 1} key={screen.src}>
              <Image
                src={screen.src}
                alt={screen.alt}
                width={screen.width}
                height={screen.height}
                loading="lazy"
                sizes="(max-width: 900px) 34vw, 20vw"
              />
            </div>
          ))}
        </div>
        <p className="image-caption">From welcome to daily nutrition learning</p>
      </div>
    </div>
  );
}
