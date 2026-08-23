import Image from "next/image";

// Cut from the prototype artwork as three separate transparent screens so the
// stage can respond to scroll. The source was one flat image on a grey panel,
// which could only ever sit there.
const screens = [
  {
    src: "/brand/app/screen-today.webp",
    width: 564,
    height: 1260,
    alt: "App screen showing a daily nutrition score of 82 out of 100 with a nutrient balance breakdown.",
  },
  {
    src: "/brand/app/screen-add-meal.webp",
    width: 588,
    height: 1329,
    alt: "App screen for adding a meal, listing recent foods with serving sizes.",
  },
  {
    src: "/brand/app/screen-lens.webp",
    width: 555,
    height: 1256,
    alt: "App screen showing the Global Lens view of iron, with food sources and a safety note.",
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
        <p className="image-caption">Three prototype screens · planned educational experience</p>
      </div>
    </div>
  );
}
