import type { Accent } from "./nav";

export const INDUSTRIES_KICKER = "{ experience across different fields }";

export interface IndustryPill {
  label: string;
  accent?: Accent; // undefined → paper pill
}

export const INDUSTRIES: IndustryPill[] = [
  { label: "Technology" },
  { label: "Automotive", accent: "blue" },
  { label: "Construction" },
  { label: "Product Design" },
  { label: "Fashion", accent: "coral" },
  { label: "Consumer Devices" },
  { label: "E-commerce", accent: "acid" },
  { label: "Architecture" },
  { label: "Media & Publishing", accent: "violet" },
  { label: "Hospitality" },
  { label: "Energy", accent: "teal" },
  { label: "Real Estate" },
];
