import type { Accent } from "./nav";

export interface PathCard {
  id: string;
  number: string;
  title: string;
  description: string;
  cta: string;
  accent: Accent;
}

export const PATH_KICKER = "{ start where you fit best }";

export const PATH_CARDS: PathCard[] = [
  {
    id: "website",
    number: "{ 01 }",
    title: "I need a website",
    description:
      "A site that looks sharp, moves beautifully and converts — designed and built end-to-end by one team.",
    cta: "Scope my site",
    accent: "blue",
  },
  {
    id: "film",
    number: "{ 02 }",
    title: "I need a film",
    description:
      "A commercial, product video or brand film — from first script line to final grade.",
    cta: "Plan the shoot",
    accent: "coral",
  },
  {
    id: "scale",
    number: "{ 03 }",
    title: "I need content at scale",
    description:
      "AI-driven pipelines that turn one shoot into a season of on-brand video and imagery.",
    cta: "See the pipeline",
    accent: "violet",
  },
  {
    id: "unsure",
    number: "{ 04 }",
    title: "Not sure yet",
    description:
      "Bring the problem, not the brief. We'll find the format together in a 30-minute call.",
    cta: "Book a call",
    accent: "acid",
  },
];
