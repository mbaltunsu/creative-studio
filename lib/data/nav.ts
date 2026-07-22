export type Accent = "blue" | "coral" | "acid" | "teal" | "violet";

export const ACCENT_HEX: Record<Accent, string> = {
  blue: "#3b5bff",
  coral: "#ff5a5f",
  acid: "#e8ff3d",
  teal: "#00d9c7",
  violet: "#9b5cff",
};

export interface SolutionItem {
  label: string;
  blurb: string;
  href: string;
  image: string;
  accent: Accent;
}

/* Mega-menu "Solutions" items — category pages arrive in Phase 2, hrefs are placeholders */
export const SOLUTIONS: SolutionItem[] = [
  {
    label: "3D & Motion Design",
    blurb: "Motion graphics, title sequences, cinematic FX",
    href: "#work",
    image: "/images/cat-motion.webp",
    accent: "blue",
  },
  {
    label: "Animation & Short Films",
    blurb: "2D/3D animated films and series",
    href: "#work",
    image: "/images/cat-animation.webp",
    accent: "coral",
  },
  {
    label: "Commercial & Brand Films",
    blurb: "TV and social commercials, product films",
    href: "#work",
    image: "/images/cat-film.webp",
    accent: "acid",
  },
  {
    label: "AI Production",
    blurb: "Realistic AI video and imagery at scale",
    href: "#work",
    image: "/images/cat-ai.webp",
    accent: "violet",
  },
  {
    label: "Editorial & Fashion",
    blurb: "Campaigns, shoots, retouch",
    href: "#work",
    image: "/images/cat-editorial.webp",
    accent: "teal",
  },
  {
    label: "Web & Digital Design",
    blurb: "Websites and interactive experiences",
    href: "#work",
    image: "/images/cat-web.webp",
    accent: "blue",
  },
];

export const NAV_LINKS = [
  { label: "Solutions", href: "#solutions", mega: true },
  { label: "Work", href: "#work", mega: false },
  { label: "Studio", href: "#studio", mega: false },
  { label: "Contact", href: "#contact", mega: false },
] as const;
