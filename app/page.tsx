import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  BellRing,
  CalendarCheck,
  CheckCircle2,
  ClipboardList,
  Droplets,
  HeartPulse,
  Hospital,
  MapPin,
  MessageCircle,
  ShieldCheck,
  Stethoscope,
  UserRoundCheck,
} from "lucide-react";
import { HeroSection } from "@/components/home/HeroSection";
import { SectionTitle } from "@/components/site/SectionTitle";
import { StatCounter } from "@/components/site/StatCounter";
import { LiveRequestsPanel } from "@/components/requests/LiveRequestsPanel";
import { Reveal } from "@/components/site/Reveal";
import { compatibility, bloodTypes } from "@/lib/blood";
import { urgentRequests } from "@/lib/repository";
import {
  eligibilityQuickFacts,
  partnerHospitals,
  site,
  testimonials,
  whatsappHref,
} from "@/lib/site";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Blood donation and urgent blood requests in Kenya",
  description:
    "Register as a blood donor in Kenya, see live urgent blood requests from hospitals, and learn your blood type compatibility. Amos Blood, your blood, someone's second chance.",
};

const donorSteps = [
  {
    icon: UserRoundCheck,
    title: "Register in minutes",
    copy: "Share your name, county and blood type. No fee, no paperwork, no queue.",
  },
  {
    icon: Droplets,
    title: "Verify your blood type",
    copy: "Your donor ID and QR code carry the blood type a hospital needs to confirm.",
  },
  {
    icon: BellRing,
    title: "Get notified near you",
    copy: "We alert you when a hospital or blood bank in your county needs your type.",
  },
  {
    icon: HeartPulse,
    title: "Respond and donate",
    copy: "Tell the hospital when you will arrive, then donate at the blood bank.",
  },
];

const hospitalSteps = [
  {
    icon: ClipboardList,
    title: "Post the request",
    copy: "Enter the blood type, units required and urgency. No patient personal details.",
  },
  {
    icon: MapPin,
    title: "Reach verified donors",
    copy: "Donors in your county who match the type see the request immediately.",
  },
  {
    icon: CheckCircle2,
    title: "Confirm the arrival",
    copy: "Mark the donor as arrived, then close the request when the units are secured.",
  },
];

