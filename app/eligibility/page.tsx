import type { Metadata } from "next";
import Link from "next/link";
import { Activity, CalendarClock, HeartPulse, Scale, ShieldCheck, XCircle } from "lucide-react";
import { PageBanner } from "@/components/site/PageBanner";
import { FaqAccordion } from "@/components/site/FaqAccordion";
import { eligibilityQuickFacts } from "@/lib/site";

export const metadata: Metadata = {
  title: "Blood donation eligibility in Kenya",
  description:
    "Check whether you can donate blood today: age, weight, the 90 day rest period, travel and health conditions. Guidance for donors in Kenya.",
};

const disqualifiers = [
  "A fever, flu or infection in the last 7 days.",
  "Pregnancy, or giving birth within the last 6 months.",
  "A tattoo or piercing in the last 6 months.",
  "Major surgery in the last 6 months.",
  "Active treatment for cancer, malaria or a blood borne infection.",
  "Alcohol within 24 hours of donating, or less than 5 hours of sleep.",
];

const faqs = [
  {
    question: "Does donating blood weaken me?",
    answer:
      "A single whole blood donation takes about 450 millilitres, roughly 8 percent of your blood volume. Your body replaces the fluid within 24 hours and the red cells within a few weeks. Most donors return to normal activity the same day, provided they eat and drink normally.",
  },
  {
    question: "How often can I donate in Kenya?",
    answer:
      "Whole blood donors can give every 90 days, which is about four times a year. Platelet donors can give more often, but only through a hospital apheresis unit. Amos Blood uses the 90 day rule and automatically hides your profile from alerts until you are eligible again.",
  },
  {
    question: "Can I donate if I take medication?",
    answer:
      "Many common medicines are fine, including those for high blood pressure and allergies. Tell the screening nurse what you take. Antibiotics for an active infection, blood thinners and some treatments for autoimmune conditions usually mean waiting.",
  },
  {
    question: "I have sickle cell trait. Can I donate?",
    answer:
      "In most Kenyan blood banks, having sickle cell trait does not stop you from donating whole blood. You will be screened on the day. If you have sickle cell disease rather than the trait, you cannot donate.",
  },
  {
    question: "What should I do before and after donating?",
    answer:
      "Eat a normal meal within three hours of donating and drink water before you arrive. Avoid alcohol for 24 hours. Afterwards, keep the dressing on for four hours, drink extra fluids and skip heavy lifting or intense sport for the rest of the day.",
  },
  {
    question: "Can a hospital pay me for blood?",
    answer:
      "No. Blood in Kenya is donated voluntarily and without payment, and Amos Blood does not process payments of any kind. Donors give freely and hospitals pay nothing for the units they receive.",
  },
];

export default function EligibilityPage() {
  return (
    <>
      <PageBanner
        title="Am I eligible to donate?"
        description="A clear answer in under a minute"
        current="Eligibility"
        image="/images/clinician-with-file.jpg"
      />

      <section className="section_padding">
        <div className="container-t">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {eligibilityQuickFacts.map((fact, index) => {
              const icons = [CalendarClock, Scale, HeartPulse, Activity];
              const Icon = icons[index % icons.length];
              return (
                <div className="flat_card hover_lift" key={fact.title}>
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#fdf1f2] text-[#9a0c22]">
                    <Icon size={18} aria-hidden="true" />
                  </span>
                  <h2 className="mt-3 text-[19px]">{fact.title}</h2>
                  <p className="mt-2 font-body text-[13px] leading-relaxed text-[#5f5254]">{fact.body}</p>
                </div>
              );
            })}
          </div>

          <div className="mt-10 grid gap-6 lg:grid-cols-2">
            <div className="flat_card">
              <div className="flex items-center gap-2">
                <ShieldCheck size={19} className="text-[#c8102e]" aria-hidden="true" />
                <h2 className="text-[24px]">You can usually donate if</h2>
              </div>
              <ul className="mt-4 grid gap-3">
                {[
                  "You are between 16 and 65 years old and weigh at least 50 kilograms.",
                  "Your last whole blood donation was 90 or more days ago.",
                  "You feel well today, with no fever, cough or infection.",
                  "Your haemoglobin is at least 12.5 g/dL on the day. The nurse checks this free of charge.",
                  "You are not pregnant and have not given birth in the last 6 months.",
                ].map((line) => (
                  <li key={line} className="flex items-start gap-2.5">
                    <span className="mt-2 h-1.5 w-1.5 flex-none rounded-full bg-[#c8102e]" aria-hidden="true" />
                    <span className="font-body text-[13.5px] leading-relaxed text-[#5f5254]">{line}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="flat_card">
              <div className="flex items-center gap-2">
                <XCircle size={19} className="text-[#d92d20]" aria-hidden="true" />
                <h2 className="text-[24px]">Please wait if</h2>
              </div>
              <ul className="mt-4 grid gap-3">
                {disqualifiers.map((line) => (
                  <li key={line} className="flex items-start gap-2.5">
                    <span className="mt-2 h-1.5 w-1.5 flex-none rounded-full bg-[#d92d20]" aria-hidden="true" />
                    <span className="font-body text-[13.5px] leading-relaxed text-[#5f5254]">{line}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-4 font-body text-[12.5px] leading-relaxed text-[#7f7174]">
                This list is guidance, not a medical decision. The screening nurse at the blood bank makes
                the final call on the day.
              </p>
            </div>
          </div>

          <div className="mt-10 grid gap-6 lg:grid-cols-[0.85fr_1.15fr]">
            <div>
              <span className="eyebrow">Questions donors ask</span>
              <h2 className="mt-3 text-[34px]">Before you roll up a sleeve</h2>
              <p className="mt-3 max-w-md font-body text-[14px] leading-relaxed text-[#6d5f62]">
                Still unsure? Message a coordinator on WhatsApp with your question. We answer in English and
                Kiswahili, and we will never pressure you to donate.
              </p>
              <div className="mt-5 flex flex-wrap gap-3">
                <Link href="/register-donor" className="boxed-btn4">
                  Register as a donor
                </Link>
                <Link href="/blood-types" className="boxed-btn">
                  See blood types
                </Link>
              </div>
            </div>
            <FaqAccordion items={faqs} />
          </div>
        </div>
      </section>
    </>
  );
}
