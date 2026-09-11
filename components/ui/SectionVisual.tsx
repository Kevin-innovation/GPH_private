type SectionVisualVariant = "mission" | "team" | "solutions";

// These are intentionally code-native visuals rather than stock or generated
// photos. Each one uses the same translucent surfaces and thin connector rules
// as the site's interactive lens, so the image language belongs to the product.
export function SectionVisual({ variant }: { variant: SectionVisualVariant }) {
  return (
    <div className={`section-visual section-visual-${variant}`} aria-hidden="true">
      {variant === "mission" ? <MissionVisual /> : null}
      {variant === "team" ? <TeamVisual /> : null}
      {variant === "solutions" ? <SolutionsVisual /> : null}
    </div>
  );
}

function MissionVisual() {
  return (
    <svg viewBox="0 0 720 520" role="presentation">
      <defs>
        <linearGradient id="mission-glass" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#ffffff" stopOpacity="0.76" />
          <stop offset="0.55" stopColor="#c6e5e3" stopOpacity="0.34" />
          <stop offset="1" stopColor="#7aa7b4" stopOpacity="0.12" />
        </linearGradient>
        <radialGradient id="mission-core" cx="50%" cy="45%" r="60%">
          <stop offset="0" stopColor="#ffffff" stopOpacity="0.94" />
          <stop offset="0.65" stopColor="#a9d6d2" stopOpacity="0.38" />
          <stop offset="1" stopColor="#12314b" stopOpacity="0.08" />
        </radialGradient>
        <filter id="mission-blur" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="18" />
        </filter>
      </defs>
      <g fill="none" stroke="#5a9eaa" strokeOpacity="0.28" strokeWidth="1.5">
        <path d="M92 258 C190 82 466 52 642 198" />
        <path d="M68 350 C238 466 526 438 678 280" />
        <path d="M156 120 C294 248 376 298 612 408" />
        <path d="M116 434 C242 272 390 188 568 96" />
        <path d="M144 254 C284 180 466 202 600 314" />
      </g>
      <g fill="#f2b84b" fillOpacity="0.62">
        <circle cx="148" cy="254" r="11" />
        <circle cx="274" cy="122" r="8" />
        <circle cx="548" cy="114" r="10" />
        <circle cx="608" cy="314" r="7" />
      </g>
      <g fill="#187f77" fillOpacity="0.58">
        <circle cx="206" cy="374" r="9" />
        <circle cx="398" cy="88" r="7" />
        <circle cx="522" cy="386" r="11" />
      </g>
      <circle cx="372" cy="258" r="102" fill="#8ebfbe" fillOpacity="0.12" filter="url(#mission-blur)" />
      <circle cx="372" cy="258" r="74" fill="url(#mission-glass)" stroke="#187f77" strokeOpacity="0.5" strokeWidth="2" />
      <circle cx="372" cy="258" r="49" fill="url(#mission-core)" stroke="#ffffff" strokeOpacity="0.72" strokeWidth="1.5" />
      <g fill="#12314b" fillOpacity="0.52">
        <circle cx="372" cy="258" r="9" />
        <circle cx="327" cy="220" r="5" />
        <circle cx="430" cy="232" r="6" />
        <circle cx="414" cy="301" r="5" />
        <circle cx="337" cy="306" r="6" />
      </g>
      <circle cx="372" cy="258" r="126" fill="none" stroke="#12314b" strokeOpacity="0.12" strokeWidth="1" strokeDasharray="3 11" />
    </svg>
  );
}

