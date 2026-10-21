import type { Metadata } from "next";
import Link from "next/link";
import QRCode from "qrcode";
import { PageBanner } from "@/components/site/PageBanner";
import { DonorProfileView } from "@/components/donor/DonorProfileView";
import { requireRole } from "@/lib/guard";
import { findDonor } from "@/lib/repository";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Your donor profile",
  description: "Your Amos Blood donor ID, blood type, donation history, QR code and alert settings.",
  robots: { index: false, follow: false },
};

export default async function DonorProfilePage() {
  const session = await requireRole("donor", "/donor-profile");
  const donor = session.user.donorId ? await findDonor(session.user.donorId) : null;

  if (!donor) {
    return (
      <>
        <PageBanner
          title="Your donor profile"
          description="Complete a donor registration to unlock your profile"
          current="Donor profile"
        />
        <section className="section_padding">
          <div className="container-t max-w-2xl">
            <div className="flat_card text-center">
              <h1 className="text-[30px]">No donor profile found</h1>
              <p className="mt-3 font-body text-[14.5px] leading-relaxed text-[#6d5f62]">
                Your session is active, but there is no donor record attached to it yet. Complete the
                donor form and we will link the profile to your email.
              </p>
              <div className="mt-6 flex flex-wrap justify-center gap-3">
                <Link href="/register-donor" className="boxed-btn4">
                  Complete donor registration
                </Link>
                <Link href="/auth/signin?role=donor" className="boxed-btn">
                  Sign in with another email
                </Link>
              </div>
            </div>
          </div>
        </section>
      </>
    );
  }

  const qrCode = await QRCode.toDataURL(
    JSON.stringify({ v: 1, id: donor.id, bloodType: donor.bloodType, county: donor.county }),
    { margin: 1, width: 360, color: { dark: "#8f0b1f", light: "#ffffff" }, errorCorrectionLevel: "M" },
  );

  return (
    <>
      <PageBanner
        title="Your donor profile"
        description="Your ID, your card, your next donation"
        current="Donor profile"
      />
      <section className="section_padding">
        <div className="container-t">
          <DonorProfileView donor={donor} qrCode={qrCode} />
        </div>
      </section>
    </>
  );
}
