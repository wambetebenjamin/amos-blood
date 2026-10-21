import { NextResponse } from "next/server";
import { findRequest, isRequestLive, toPublicRequest } from "@/lib/repository";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(_request: Request, context: { params: Promise<{ ref: string }> }) {
  const { ref } = await context.params;
  const request = await findRequest(ref);

  if (!request) {
    return NextResponse.json({ ok: false, message: "Request not found" }, { status: 404 });
  }

  const { responses, ...base } = request;

  return NextResponse.json({
    ok: true,
    live: isRequestLive(request),
    request: {
      ...toPublicRequest(base),
      responseCount: responses.length,
    },
  });
}
