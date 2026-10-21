import type { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";
import { PageBanner } from "@/components/site/PageBanner";
import { SignInForm } from "@/components/forms/SignInForm";

export const metadata: Metadata = {
  title: "Sign in",
  description: "Sign in to your Amos Blood donor or hospital account.",
  robots: { index: false, follow: false },
};

export default async function SignInPage({
  searchParams,
}: {
  searchParams: Promise<{ role?: string }>;
}) {
  const params = await searchParams;
  const initialRole = params.role === "hospital" ? "hospital" : "donor";
  const googleEnabled = Boolean(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET);

  return (
    <>
      <PageBanner
        title="Welcome back"
        description="Sign in to your donor or hospital account"
        current="Sign in"
      />

      <section className="section_padding">
        <div className="container-t grid gap-8 lg:grid-cols-[1fr_1fr]">
          <div className="mx-auto w-full max-w-md">
            <Suspense fallback={<div className="flat_card h-[420px] animate-pulse bg-[#f7f7f7]" />}>
              <SignInForm initialRole={initialRole} googleEnabled={googleEnabled} />
            </Suspense>

            <p className="mt-5 text-center font-body text-[13px] text-[#6b6a6a]">
              New here?{" "}
              <Link href="/auth/signup" className="text_link">
                Create an account
              </Link>
            </p>
          </div>

          <aside className="grid content-start gap-5">
            <div className="flat_card">
              <h2 className="text-[22px]">Demo accounts</h2>
              <p className="mt-2 font-body text-[13px] leading-relaxed text-[#5c5c5c]">
                This build ships with seeded demo records so the dashboards and profile pages can be
                reviewed without a database.
              </p>
              <dl className="mt-4 grid gap-3">
                <div className="rounded-[7px] bg-[#f7f7f7] px-4 py-3">
                  <dt className="font-body text-[11.5px] uppercase tracking-[0.1em] text-[#8a8a8a]">
                    Donor
                  </dt>
                  <dd className="mt-1 font-body text-[13.5px] font-semibold text-[#191d34]">
                    donor@demo.amosblood.co.ke
                  </dd>
                  <dd className="font-body text-[12.5px] text-[#6b6a6a]">AB-D-1001, O negative, Nairobi</dd>
                </div>
                <div className="rounded-[7px] bg-[#f7f7f7] px-4 py-3">
                  <dt className="font-body text-[11.5px] uppercase tracking-[0.1em] text-[#8a8a8a]">
                    Hospital
                  </dt>
                  <dd className="mt-1 font-body text-[13.5px] font-semibold text-[#191d34]">
                    hospital@demo.amosblood.co.ke
                  </dd>
                  <dd className="font-body text-[12.5px] text-[#6b6a6a]">AB-H-2001</dd>
                </div>
              </dl>
              <p className="mt-4 font-body text-[12px] leading-relaxed text-[#8a8a8a]">
                Demo sign in accepts any password and creates a donor or hospital record for an unknown
                email. Replace this provider before handling real patient data.
              </p>
            </div>

            <div className="soft_card">
              <h2 className="text-[18px]">Prefer WhatsApp?</h2>
              <p className="mt-2 font-body text-[13px] leading-relaxed text-[#5c5c5c]">
                You do not need an account to ask about eligibility or to respond to a live request. Message
                a coordinator and we will walk you through it.
              </p>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}
