import type { Metadata } from "next";
import Link from "next/link";
import { AlertTriangle, BadgeCheck, Clock3, FileCheck2 } from "lucide-react";
import { PageBanner } from "@/components/site/PageBanner";
import { PostRequestForm } from "@/components/forms/PostRequestForm";
import { signedInIdentity } from "@/lib/guard";
import { demoHospital } from "@/lib/types";
import { findHospitalByEmail } from "@/lib/repository";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Post an urgent blood request",
  description:
    "Verified hospitals and blood banks in Kenya can post a blood request in under two minutes. Donors nearby are notified with the blood type, county and urgency.",
};

const checks = [
  {
    icon: BadgeCheck,
    title: "Verified facilities only",
    copy: "Requests are tied to a named hospital, contact person and phone number. Donors call a real desk.",
  },
  {
    icon: Clock3,
    title: "72 hour live window",
    copy: "Each request carries a reference and closes automatically, so the board never shows stale needs.",
  },
  {
    icon: FileCheck2,
    title: "Reference for your records",
    copy: "You receive a reference such as AB-26107 to quote at the blood bank or in follow-up calls.",
  },
];

export default async function PostRequestPage() {
  const identity = await signedInIdentity();
  const hospitalAccount = identity?.email ? await findHospitalByEmail(identity.email) : null;

  const defaults = hospitalAccount
    ? {
        hospital: hospitalAccount.name,
        contactPerson: hospitalAccount.contactPerson,
        contactPhone: hospitalAccount.phone,
        county: hospitalAccount.county,
      }
    : {
        hospital: demoHospital.name,
        contactPerson: demoHospital.contactPerson,
        contactPhone: demoHospital.phone,
        county: demoHospital.county,
      };

  return (
    <>
      <PageBanner
        title="Post a blood request"
        description="For hospitals and blood banks with a patient waiting today"
        current="Post request"
        image="/images/medical-team.jpg"
      />

      <section className="section_padding">
        <div className="container-t grid gap-8 lg:grid-cols-[1.35fr_0.65fr]">
          <PostRequestForm defaults={defaults} />

          <aside className="grid gap-5">
            {checks.map((item) => {
              const Icon = item.icon;
              return (
                <div className="flat_card" key={item.title}>
                  <div className="flex items-center gap-2">
                    <Icon size={18} className="text-[#ad4a3a]" aria-hidden="true" />
                    <h2 className="text-[19px]">{item.title}</h2>
                  </div>
                  <p className="mt-2 font-body text-[13px] leading-relaxed text-[#63544e]">{item.copy}</p>
                </div>
              );
            })}

            <div className="soft_card">
              <div className="flex items-center gap-2">
                <AlertTriangle size={17} className="text-[#c0442f]" aria-hidden="true" />
                <h2 className="text-[18px]">Life threatening emergency</h2>
              </div>
              <p className="mt-2 font-body text-[13px] leading-relaxed text-[#63544e]">
                If a patient cannot wait for donor responses, call the nearest blood bank and your county
                referral hospital first. Post the request here in parallel, not instead.
              </p>
            </div>

            <div className="flat_card">
              <h2 className="text-[18px]">Need a facility account?</h2>
              <p className="mt-2 font-body text-[13px] leading-relaxed text-[#6d5f59]">
                Create a hospital sign in to have your name, county and contact person filled in
                automatically on every request.
              </p>
              <Link href="/auth/signup?role=hospital" className="read_more mt-4 text-[14px]">
                Create a hospital account
              </Link>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}
