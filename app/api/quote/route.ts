import { CURRENCIES, type QuotePayload } from "@/lib/data/quote";
import { sendQuoteEmail } from "@/lib/email";

const isFilled = (v: unknown): v is string =>
  typeof v === "string" && v.trim().length > 0;

export async function POST(request: Request) {
  let data: Partial<QuotePayload>;
  try {
    data = await request.json();
  } catch {
    return Response.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }

  const amount = Number(data.amount);
  const valid =
    isFilled(data.projectType) &&
    CURRENCIES.some((c) => c.code === data.currency) &&
    Number.isFinite(amount) &&
    amount > 0 &&
    isFilled(data.launchDate) &&
    /^\d{4}-\d{2}-\d{2}$/.test(data.launchDate) &&
    isFilled(data.name) &&
    isFilled(data.email) &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email) &&
    isFilled(data.description);

  if (!valid) {
    return Response.json(
      { ok: false, error: "Missing or invalid fields" },
      { status: 400 },
    );
  }

  try {
    await sendQuoteEmail({
      projectType: data.projectType!.trim(),
      currency: data.currency!,
      amount,
      launchDate: data.launchDate!,
      name: data.name!.trim(),
      email: data.email!.trim(),
      phone: typeof data.phone === "string" ? data.phone.trim() : undefined,
      description: data.description!.trim(),
    });
  } catch {
    return Response.json(
      { ok: false, error: "Delivery failed" },
      { status: 502 },
    );
  }

  return Response.json({ ok: true });
}
