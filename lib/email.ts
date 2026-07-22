import { CURRENCIES, type QuotePayload } from "@/lib/data/quote";

/* Email transport seam. The API route hands a validated brief to this function;
   how it leaves the building is this file's concern only.
   ponytail: log-only transport — swap in Resend/SES/Postmark here later.
   Contract: resolve on success, throw on delivery failure. */
export async function sendQuoteEmail(quote: QuotePayload): Promise<void> {
  const symbol =
    CURRENCIES.find((c) => c.code === quote.currency)?.symbol ?? "";
  const body = [
    `New project brief — ${quote.projectType}`,
    ``,
    `Type    ${quote.projectType}`,
    `Budget  ${symbol}${quote.amount.toLocaleString("en-US")} ${quote.currency}`,
    `Launch  ${quote.launchDate}`,
    ``,
    `Name    ${quote.name}`,
    `Email   ${quote.email}`,
    `Phone   ${quote.phone || "—"}`,
    ``,
    quote.description,
  ].join("\n");

  console.log(`[quote]\n${body}`);
}
