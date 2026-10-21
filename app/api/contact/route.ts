import { NextResponse } from "next/server";
import { contactSchema } from "@/lib/validation";
import { clientIp, verifyRecaptcha } from "@/lib/recaptcha";
import { sendContactMessage } from "@/lib/mailer";
import { clientKey, rateLimit } from "@/lib/rate-limit";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const limit = rateLimit(clientKey(request.headers, "contact"), 5, 60_000);
  if (!limit.allowed) {
    return NextResponse.json({ ok: false, message: "Please wait a minute before sending another message." }, { status: 429 });
  }

  const body = await request.json().catch(() => null);
  const parsed = contactSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, message: "Please check your name, email and message." },
      { status: 422 },
    );
  }

  const captcha = await verifyRecaptcha(parsed.data.recaptchaToken, "contact", clientIp(request.headers));
  if (!captcha.success) {
    return NextResponse.json(
      {
        ok: false,
        message: captcha.fallbackRequired
          ? "Complete the quick human check and send again."
          : "Verification failed. Try again shortly.",
        fallbackRequired: captcha.fallbackRequired,
      },
      { status: 400 },
    );
  }

  const result = await sendContactMessage({
    name: parsed.data.name,
    email: parsed.data.email,
    message: parsed.data.message,
  });

  return NextResponse.json({
    ok: true,
    delivered: result.delivered,
    message: result.delivered
      ? "Your message is on its way. A coordinator will reply within one working day."
      : "Your message has been recorded. Connect SMTP to enable email delivery in this environment.",
  });
}