function TeamVisual() {
  return (
    <svg viewBox="0 0 720 520" role="presentation">
      <defs>
        <linearGradient id="team-panel" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#ffffff" stopOpacity="0.9" />
          <stop offset="0.5" stopColor="#d7ecea" stopOpacity="0.56" />
          <stop offset="1" stopColor="#f2b84b" stopOpacity="0.15" />
        </linearGradient>
        <linearGradient id="team-screen" x1="0" y1="0" x2="0.85" y2="1">
          <stop offset="0" stopColor="#eff8f7" />
          <stop offset="0.56" stopColor="#ffffff" />
          <stop offset="1" stopColor="#b9d9da" />
        </linearGradient>
        <filter id="team-shadow" x="-25%" y="-25%" width="150%" height="170%">
          <feDropShadow dx="0" dy="18" stdDeviation="18" floodColor="#12314b" floodOpacity="0.14" />
        </filter>
      </defs>
      <g fill="none" stroke="#187f77" strokeOpacity="0.24" strokeWidth="1.5">
        <path d="M80 342 C190 266 232 168 362 142" />
        <path d="M170 430 C294 330 386 318 608 362" />
        <path d="M126 164 C260 208 366 224 594 158" />
      </g>
      <g filter="url(#team-shadow)">
        <rect x="204" y="112" width="318" height="224" rx="25" fill="url(#team-panel)" stroke="#ffffff" strokeOpacity="0.78" strokeWidth="2" transform="rotate(-7 363 224)" />
        <rect x="244" y="154" width="238" height="144" rx="15" fill="url(#team-screen)" stroke="#12314b" strokeOpacity="0.16" strokeWidth="1.5" transform="rotate(-7 363 224)" />
        <rect x="296" y="178" width="88" height="12" rx="6" fill="#187f77" fillOpacity="0.48" transform="rotate(-7 363 224)" />
        <rect x="296" y="205" width="142" height="8" rx="4" fill="#12314b" fillOpacity="0.14" transform="rotate(-7 363 224)" />
        <rect x="296" y="229" width="103" height="8" rx="4" fill="#12314b" fillOpacity="0.1" transform="rotate(-7 363 224)" />
        <circle cx="285" cy="264" r="18" fill="#f2b84b" fillOpacity="0.56" />
        <circle cx="333" cy="264" r="18" fill="#187f77" fillOpacity="0.42" />
        <circle cx="381" cy="264" r="18" fill="#12314b" fillOpacity="0.22" />
      </g>
      <g fill="#ffffff" fillOpacity="0.82" stroke="#187f77" strokeOpacity="0.44" strokeWidth="1.5">
        <rect x="82" y="270" width="96" height="96" rx="23" />
        <rect x="522" y="294" width="112" height="112" rx="28" />
      </g>
      <g fill="none" stroke="#12314b" strokeOpacity="0.32" strokeWidth="2">
        <path d="M113 327 h34" />
        <path d="M113 341 h22" />
        <path d="M554 346 h48" />
        <path d="M554 362 h31" />
        <path d="M554 378 h41" />
      </g>
      <g fill="#f2b84b" fillOpacity="0.68">
        <circle cx="126" cy="306" r="8" />
        <circle cx="548" cy="324" r="9" />
      </g>
      <circle cx="626" cy="126" r="34" fill="#a9d6d2" fillOpacity="0.28" />
      <circle cx="115" cy="126" r="18" fill="#12314b" fillOpacity="0.16" />
    </svg>
  );
}

function SolutionsVisual() {
  return (
    <svg viewBox="0 0 720 520" role="presentation">
      <defs>
        <linearGradient id="solutions-glass" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#ffffff" stopOpacity="0.86" />
          <stop offset="0.58" stopColor="#d5ece9" stopOpacity="0.5" />
          <stop offset="1" stopColor="#9eb9ca" stopOpacity="0.2" />
        </linearGradient>
        <filter id="solutions-glow" x="-25%" y="-25%" width="150%" height="150%">
          <feGaussianBlur stdDeviation="14" />
        </filter>
      </defs>
      <g fill="none" stroke="#187f77" strokeOpacity="0.32" strokeWidth="2">
        <path d="M110 262 C210 262 260 166 358 166 S504 262 612 262" />
        <path d="M110 262 C210 262 260 358 358 358 S504 262 612 262" />
        <path d="M358 166 V358" />
      </g>
      <circle cx="358" cy="262" r="116" fill="#8ebfbe" fillOpacity="0.18" filter="url(#solutions-glow)" />
      <g fill="url(#solutions-glass)" stroke="#ffffff" strokeOpacity="0.82" strokeWidth="2">
        <rect x="52" y="202" width="116" height="116" rx="32" />
        <rect x="300" y="104" width="116" height="116" rx="32" />
        <rect x="300" y="304" width="116" height="116" rx="32" />
        <rect x="552" y="202" width="116" height="116" rx="32" />
      </g>
      <g fill="none" stroke="#12314b" strokeOpacity="0.46" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M91 265 l17 16 29 -36" />
        <path d="M336 164 l20 -22 22 22" />
        <path d="M334 354 h48 M334 374 h48" />
        <path d="M582 260 h58 M582 280 h38" />
      </g>
      <g fill="#f2b84b" fillOpacity="0.72">
        <circle cx="110" cy="236" r="7" />
        <circle cx="358" cy="137" r="7" />
        <circle cx="358" cy="337" r="7" />
        <circle cx="610" cy="236" r="7" />
      </g>
      <g fill="#187f77" fillOpacity="0.5">
        <circle cx="219" cy="262" r="6" />
        <circle cx="497" cy="262" r="6" />
      </g>
    </svg>
  );
}
