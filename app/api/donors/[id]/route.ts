import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { findDonor, updateDonor } from "@/lib/repository";

export const runtime = "nodejs";

async function guard(id: string) {
  const session = await auth();
  if (!session?.user) {
    return { error: NextResponse.json({ ok: false, message: "Sign in required" }, { status: 401 }) };
  }
  if (session.user.role !== "donor") {
    return { error: NextResponse.json({ ok: false, message: "Donor role required" }, { status: 403 }) };
  }
  if (session.user.donorId !== id) {
    return { error: NextResponse.json({ ok: false, message: "You can only view your own profile" }, { status: 403 }) };
  }
  return { session };
}

export async function GET(_request: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const result = await guard(id);
  if ("error" in result) {
    return result.error;
  }

  const donor = await findDonor(id);
  if (!donor) {
    return NextResponse.json({ ok: false, message: "Donor not found" }, { status: 404 });
  }

  return NextResponse.json({ ok: true, donor });
}

export async function PATCH(request: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const result = await guard(id);
  if ("error" in result) {
    return result.error;
  }

  const body = (await request.json().catch(() => null)) as
    | {
        notifications?: { email?: boolean; whatsapp?: boolean };
        lastDonationDate?: string;
      }
    | null;

  if (!body) {
    return NextResponse.json({ ok: false, message: "Nothing to update" }, { status: 400 });
  }

  const donor = await updateDonor(id, (record) => {
    if (body.notifications) {
      record.notifications = {
        email: Boolean(body.notifications.email),
        whatsapp: Boolean(body.notifications.whatsapp),
      };
    }
    if (body.lastDonationDate) {
      record.lastDonationDate = body.lastDonationDate;
    }
  });

  if (!donor) {
    return NextResponse.json({ ok: false, message: "Donor not found" }, { status: 404 });
  }

  return NextResponse.json({ ok: true, donor });
}
