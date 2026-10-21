import { NextResponse } from "next/server";
import { clientIp, verifyRecaptcha } from "@/lib/recaptcha";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as
    | { token?: string; action?: string }
    | null;

  const result = await verifyRecaptcha(body?.token, body?.action, clientIp(request.headers));

  return NextResponse.json({
    ok: result.success,
    success: result.success,
    score: result.score,
    action: result.action,
    fallbackRequired: result.fallbackRequired,
    skipped: result.skipped,
    message: result.success
      ? "Verification passed"
      : result.fallbackRequired
        ? "Additional human check required"
        : "Verification failed",
  });
}
