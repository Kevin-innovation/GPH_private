export type NavigationLink = {
  label: string;
  href: string;
};

export type NavigationItem =
  | NavigationLink
  | {
      label: string;
      items: readonly NavigationLink[];
    };

// Primary navigation is intentionally shallow. Each destination has one
// canonical location in the header; supporting destinations live in the
// relevant dropdown or footer utility links.
export const navigation = [
  {
    label: "About",
    items: [
      { label: "Our Mission", href: "/about/mission" },
      { label: "Our Team", href: "/about/team" },
    ],
  },
  { label: "Country Spotlight", href: "/country-spotlight" },
  {
    label: "The Lens",
    items: [
      { label: "Micronutrients", href: "/lens/micronutrients" },
      { label: "How the Lens Works", href: "/lens/how-it-works" },
      { label: "Solutions & Action", href: "/lens/solutions" },
    ],
  },
  { label: "Nutrition App", href: "/nutrition-app" },
  { label: "Contact", href: "/contact" },
] as const satisfies readonly NavigationItem[];
