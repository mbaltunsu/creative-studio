import type { Accent } from "./nav";

export type CardAspect = "4:5" | "1:1" | "16:9" | "9:16";

export interface Project {
  slug: string;
  title: string;
  category: string;
  year: string;
  aspect: CardAspect;
  image: string;
  accent: Accent;
}

export const PROJECTS: Project[] = [
  {
    slug: "vela",
    title: "Vela",
    category: "Automotive Launch Film",
    year: "2026",
    aspect: "4:5",
    image: "/images/proj-vela.webp",
    accent: "blue",
  },
  {
    slug: "kin",
    title: "Kin",
    category: "AI Campaign",
    year: "2026",
    aspect: "9:16",
    image: "/images/proj-kin.webp",
    accent: "violet",
  },
  {
    slug: "solstice",
    title: "Solstice",
    category: "Product Video",
    year: "2025",
    aspect: "1:1",
    image: "/images/proj-solstice.webp",
    accent: "acid",
  },
  {
    slug: "atelier-mono",
    title: "Atelier Mono",
    category: "Editorial Campaign",
    year: "2026",
    aspect: "4:5",
    image: "/images/proj-atelier.webp",
    accent: "coral",
  },
  {
    slug: "arcadia",
    title: "Arcadia",
    category: "Short Film",
    year: "2025",
    aspect: "16:9",
    image: "/images/proj-arcadia.webp",
    accent: "blue",
  },
  {
    slug: "halide",
    title: "Halide",
    category: "Product Film & Stills",
    year: "2025",
    aspect: "4:5",
    image: "/images/proj-halide.webp",
    accent: "teal",
  },
  {
    slug: "pulse",
    title: "Pulse",
    category: "Motion System",
    year: "2025",
    aspect: "1:1",
    image: "/images/proj-pulse.webp",
    accent: "violet",
  },
  {
    slug: "northline",
    title: "Northline",
    category: "Brand & Architecture Film",
    year: "2024",
    aspect: "4:5",
    image: "/images/proj-northline.webp",
    accent: "acid",
  },
  {
    slug: "meridian",
    title: "Meridian",
    category: "Website & Interactive",
    year: "2024",
    aspect: "16:9",
    image: "/images/proj-meridian.webp",
    accent: "teal",
  },
];
