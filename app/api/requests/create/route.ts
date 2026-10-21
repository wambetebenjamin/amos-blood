import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { createRequest, findHospitalByEmail } from "@/lib/repository";
import { sendRequestReceipt } from "@/lib/mailer";
import { clientIp, verifyRecaptcha } from "@/lib/recaptcha";
import { requestSchema } from "@/lib/validation";
import { clientKey, rateLimit } from "@/lib/rate-limit";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ ok: false, message: "Sign in as hospital staff to post a request" }, { status: 401 });
  }
  if (session.user.role !== "hospital") {
    return NextResponse.json({ ok: false, message: "Hospital role required" }, { status: 403 });
  }

  const limit = rateLimit(clientKey(request.headers, "request-create"), 6, 60_000);
  if (!limit.allowed) {
    return NextResponse.json(
      { ok: false, message: "Too many requests posted. Please wait a minute." },
      { status: 429 },
    );
  }

  const body = await request.json().catch(() => null);
  const parsed = requestSchema.safeParse(body);

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
    "post_request",
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

  // Bind the request to the signed in facility so a hospital account cannot
  // post under another hospital's name or contact number.
  const facility = await findHospitalByEmail(session.user.email ?? "");

  const created = await createRequest({
    hospital: facility?.name ?? parsed.data.hospital,
    contactPerson: facility?.contactPerson ?? parsed.data.contactPerson,
    contactPhone: facility?.phone ?? parsed.data.contactPhone,
    hospitalEmail: facility?.email ?? session.user.email ?? undefined,
    bloodType: parsed.data.bloodType,
    units: parsed.data.units,
    urgency: parsed.data.urgency,
    patientCondition: parsed.data.patientCondition,
    county: facility?.county ?? parsed.data.county,
  });

  await sendRequestReceipt({
    to: session.user.email ?? undefined,
    hospital: created.hospital,
    requestRef: created.ref,
    bloodType: created.bloodType,
    units: created.units,
    urgency: created.urgency,
  });

  return NextResponse.json(
    {
      ok: true,
      reference: created.ref,
      expiresAt: created.expiresAt,
      message: `Request ${created.ref} is live for 72 hours.`,
    },
    { status: 201 },
  );
}
