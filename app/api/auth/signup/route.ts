import { NextResponse } from "next/server";
import { registerDonor, registerHospital, findDonorByEmail, findHospitalByEmail } from "@/lib/repository";
import { signUpSchema } from "@/lib/validation";
import { clientKey, rateLimit } from "@/lib/rate-limit";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const limit = rateLimit(clientKey(request.headers, "signup"), 6, 60_000);
  if (!limit.allowed) {
    return NextResponse.json({ ok: false, message: "Too many attempts. Try again in a minute." }, { status: 429 });
  }

  const body = await request.json().catch(() => null);
  const parsed = signUpSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      {
        ok: false,
        message: parsed.error.issues[0]?.message ?? "Check the form and try again.",
        issues: parsed.error.flatten().fieldErrors,
      },
      { status: 422 },
    );
  }

  const existing =
    (await findDonorByEmail(parsed.data.email)) ?? (await findHospitalByEmail(parsed.data.email));
  if (existing) {
    return NextResponse.json(
      { ok: false, message: "An account with this email already exists. Sign in instead." },
      { status: 409 },
    );
  }

  if (parsed.data.role === "hospital") {
    const hospital = await registerHospital({
      name: parsed.data.hospitalName ?? "Amos Blood partner hospital",
      county: parsed.data.county,
      contactPerson: parsed.data.fullName,
      phone: parsed.data.phone,
      email: parsed.data.email,
    });
    return NextResponse.json(
      {
        ok: true,
        role: "hospital",
        hospitalId: hospital.id,
        message: "Hospital account created. Sign in to post requests.",
      },
      { status: 201 },
    );
  }

  if (!parsed.data.bloodType) {
    return NextResponse.json({ ok: false, message: "Select your blood type." }, { status: 422 });
  }

  const donor = await registerDonor({
    fullName: parsed.data.fullName,
    dateOfBirth: "1995-01-01",
    gender: "Other",
    bloodType: parsed.data.bloodType,
    county: parsed.data.county,
    subCounty: "Not provided",
    phone: parsed.data.phone,
    email: parsed.data.email,
    healthConfirmed: true,
    notifications: { email: true, whatsapp: true },
  });

  return NextResponse.json(
    {
      ok: true,
      role: "donor",
      donorId: donor.id,
      message: "Donor account created. Complete your profile after signing in.",
    },
    { status: 201 },
  );
}
