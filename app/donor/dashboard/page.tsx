import type { Metadata } from "next";
import Link from "next/link";
import { PageBanner } from "@/components/site/PageBanner";
import { DonorDashboardView } from "@/components/donor/DonorDashboardView";
import { requireRole } from "@/lib/guard";
import { donorDashboard } from "@/lib/repository";
import { nextEligibleDate } from "@/lib/types";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Donor dashboard",
  description: "Your donor ID, live requests in your county and your eligibility countdown.",
  robots: { index: false, follow: false },
};

export default async function DonorDashboardPage() {
  const session = await requireRole("donor", "/donor/dashboard");
  const donorId = session.user.donorId ?? "";
  const dashboard = await donorDashboard(donorId);

  if (!dashboard.donor) {
    return (
      <>
        <PageBanner title="Donor dashboard" description="No donor record yet" current="Donor dashboard" />
        <section className="section_padding">
          <div className="container-t max-w-2xl">
            <div className="flat_card text-center">
              <h1 className="text-[30px]">Finish your donor profile</h1>
              <p className="mt-3 font-body text-[14.5px] leading-relaxed text-[#6d5f59]">
                We could not find a donor record for this session. Register once and the dashboard fills
                itself with your county requests and eligibility date.
              </p>
              <div className="mt-6 flex flex-wrap justify-center gap-3">
                <Link href="/register-donor" className="boxed-btn4">
                  Register as a donor
                </Link>
                <Link href="/auth/signin?role=donor" className="boxed-btn">
                  Sign in again
                </Link>
              </div>
            </div>
          </div>
        </section>
      </>
    );
  }

  const nextEligible = nextEligibleDate(dashboard.donor.lastDonationDate);

  return (
    <>
      <PageBanner
        title="Donor dashboard"
        description={`Welcome back, ${dashboard.donor.fullName.split(" ")[0]}`}
        current="Donor dashboard"
      />

      <section className="section_padding">
        <div className="container-t grid gap-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="font-body text-[13px] text-[#6d5f59]">
              Donor ID <span className="font-semibold text-[#32221d]">{dashboard.donor.id}</span> ·{" "}
              {dashboard.donor.bloodType} · {dashboard.donor.county} County
            </p>
            <div className="flex flex-wrap items-center gap-4">
              <Link href="/donor-profile" className="read_more text-[14px]">
                Open my donor card
              </Link>
              <Link href="/urgent-requests" className="read_more text-[14px]">
                Browse requests
              </Link>
            </div>
          </div>

          <DonorDashboardView
            donor={dashboard.donor}
            opportunities={dashboard.opportunities}
            nextEligible={nextEligible}
          />
        </div>
      </section>
    </>
  );
}
