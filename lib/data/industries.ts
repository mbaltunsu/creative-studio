import type { Accent } from "./nav";

export const INDUSTRIES_KICKER = "{ experience across different fields }";

export interface IndustryPill {
  label: string;
  code: string; // 3-letter sector code shown on the card stub
  accent?: Accent; // undefined → paper card
}

export const INDUSTRIES: IndustryPill[] = [
  { label: "Technology", code: "TEC" },
  { label: "Automotive", code: "AUT", accent: "blue" },
  { label: "Construction", code: "CON" },
  { label: "Product Design", code: "PRD" },
  { label: "Fashion", code: "FSH", accent: "coral" },
  { label: "Consumer Devices", code: "DEV" },
  { label: "E-commerce", code: "ECO", accent: "acid" },
  { label: "Architecture", code: "ARC" },
  { label: "Media & Publishing", code: "MED", accent: "violet" },
  { label: "Hospitality", code: "HSP" },
  { label: "Energy", code: "NRG", accent: "teal" },
  { label: "Real Estate", code: "RLE" },
];
