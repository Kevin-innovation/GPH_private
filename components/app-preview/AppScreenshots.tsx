import Image from "next/image";

// Captured from the running app at 390x844 and composited into a device frame,
// so the section shows what someone actually opens rather than artwork of it.
// Three separate transparent images so the stage can respond to scroll.
const screens = [
  {
    src: "/brand/app/screen-today.webp",
    width: 588,
    height: 1302,
    alt: "The app's Today screen: a nutrition score of 68 out of 100, and a nutrient balance list ranking all thirteen nutrients against their targets.",
  },
  {
    src: "/brand/app/screen-add-meal.webp",
    width: 588,
    height: 1302,
    alt: "The app's Add Food screen, searching the food list and showing matches with their serving sizes.",
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
