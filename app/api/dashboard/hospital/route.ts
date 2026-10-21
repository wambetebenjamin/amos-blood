import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { hospitalDashboard } from "@/lib/repository";
import { readDb } from "@/lib/storage";
import { demoHospital } from "@/lib/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ ok: false, message: "Sign in required" }, { status: 401 });
  }
  if (session.user.role !== "hospital") {
    return NextResponse.json({ ok: false, message: "Hospital role required" }, { status: 403 });
  }

  const db = await readDb();
  const hospital =
    (session.user.hospitalId ? db.hospitals[session.user.hospitalId] : null) ?? demoHospital;

  const dashboard = await hospitalDashboard(hospital.name);

  return NextResponse.json({
    ok: true,
    hospital,
    ...dashboard,
  });
}
