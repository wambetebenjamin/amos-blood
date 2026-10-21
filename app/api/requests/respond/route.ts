import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { addResponse, findDonor, findRequest, isRequestLive } from "@/lib/repository";
import { canDonateTo } from "@/lib/blood";
import { sendResponseAlert } from "@/lib/mailer";
import { clientIp, verifyRecaptcha } from "@/lib/recaptcha";
import { responseSchema } from "@/lib/validation";
import { clientKey, rateLimit } from "@/lib/rate-limit";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json(
      { ok: false, message: "Sign in as a donor to respond to a request." },
      { status: 401 },
    );
  }
  if (session.user.role !== "donor") {
    return NextResponse.json(
      { ok: false, message: "Only registered donors can respond to requests." },
      { status: 403 },
    );
  }

  const limit = rateLimit(clientKey(request.headers, "request-respond"), 10, 60_000);
  if (!limit.allowed) {
    return NextResponse.json(
      { ok: false, message: "Too many responses sent. Please wait a minute." },
      { status: 429 },
    );
  }

  const body = await request.json().catch(() => null);
  const parsed = responseSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, message: parsed.error.issues[0]?.message ?? "Check the form" },
      { status: 422 },
    );
  }

  const target = await findRequest(parsed.data.requestRef);
  if (!target || !isRequestLive(target)) {
    return NextResponse.json(
      { ok: false, message: "This request has closed. Check the board for other live requests." },
      { status: 410 },
    );
  }

  const donorId = session.user.donorId ?? session.user.id ?? "";
  const donor = donorId ? await findDonor(donorId) : undefined;

  if (!donor) {
    return NextResponse.json(
      { ok: false, message: "Complete your donor registration before responding." },
      { status: 409 },
    );
  }

  if (!canDonateTo(donor.bloodType, target.bloodType)) {
    return NextResponse.json(
      {
        ok: false,
        message: `${donor.bloodType} blood cannot be given to a ${target.bloodType} patient. The hospital needs a compatible type.`,
      },
      { status: 422 },
    );
  }

  const alreadyResponded = target.responses.some((entry) => entry.donorId === donor.id);

  if (alreadyResponded) {
    return NextResponse.json(
      { ok: false, message: "You have already offered to donate for this request. The hospital has your details." },
      { status: 409 },
    );
  }

  const captcha = await verifyRecaptcha(
    parsed.data.recaptchaToken,
    "respond",
    clientIp(request.headers),
  );
  if (!captcha.success) {
    return NextResponse.json(
      {
        ok: false,
        message: captcha.fallbackRequired
          ? "Complete the quick human check and send again."
          : "Verification failed. Refresh and try again.",
        fallbackRequired: captcha.fallbackRequired,
      },
      { status: 400 },
    );
  }

  const response = await addResponse({
    requestRef: parsed.data.requestRef,
    donorId: donor.id,
    donorName: donor.fullName,
    bloodType: donor.bloodType,
    estimatedArrival: parsed.data.estimatedArrival,
  });

  await sendResponseAlert({
    to: target.hospitalEmail,
    hospital: target.hospital,
    requestRef: target.ref,
    donorName: response.donorName,
    bloodType: response.bloodType,
    estimatedArrival: response.estimatedArrival,
  });

  return NextResponse.json({
    ok: true,
    responseId: response.id,
    message: `Thank you. ${target.hospital} has been notified and will call you if needed.`,
  });
}
