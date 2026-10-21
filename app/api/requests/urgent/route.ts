import { NextResponse } from "next/server";
import { urgentRequests } from "@/lib/repository";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const requests = await urgentRequests(3);
  return NextResponse.json(
    { ok: true, count: requests.length, requests },
    { headers: { "Cache-Control": "no-store" } },
  );
}
