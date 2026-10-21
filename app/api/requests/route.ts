import { NextResponse } from "next/server";
import { isBloodType, urgencyLevels, type Urgency } from "@/lib/blood";
import { listRequests } from "@/lib/repository";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const bloodTypeParam = searchParams.get("bloodType");
  const urgencyParam = searchParams.get("urgency");
  const county = searchParams.get("county") ?? undefined;
  const limitParam = Number(searchParams.get("limit") || "50");

  const bloodType = bloodTypeParam && isBloodType(bloodTypeParam) ? bloodTypeParam : undefined;
  const urgency =
    urgencyParam && (urgencyLevels as readonly string[]).includes(urgencyParam)
      ? (urgencyParam as Urgency)
      : undefined;

  const requests = await listRequests({
    bloodType,
    county,
    urgency,
    limit: Number.isFinite(limitParam) ? Math.min(Math.max(limitParam, 1), 100) : 50,
  });

  return NextResponse.json({ ok: true, count: requests.length, requests });
}
