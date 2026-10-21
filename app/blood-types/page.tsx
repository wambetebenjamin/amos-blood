import type { Metadata } from "next";
import Link from "next/link";
import { PageBanner } from "@/components/site/PageBanner";
import { BloodTypeBadge } from "@/components/site/Badges";
import { bloodTypes, compatibility } from "@/lib/blood";

export const metadata: Metadata = {
  title: "Blood types and compatibility",
  description:
    "Understand the eight blood types, who can give to whom, and which types hospitals in Kenya need most. Includes O negative and AB negative rarity notes.",
};

const rarity: Record<string, string> = {
  "O+": "37% of Kenyans",
  "A+": "24% of Kenyans",
  "B+": "20% of Kenyans",
  "AB+": "6% of Kenyans",
  "O-": "5% of Kenyans",
  "A-": "4% of Kenyans",
  "B-": "3% of Kenyans",
  "AB-": "1% of Kenyans",
};

export default function BloodTypesPage() {
  return (
    <>
      <PageBanner
        title="Blood types, simply explained"
        description="Who can give to whom, and why O negative matters so much"
        current="Blood types"
        image="/images/blood-bags.jpg"
      />

      <section className="section_padding">
        <div className="container-t">
          <div className="mx-auto max-w-3xl text-center">
            <span className="eyebrow">Compatibility guide</span>
            <h2 className="mt-3 text-[36px]">Eight types. One shared system.</h2>
            <p className="mt-3 font-body text-[14.5px] leading-relaxed text-[#6b6a6a]">
              Your blood type is set by two markers on your red cells: the ABO group and the Rh factor. The
              table below shows what you can give and receive. Hospitals still type and cross match every
              unit before transfusion, so this is education, not a clinical instruction.
            </p>
          </div>

          <div className="table_wrap mt-8">
            <table className="data_table">
              <caption className="sr-only">Blood type compatibility and rarity in Kenya</caption>
              <thead>
                <tr>
                  <th scope="col">Type</th>
                  <th scope="col">Can give to</th>
                  <th scope="col">Can receive from</th>
                  <th scope="col">Population</th>
                </tr>
              </thead>
              <tbody>
                {bloodTypes.map((type) => (
                  <tr key={type}>
                    <td>
                      <BloodTypeBadge bloodType={type} size="lg" />
                    </td>
                    <td>{compatibility[type].givesTo.join(", ")}</td>
                    <td>{compatibility[type].receivesFrom.join(", ")}</td>
                    <td className="whitespace-nowrap">{rarity[type]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {bloodTypes.map((type) => (
              <div className="flat_card hover_lift" key={type}>
                <div className="flex items-center justify-between gap-2">
                  <BloodTypeBadge bloodType={type} />
                  <span className="font-body text-[11.5px] uppercase tracking-[0.08em] text-[#9a9a9a]">
                    {rarity[type]}
                  </span>
                </div>
                <p className="mt-3 font-body text-[13px] leading-relaxed text-[#5c5c5c]">
                  {compatibility[type].note}
                </p>
              </div>
            ))}
          </div>

          <div className="impact_band mt-10 grid gap-6 md:grid-cols-2">
            <div>
              <h2 className="text-[28px] text-white">Why O negative is kept for emergencies</h2>
              <p className="mt-3 font-body text-[13.5px] leading-relaxed text-white/85">
                O negative red cells carry neither A nor B markers and no Rh factor, so they are safe for
                almost any patient before a full cross match is ready. That makes O negative the first unit
                a trauma team reaches for, and the type most often short in Kenyan blood banks.
              </p>
            </div>
            <div>
              <h2 className="text-[28px] text-white">Why AB positive is the universal recipient</h2>
              <p className="mt-3 font-body text-[13.5px] leading-relaxed text-white/85">
                AB positive plasma has no antibodies against A or B, so patients with AB positive blood can
                receive red cells from every group. AB negative plasma is the universal plasma donor, which
                is why the rarest type on this page is also one of the most valuable.
              </p>
            </div>
          </div>

          <div className="mt-10 flex flex-wrap items-center justify-between gap-4 rounded-[7px] bg-[#f7f7f7] px-6 py-5">
            <p className="max-w-2xl font-body text-[13.5px] leading-relaxed text-[#5c5c5c]">
              Not sure of your type? Register anyway. We record what you know and the blood bank confirms the
              rest on your first donation.
            </p>
            <Link href="/register-donor" className="boxed-btn4">
              Register your blood type
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
