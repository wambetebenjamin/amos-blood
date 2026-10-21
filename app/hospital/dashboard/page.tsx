import type { Metadata } from "next";
import Link from "next/link";
import { PageBanner } from "@/components/site/PageBanner";
import { HospitalDashboardView } from "@/components/hospital/HospitalDashboardView";
import { requireRole } from "@/lib/guard";
import { findHospitalByEmail, hospitalDashboard } from "@/lib/repository";
import { demoHospital } from "@/lib/types";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Hospital dashboard",
  description: "Track live blood requests, donor responses and fulfilled requests for your facility.",
  robots: { index: false, follow: false },
};

export default async function HospitalDashboardPage() {
  const session = await requireRole("hospital", "/hospital/dashboard");
  const email = session.user.email ?? "";
  const hospital = (await findHospitalByEmail(email)) ?? demoHospital;
  const dashboard = await hospitalDashboard(hospital.name);

  return (
    <>
      <PageBanner
        title="Hospital dashboard"
        description="Requests, responses and arrivals in one view"
        current="Hospital dashboard"
      />

      <section className="section_padding">
        <div className="container-t">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
            <p className="font-body text-[13px] text-[#6d5f59]">
              Signed in as <span className="font-semibold text-[#32221d]">{session.user.email}</span>
            </p>
            <Link href="/urgent-requests" className="read_more text-[14px]">
              View the public board
            </Link>
          </div>
          <HospitalDashboardView
            hospital={hospital}
            active={dashboard.active}
            fulfilled={dashboard.fulfilled}
            all={dashboard.all}
            arrivals={dashboard.arrivals}
            stats={dashboard.stats}
          />
        </div>
      </section>
    </>
  );
}
