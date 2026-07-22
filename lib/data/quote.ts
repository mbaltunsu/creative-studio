/* Quote-brief domain: shared between the modal, the API route and the email
   transport. Project types are the mega-menu SOLUTIONS — single source in nav.ts. */

export const CURRENCIES = [
  { code: "USD", symbol: "$" },
  { code: "EUR", symbol: "€" },
  { code: "TRY", symbol: "₺" },
] as const;

export type CurrencyCode = (typeof CURRENCIES)[number]["code"];

export interface QuotePayload {
  projectType: string;
  currency: CurrencyCode;
  amount: number;
  launchDate: string; // yyyy-mm-dd
  name: string;
  email: string;
  phone?: string;
  description: string;
}
