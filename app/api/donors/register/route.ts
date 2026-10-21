import { NextResponse } from "next/server";
import QRCode from "qrcode";
import { registerDonor } from "@/lib/repository";
import { sendDonorConfirmation } from "@/lib/mailer";
import { clientIp, verifyRecaptcha } from "@/lib/recaptcha";
import { donorSchema } from "@/lib/validation";
import { nextEligibleDate } from "@/lib/types";
import { clientKey, rateLimit } from "@/lib/rate-limit";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const limit = rateLimit(clientKey(request.headers, "donor-register"), 8, 60_000);
  if (!limit.allowed) {
    return NextResponse.json(
      { ok: false, message: "Too many attempts. Please wait a minute and try again." },
      { status: 429 },
    );
  }

  const body = await request.json().catch(() => null);
  const parsed = donorSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      {
        ok: false,
        message: "Please check the highlighted fields.",
        issues: parsed.error.flatten().fieldErrors,
      },
      { status: 422 },
    );
  }

  const captcha = await verifyRecaptcha(
    parsed.data.recaptchaToken,
    "donor_register",
    clientIp(request.headers),
  );

  if (!captcha.success) {
    return NextResponse.json(
      {
        ok: false,
        message: captcha.fallbackRequired
          ? "Complete the quick human check and submit again."
          : "Verification failed. Refresh the page and try again.",
        fallbackRequired: captcha.fallbackRequired,
      },
      { status: 400 },
    );
  }

  const donor = await registerDonor({
    fullName: parsed.data.fullName,
    dateOfBirth: parsed.data.dateOfBirth,
    gender: parsed.data.gender,
    bloodType: parsed.data.bloodType,
    county: parsed.data.county,
    subCounty: parsed.data.subCounty,
    phone: parsed.data.phone,
    email: parsed.data.email,
    lastDonationDate: parsed.data.lastDonationDate,
    healthConfirmed: parsed.data.healthConfirmed,
    notifications: { email: true, whatsapp: true },
  });

  const qrCode = await QRCode.toDataURL(
    JSON.stringify({
      v: 1,
      id: donor.id,
      bloodType: donor.bloodType,
      county: donor.county,
    }),
    {
      margin: 1,
      width: 360,
      color: { dark: "#8f0b1f", light: "#ffffff" },
      errorCorrectionLevel: "M",
    },
  );

  await sendDonorConfirmation({
    to: donor.email,
    donorName: donor.fullName,
    donorId: donor.id,
    bloodType: donor.bloodType,
    county: donor.county,
  });

  return NextResponse.json(
    {
      ok: true,
      donorId: donor.id,
      bloodType: donor.bloodType,
      county: donor.county,
      nextEligibleDate: nextEligibleDate(donor.lastDonationDate),
      qrCode,
      message:
        "Your donor profile is ready. Keep your donor ID safe and watch for alerts from hospitals near you.",
    },
    { status: 201 },
  );
}
