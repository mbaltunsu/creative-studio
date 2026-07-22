import type { Accent } from "./nav";

/* Mirrors SOLUTIONS in nav.ts one-to-one (mega menu, footer and this section
   must always tell the same story — same six names, same accents). */
export interface ServiceCategory {
  id: string;
  index: string;
  title: string;
  description: string;
  deliverables: string[];
  image: string;
  accent: Accent;
}

export const SERVICES: ServiceCategory[] = [
  {
    id: "motion-design",
    index: "01",
    title: "3D & Motion Design",
    description:
      "2D/3D motion graphics, title sequences and real-time cinematic FX — when a shot needs to feel impossible.",
    deliverables: ["Motion graphics", "Title sequences", "Cinematic FX", "Brand systems"],
    image: "/images/cat-motion.webp",
    accent: "blue",
  },
  {
    id: "animation-films",
    index: "02",
    title: "Animation & Short Films",
    description:
      "Short animated films and series work — story, design, animation and sound under one roof.",
    deliverables: ["Short films", "Series", "Character design", "Storyboards"],
    image: "/images/cat-animation.webp",
    accent: "coral",
  },
  {
    id: "commercial-films",
    index: "03",
    title: "Commercial & Brand Films",
    description:
      "Product videos, TV and social commercials, brand films. Concept, shoot, edit, grade — one team from script to delivery.",
    deliverables: ["Commercials", "Product videos", "Brand films", "Post & grade"],
    image: "/images/cat-film.webp",
    accent: "acid",
  },
  {
    id: "ai-production",
    index: "04",
    title: "AI Production",
    description:
      "Realistic AI video and imagery, generative campaigns and pipelines that put a month of content in a week of work.",
    deliverables: ["AI video", "AI imagery", "Generative campaigns", "Content pipelines"],
    image: "/images/cat-ai.webp",
    accent: "violet",
  },
  {
    id: "editorial-fashion",
    index: "05",
    title: "Editorial & Fashion",
    description:
      "Brand shoots, editorial campaigns, high-end retouch and AI-assisted generation for fashion, accessories and beauty.",
    deliverables: ["Campaign shoots", "Editorial", "Retouch", "AI generation"],
    image: "/images/cat-editorial.webp",
    accent: "teal",
  },
  {
    id: "web-digital",
    index: "06",
    title: "Web & Digital Design",
    description:
      "Websites and interactive experiences designed and built in-house — the kind that win awards and convert visitors.",
    deliverables: ["Web design", "Development", "Interactive", "E-commerce"],
    image: "/images/cat-web.webp",
    accent: "blue",
  },
];
