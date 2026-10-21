import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle2, Clock, Droplets, ShieldCheck } from "lucide-react";
import { PageBanner } from "@/components/site/PageBanner";
import { DonorRegistrationForm } from "@/components/forms/DonorRegistrationForm";

export const metadata: Metadata = {
  title: "Register as a blood donor",
  description:
    "Join the Amos Blood donor network in Kenya. Share your blood type, county and contact details, then receive alerts when hospitals near you need your type.",
};

const assurances = [
  {
    icon: Clock,
    title: "Three minutes",
    copy: "Twelve fields, three short steps. You can finish on a phone with a slow connection.",
  },
  {
    icon: ShieldCheck,
    title: "Your data stays yours",
    copy: "Hospitals see your donor ID, blood type and county. Never your date of birth or address.",
  },
  {
    icon: Droplets,
    title: "No pressure",
    copy: "An alert is an invitation, not a summons. Respond only when you are healthy and available.",
  },
];

export default function RegisterDonorPage() {
  return (
    <>
      <PageBanner
        title="Register as a donor"
        description="One profile, one blood type, a lifetime of second chances"
        current="Register as donor"
        image="/images/nurse-portrait.jpg"
      />

      <section className="section_padding">
        <div className="container-t grid gap-8 lg:grid-cols-[1.35fr_0.65fr]">
          <DonorRegistrationForm />

          <aside className="grid gap-5">
            <div className="flat_card">
              <h2 className="text-[22px]">What happens next</h2>
              <ul className="mt-4 grid gap-3">
                {[
                  "You receive a donor ID and a personal QR code.",
                  "A confirmation email carries your ID and next eligible date.",
                  "When a hospital near you needs your type, we alert you.",
                  "You respond with an arrival time, then donate at the blood bank.",
                ].map((line) => (
                  <li key={line} className="flex items-start gap-2.5">
                    <CheckCircle2 size={16} className="mt-1 flex-none text-[#c8102e]" aria-hidden="true" />
                    <span className="font-body text-[13.5px] leading-relaxed text-[#5f5254]">{line}</span>
                  </li>
                ))}
              </ul>
            </div>

            {assurances.map((item) => {
              const Icon = item.icon;
              return (
                <div className="soft_card" key={item.title}>
                  <div className="flex items-center gap-2">
                    <Icon size={17} className="text-[#9a0c22]" aria-hidden="true" />
                    <h3 className="text-[18px]">{item.title}</h3>
                  </div>
                  <p className="mt-2 font-body text-[13px] leading-relaxed text-[#5f5254]">{item.copy}</p>
                </div>
              );
            })}

            <div className="flat_card">
              <h2 className="text-[18px]">Already registered?</h2>
              <p className="mt-2 font-body text-[13px] leading-relaxed text-[#6d5f62]">
                Sign in to view your donor card, update your alert preferences or record a new donation.
              </p>
              <Link href="/auth/signin?role=donor" className="read_more mt-4 text-[14px]">
                Go to donor sign in
              </Link>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}
