import Image from "next/image";

// Captured from the running app at 412x915 (Galaxy S25 Edge reference) and
// composited into a device frame,
// so the section shows what someone actually opens rather than artwork of it.
// Three separate transparent images so the stage can respond to scroll.
const screens = [
  {
    src: "/brand/app/screen-today.webp",
    width: 588,
    height: 1302,
    alt: "The app's Today screen with a daily nutrition score, logged foods, and nutrient balance gauges for thirteen nutrients.",
  },
  {
    src: "/brand/app/screen-add-meal.webp",
    width: 588,
    height: 1302,
    alt: "The app's Add Food screen with a searchable food catalog, category filters, and serving-size matches.",
  },
  {
    src: "/brand/app/screen-lens.webp",
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
        <p className="image-caption">Three screens from the running app</p>
      </div>
    </div>
  );
}
