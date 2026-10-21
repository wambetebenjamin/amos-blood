import type { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";
import { PageBanner } from "@/components/site/PageBanner";
import { SignUpForm } from "@/components/forms/SignUpForm";

export const metadata: Metadata = {
  title: "Create an account",
  description: "Create an Amos Blood donor or hospital account in under two minutes.",
  robots: { index: false, follow: false },
};

export default async function SignUpPage({
  searchParams,
}: {
  searchParams: Promise<{ role?: string }>;
}) {
  const params = await searchParams;
  const initialRole = params.role === "hospital" ? "hospital" : "donor";

  return (
    <>
      <PageBanner
        title="Create your account"
        description="Donor or hospital, one short form"
        current="Sign up"
      />

      <section className="section_padding">
        <div className="container-t grid gap-8 lg:grid-cols-[1fr_1fr]">
          <div className="mx-auto w-full max-w-md">
            <Suspense fallback={<div className="flat_card h-[460px] animate-pulse bg-[#f7f7f7]" />}>
              <SignUpForm initialRole={initialRole} />
            </Suspense>

            <p className="mt-5 text-center font-body text-[13px] text-[#6b6a6a]">
              Already have an account?{" "}
              <Link href="/auth/signin" className="text_link">
                Sign in
              </Link>
            </p>
          </div>

          <aside className="grid content-start gap-5">
            <div className="flat_card">
              <h2 className="text-[22px]">What we store</h2>
              <ul className="mt-4 grid gap-3">
                {[
                  "Your name, email and phone number, so a hospital can reach you.",
                  "Your blood type and county, used for matching only.",
                  "Your notification choice for email or WhatsApp alerts.",
                  "Your donation history, confirmed by the hospital that received the unit.",
                ].map((line) => (
                  <li key={line} className="flex items-start gap-2.5">
                    <span className="mt-2 h-1.5 w-1.5 flex-none rounded-full bg-[#3cc78f]" aria-hidden="true" />
                    <span className="font-body text-[13px] leading-relaxed text-[#5c5c5c]">{line}</span>
                  </li>
                ))}
              </ul>
              <Link href="/legal/privacy-policy" className="read_more mt-4 text-[14px]">
                Read the privacy policy
              </Link>
            </div>

            <div className="soft_card">
              <h2 className="text-[18px]">Hospitals and blood banks</h2>
              <p className="mt-2 font-body text-[13px] leading-relaxed text-[#5c5c5c]">
                A hospital account fills your facility details into every request. We verify the phone number
                on the account before the first request goes live.
              </p>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}