export default async function HomePage() {
  const requests = await urgentRequests(3);

  return (
    <>
      <HeroSection />

      <section className="section_padding" aria-labelledby="urgent-heading">
        <div className="container-t">
          <div className="mb-10 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <SectionTitle
              align="left"
              eyebrow="Live from the network"
              title={
                <span id="urgent-heading">
                  Requests that need <span>you today</span>
                </span>
              }
              description="The three most recent critical and urgent requests. Every request stays live for 72 hours, then closes automatically."
            />
            <Link href="/urgent-requests" className="read_more shrink-0">
              See all requests
            </Link>
          </div>

          <LiveRequestsPanel requests={requests} />

          <div className="mt-8 flex flex-wrap items-center gap-4 rounded-[7px] border border-[#fbe4e7] bg-[#fff4f5] px-5 py-4">
            <ShieldCheck size={20} className="text-[#9a0c22]" aria-hidden="true" />
            <p className="font-body text-[13.5px] text-[#7e4a52]">
              Every hospital on this board is verified before a request goes live. Patient names and
              personal details are never published.
            </p>
          </div>
        </div>
      </section>

      <section className="section_padding bg-[#fdf7f8]" aria-labelledby="compatibility-heading">
        <div className="container-t">
          <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
            <Reveal>
              <SectionTitle
                align="left"
                eyebrow="Know your type"
                title={
                  <span id="compatibility-heading">
                    Who can <span>give and receive</span>
                  </span>
                }
                description="Whole blood is matched by type. O negative can give to anyone in an emergency, and AB positive can receive from everyone. The full chart explains the rest."
              />
              <ul className="mt-6 grid gap-3">
                <li className="flex items-start gap-3">
                  <Droplets size={18} className="mt-1 flex-none text-[#c8102e]" aria-hidden="true" />
                  <span className="font-body text-[14.5px] leading-relaxed text-[#5f5254]">
                    <strong className="font-semibold text-[#2b1417]">Need it fast?</strong> O negative is
                    the universal donor type used before a patient is typed.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <ShieldCheck size={18} className="mt-1 flex-none text-[#c8102e]" aria-hidden="true" />
                  <span className="font-body text-[14.5px] leading-relaxed text-[#5f5254]">
                    <strong className="font-semibold text-[#2b1417]">Rare types matter.</strong> AB
                    negative is the rarest type in Kenya, and a small pool of donors serves many
                    patients.
                  </span>
                </li>
              </ul>
              <Link href="/blood-types" className="read_more mt-7">
                Read the full blood type guide
              </Link>
            </Reveal>

            <Reveal delay={0.12}>
              <div className="blood_grid">
                {bloodTypes.map((type) => (
                  <div className="blood_cell" key={type}>
                    <strong>{type}</strong>
                    <span>{compatibility[type].note}</span>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="section_padding" aria-labelledby="how-heading">
        <div className="container-t">
          <SectionTitle
            eyebrow="Two clear paths"
            title={
              <span id="how-heading">
                How Amos Blood <span>works</span>
              </span>
            }
            description="One platform, two journeys. Donors find a way to help nearby. Hospitals find the right blood quickly."
          />

          <div className="mt-12 grid gap-6 lg:grid-cols-2">
            <Reveal>
              <article className="surface_card">
                <div className="card_thumb relative h-[230px]">
                  <Image
                    src="/images/nurse-portrait.jpg"
                    alt="A nurse in blue scrubs at a Kenyan health facility"
                    fill
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-cover object-top"
                  />
                </div>
                <div className="card_body">
                  <span className="eyebrow">For donors</span>
                  <h3 className="text-[26px]">Give close to home</h3>
                  <ol className="mt-2 grid gap-4">
                    {donorSteps.map((step, index) => {
                      const Icon = step.icon;
                      return (
                        <li key={step.title} className="flex gap-3">
                          <span className="mt-0.5 flex h-8 w-8 flex-none items-center justify-center rounded-full bg-[#fff4f5] font-body text-[13px] font-bold text-[#9a0c22]">
                            {index + 1}
                          </span>
                          <span>
                            <span className="flex items-center gap-2 font-body text-[15px] font-semibold text-[#2b1417]">
                              <Icon size={16} className="text-[#c8102e]" aria-hidden="true" />
                              {step.title}
                            </span>
                            <span className="mt-1 block font-body text-[13.5px] leading-relaxed text-[#6d5f62]">
                              {step.copy}
                            </span>
                          </span>
                        </li>
                      );
                    })}
                  </ol>
                  <Link href="/register-donor" className="boxed-btn4 mt-2 w-fit">
                    Become a donor
                  </Link>
                </div>
              </article>
            </Reveal>

            <Reveal delay={0.12}>
              <article className="surface_card">
                <div className="card_thumb relative h-[230px]">
                  <Image
                    src="/images/clinician-with-file.jpg"
                    alt="A clinician with a patient folder reviewing a request"
                    fill
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-cover object-top"
                  />
                </div>
                <div className="card_body">
                  <span className="eyebrow">For hospitals and blood banks</span>
                  <h3 className="text-[26px]">Find units in minutes</h3>
                  <ol className="mt-2 grid gap-4">
                    {hospitalSteps.map((step, index) => {
                      const Icon = step.icon;
                      return (
                        <li key={step.title} className="flex gap-3">
                          <span className="mt-0.5 flex h-8 w-8 flex-none items-center justify-center rounded-full bg-[#fff4f5] font-body text-[13px] font-bold text-[#9a0c22]">
                            {index + 1}
                          </span>
                          <span>
                            <span className="flex items-center gap-2 font-body text-[15px] font-semibold text-[#2b1417]">
                              <Icon size={16} className="text-[#c8102e]" aria-hidden="true" />
                              {step.title}
                            </span>
                            <span className="mt-1 block font-body text-[13.5px] leading-relaxed text-[#6d5f62]">
                              {step.copy}
                            </span>
                          </span>
                        </li>
                      );
                    })}
                  </ol>
                  <Link href="/post-request" className="boxed-btn4 mt-2 w-fit">
                    Post a request
                  </Link>
                </div>
              </article>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="pb-[100px] pt-0" aria-labelledby="impact-heading">
        <div className="container-t">
          <div className="mb-8 max-w-2xl">
            <SectionTitle
              align="left"
              eyebrow="Impact so far"
              title={
                <span id="impact-heading">
                  Numbers that <span>keep people alive</span>
                </span>
              }
              description="Every number below is a person who got another morning with their family. Counts are updated as the network grows."
            />
          </div>
          <StatCounter />
        </div>
      </section>

      <section className="section_padding bg-[#fdf7f8]" aria-labelledby="eligibility-heading">
        <div className="container-t">
          <div className="grid gap-10 lg:grid-cols-[0.95fr_1.05fr]">
            <Reveal>
              <SectionTitle
                align="left"
                eyebrow="Before you come"
                title={
                  <span id="eligibility-heading">
                    Simple rules that <span>protect you</span>
                  </span>
                }
                description="Donating blood should never put your own health at risk. These are the basics our nurses check on the day."
              />
              <div className="mt-6 overflow-hidden rounded-[7px]">
                <Image
                  src="/images/rural-clinic.jpg"
                  alt="A healthcare worker checking the blood pressure of a patient at a rural clinic"
                  width={900}
                  height={600}
                  sizes="(max-width: 1024px) 100vw, 46vw"
                  className="h-[260px] w-full object-cover"
                />
              </div>
              <Link href="/eligibility" className="read_more mt-7">
                Read the full eligibility guide
              </Link>
            </Reveal>

            <div className="grid gap-4 sm:grid-cols-2">
              {eligibilityQuickFacts.map((fact, index) => (
                <Reveal key={fact.title} delay={index * 0.06}>
                  <div className="flat_card h-full">
                    <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-[#fff4f5]">
                      {fact.title === "Age range" ? (
                        <CalendarCheck size={18} className="text-[#9a0c22]" aria-hidden="true" />
                      ) : fact.title === "Weight requirement" ? (
                        <HeartPulse size={18} className="text-[#9a0c22]" aria-hidden="true" />
                      ) : fact.title === "Rest period" ? (
                        <Droplets size={18} className="text-[#9a0c22]" aria-hidden="true" />
                      ) : (
                        <Stethoscope size={18} className="text-[#9a0c22]" aria-hidden="true" />
                      )}
                    </div>
                    <h3 className="text-[20px]">{fact.title}</h3>
                    <p className="mt-2 font-body text-[13.5px] leading-relaxed text-[#6d5f62]">{fact.body}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-12" aria-labelledby="partners-heading">
        <div className="container-t">
          <p
            id="partners-heading"
            className="font-body text-[12px] font-bold uppercase tracking-[0.18em] text-[#7f7174]"
          >
            Partner hospitals and blood banks
          </p>
        </div>
        <div className="partner_strip mt-5">
          <div className="container-t">
            <div className="partner_track">
              {partnerHospitals.map((hospital) => (
                <span className="partner_badge" key={hospital}>
                  {hospital}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="section_padding" aria-labelledby="stories-heading">
        <div className="container-t">
          <SectionTitle
            eyebrow="From the network"
            title={
              <span id="stories-heading">
                People who said <span>yes</span>
              </span>
            }
            description="Donors and nurses describe what changed when blood arrived on time."
          />

          <div className="mt-12 grid gap-6 lg:grid-cols-3">
            {testimonials.map((testimonial, index) => (
              <Reveal key={testimonial.name} delay={index * 0.08}>
                <figure className="flat_card flex h-full flex-col gap-4">
                  <Droplets size={24} className="text-[#c8102e]" aria-hidden="true" />
                  <blockquote className="font-body text-[14.5px] leading-relaxed text-[#4c4244]">
                    &ldquo;{testimonial.quote}&rdquo;
                  </blockquote>
                  <figcaption className="mt-auto flex items-center gap-3 border-t border-[#f4eaeb] pt-4">
                    <Image
                      src={testimonial.image}
                      alt={testimonial.name}
                      width={48}
                      height={48}
                      className="h-12 w-12 rounded-full object-cover"
                    />
                    <span>
                      <span className="block font-body text-[14px] font-semibold text-[#2b1417]">
                        {testimonial.name}
                      </span>
                      <span className="block font-body text-[12.5px] text-[#7f7174]">
                        {testimonial.role}
                      </span>
                    </span>
                  </figcaption>
                </figure>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="pb-[100px]">
        <div className="container-t">
          <div className="relative overflow-hidden rounded-[7px] bg-[#c8102e] px-7 py-12 text-white sm:px-12">
            <div className="relative z-10 grid gap-7 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
              <div>
                <span className="eyebrow !text-[#ffe9ec]">One hour of your day</span>
                <h2 className="mt-3 text-[34px] leading-tight text-white sm:text-[40px]">
                  Be someone&apos;s second chance this week
                </h2>
                <p className="mt-3 max-w-2xl font-body text-[15px] leading-relaxed text-[#fff5f5]">
                  A single donation can support up to three patients. Register your type today, or talk
                  to a coordinator on WhatsApp if you have a question about eligibility.
                </p>
              </div>
              <div className="flex flex-wrap gap-3 lg:justify-end">
                <Link href="/register-donor" className="boxed-btn3">
                  Register as donor
                  <ArrowRight size={16} aria-hidden="true" />
                </Link>
                <a
                  href={whatsappHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="boxed-btn5"
                >
                  <MessageCircle size={16} aria-hidden="true" />
                  WhatsApp +{site.whatsappNumber}
                </a>
              </div>
            </div>
            <Hospital
              size={210}
              strokeWidth={0.7}
              className="pointer-events-none absolute -right-10 -top-8 hidden text-white/15 lg:block"
              aria-hidden="true"
            />
          </div>
        </div>
      </section>
    </>
  );
}
