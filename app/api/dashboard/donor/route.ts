import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { donorDashboard } from "@/lib/repository";
import { nextEligibleDate } from "@/lib/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ ok: false, message: "Sign in required" }, { status: 401 });
  }
  if (session.user.role !== "donor") {
    return NextResponse.json({ ok: false, message: "Donor role required" }, { status: 403 });
  }

  const donorId = session.user.donorId;
  if (!donorId) {
    return NextResponse.json({ ok: false, message: "Donor profile not found" }, { status: 404 });
  }

  const dashboard = await donorDashboard(donorId);
  if (!dashboard.donor) {
    return NextResponse.json({ ok: false, message: "Donor profile not found" }, { status: 404 });
  }

  return NextResponse.json({
    ok: true,
    donor: dashboard.donor,
    nextEligibleDate: nextEligibleDate(dashboard.donor.lastDonationDate),
    donationHistory: dashboard.donor.donations,
    opportunities: dashboard.opportunities,
    responses: dashboard.responses,
  });
}
