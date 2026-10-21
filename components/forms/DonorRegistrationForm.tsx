"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { ArrowLeft, ArrowRight, Check, Loader2, ShieldCheck } from "lucide-react";
import { bloodTypes } from "@/lib/blood";
import { counties } from "@/lib/site";
import { RecaptchaNotice, RecaptchaV2Fallback, executeRecaptcha } from "@/components/forms/Recaptcha";
import { donorSchema } from "@/lib/validation";

type FormValues = {
  fullName: string;
  dateOfBirth: string;
  gender: "Female" | "Male" | "Other";
  bloodType: (typeof bloodTypes)[number];
  county: string;
  subCounty: string;
  phone: string;
  email: string;
  lastDonationDate?: string;
};

type Result = {
  donorId: string;
  bloodType: string;
  qrCode: string;
  nextEligibleDate: string | null;
};

const declarations = [
  "I am between 16 and 65 years old and I weigh at least 50 kilograms.",
  "I am healthy today, with no fever, infection or open wound.",
  "I have not donated whole blood in the last 90 days.",
  "I consent to Amos Blood storing my details to match me with hospitals, under the Kenya Data Protection Act, 2019.",
];

export function DonorRegistrationForm() {
  const [step, setStep] = useState(1);
  const [checks, setChecks] = useState<boolean[]>([false, false, false, false]);
  const [healthError, setHealthError] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<Result | null>(null);
  const [fallbackToken, setFallbackToken] = useState<string | null>(null);
  const [needsFallback, setNeedsFallback] = useState(false);

  const {
    register,
    handleSubmit,
    trigger,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    defaultValues: {
      gender: "Female",
      bloodType: "O+",
      county: "Nairobi",
    },
  });

  const watched = watch();
  const allChecked = checks.every(Boolean);

  const nextStep = async () => {
    setError(null);
    const fields =
      step === 1
        ? (["fullName", "dateOfBirth", "gender"] as const)
        : (["bloodType", "county", "subCounty", "phone", "email", "lastDonationDate"] as const);
    const ok = await trigger([...fields]);
    if (ok) {
      setStep((current) => Math.min(3, current + 1));
    }
  };

  const onSubmit = handleSubmit(async (values) => {
    setError(null);
    setHealthError(null);

    if (!allChecked) {
      setHealthError("Please confirm all four declarations before submitting.");
      return;
    }

    const payload = {
      ...values,
      healthConfirmed: true as const,
      recaptchaToken: fallbackToken ?? (await executeRecaptcha("donor_register")),
    };

    const parsed = donorSchema.safeParse(payload);
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "Check the form and try again.");
      return;
    }

    const response = await fetch("/api/donors/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(parsed.data),
    });

    const data = (await response.json().catch(() => ({}))) as {
      ok?: boolean;
      message?: string;
      donorId?: string;
      bloodType?: string;
      qrCode?: string;
      nextEligibleDate?: string | null;
      fallbackRequired?: boolean;
    };

    if (data.fallbackRequired) {
      setNeedsFallback(true);
      setError("Please complete the quick check below, then submit again.");
      return;
    }

    if (!response.ok || !data.ok || !data.donorId) {
      setError(data.message || "Registration did not go through. Please try again.");
      return;
    }

    setResult({
      donorId: data.donorId,
      bloodType: data.bloodType ?? values.bloodType,
      qrCode: data.qrCode ?? "",
      nextEligibleDate: data.nextEligibleDate ?? null,
    });
  });

  if (result) {
    return (
      <div className="flat_card">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <span className="eyebrow">Registration complete</span>
            <h2 className="mt-2 text-[30px]">Welcome to Amos Blood</h2>
            <p className="mt-2 max-w-xl font-body text-[14.5px] leading-relaxed text-[#6d5f59]">
              Your donor profile is active. Save your donor ID, and a hospital can scan the code on your
              card when you arrive to donate.
            </p>
          </div>
          <span className="badge_base badge_standard">
            <ShieldCheck size={13} aria-hidden="true" />
            Verified profile
          </span>
        </div>

        <div className="mt-7 grid gap-6 md:grid-cols-[1.1fr_0.9fr] md:items-center">
          <div className="grid gap-3">
            <div className="flex items-center justify-between rounded-[7px] bg-[#fdf8f5] px-4 py-3">
              <span className="font-body text-[13px] text-[#7c6f68]">Donor ID</span>
              <span className="font-body text-[16px] font-bold text-[#32221d]">{result.donorId}</span>
            </div>
            <div className="flex items-center justify-between rounded-[7px] bg-[#fdf8f5] px-4 py-3">
              <span className="font-body text-[13px] text-[#7c6f68]">Blood type</span>
              <span className="blood_badge">{result.bloodType}</span>
            </div>
            <div className="flex items-center justify-between rounded-[7px] bg-[#fdf8f5] px-4 py-3">
              <span className="font-body text-[13px] text-[#7c6f68]">Next eligible donation</span>
              <span className="font-body text-[14px] font-semibold text-[#32221d]">
                {result.nextEligibleDate
                  ? new Date(result.nextEligibleDate).toLocaleDateString("en-KE", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })
                  : "You can donate now"}
              </span>
            </div>
            <p className="form_note">
              A confirmation email has been sent with your donor ID. If SMTP is not configured in this
              environment, the message is written to the server log instead.
            </p>
          </div>

          <div className="mx-auto w-full max-w-[280px] rounded-[9px] border border-[#f7e3dc] bg-white p-4 text-center shadow-[0_3px_6px_rgba(0,0,0,0.08)]">
            {result.qrCode ? (
              <Image
                src={result.qrCode}
                alt={`QR code for donor ${result.donorId}`}
                width={240}
                height={240}
                unoptimized
                className="mx-auto h-auto w-full"
              />
            ) : null}
            <p className="mt-3 font-display text-[18px] text-[#32221d]">Amos Blood donor</p>
            <p className="font-body text-[12.5px] text-[#7c6f68]">{result.donorId}</p>
          </div>
        </div>

        <div className="mt-7 flex flex-wrap gap-3">
          <Link
            href={`/auth/signin?role=donor&callbackUrl=${encodeURIComponent("/donor-profile")}`}
            className="boxed-btn4"
          >
            Sign in to your donor dashboard
          </Link>
          <Link href="/urgent-requests" className="boxed-btn">
            See urgent requests
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flat_card">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          {[1, 2, 3].map((number) => (
            <div className="flex items-center gap-3" key={number}>
              <span
                className={`flex h-9 w-9 items-center justify-center rounded-full font-body text-[13px] font-bold ${
                  step > number
                    ? "bg-[#ad4a3a] text-white"
                    : step === number
                      ? "bg-[#f7e3dc] text-[#8a3a2c]"
                      : "bg-[#f7ece6] text-[#8a7f77]"
                }`}
              >
                {step > number ? <Check size={15} aria-hidden="true" /> : number}
              </span>
              {number < 3 ? <span className="h-px w-5 bg-[#e9dfe0]" aria-hidden="true" /> : null}
            </div>
          ))}
        </div>
        <span className="font-body text-[12.5px] font-semibold uppercase tracking-[0.12em] text-[#7d716a]">
          Step {step} of 3
        </span>
      </div>

      <form onSubmit={onSubmit} noValidate>
        <div className="grid gap-4">
            {step === 1 ? (
              <>
                <h2 className="text-[24px]">Tell us who you are</h2>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="field sm:col-span-2">
                    <label htmlFor="fullName">Full name</label>
                    <input
                      id="fullName"
                      className="input_base"
                      autoComplete="name"
                      placeholder="As it appears on your national ID"
                      {...register("fullName", { required: "Enter your full name", minLength: { value: 3, message: "Enter your full name" } })}
                    />
                    {errors.fullName ? <p className="field_error">{errors.fullName.message}</p> : null}
                  </div>
                  <div className="field">
                    <label htmlFor="dateOfBirth">Date of birth</label>
                    <input
                      id="dateOfBirth"
                      type="date"
                      className="input_base"
                      max={new Date().toISOString().slice(0, 10)}
                      {...register("dateOfBirth", { required: "Select your date of birth" })}
                    />
                    {errors.dateOfBirth ? <p className="field_error">{errors.dateOfBirth.message}</p> : null}
                    <p className="font-body text-[11.5px] text-[#7d716a]">
                      You must be between 16 and 65 years old.
                    </p>
                  </div>
                  <div className="field">
                    <label htmlFor="gender">Gender</label>
                    <select id="gender" className="select_base" {...register("gender")}>
                      <option value="Female">Female</option>
                      <option value="Male">Male</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>
              </>
            ) : null}

            {step === 2 ? (
              <>
                <h2 className="text-[24px]">Your blood type and location</h2>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="field">
                    <label htmlFor="bloodType">Blood type</label>
                    <select id="bloodType" className="select_base" {...register("bloodType")}>
                      {bloodTypes.map((type) => (
                        <option key={type} value={type}>
                          {type}
                        </option>
                      ))}
                    </select>
                    <p className="font-body text-[11.5px] text-[#7d716a]">
                      Not sure? A hospital can confirm with a quick test when you donate.
                    </p>
                  </div>
                  <div className="field">
                    <label htmlFor="county">County</label>
                    <select id="county" className="select_base" {...register("county")}>
                      {counties.map((county) => (
                        <option key={county} value={county}>
                          {county}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="field">
                    <label htmlFor="subCounty">Sub county</label>
                    <input
                      id="subCounty"
                      className="input_base"
                      placeholder="For example, Kasarani"
                      {...register("subCounty", { required: "Enter your sub county" })}
                    />
                    {errors.subCounty ? <p className="field_error">{errors.subCounty.message}</p> : null}
                  </div>
                  <div className="field">
                    <label htmlFor="phone">Phone number</label>
                    <input
                      id="phone"
                      className="input_base"
                      inputMode="tel"
                      placeholder="0712345678"
                      autoComplete="tel"
                      {...register("phone", { required: "Enter your phone number" })}
                    />
                    {errors.phone ? <p className="field_error">{errors.phone.message}</p> : null}
                  </div>
                  <div className="field">
                    <label htmlFor="email">Email</label>
                    <input
                      id="email"
                      type="email"
                      className="input_base"
                      placeholder="you@example.com"
                      autoComplete="email"
                      {...register("email", { required: "Enter your email" })}
                    />
                    {errors.email ? <p className="field_error">{errors.email.message}</p> : null}
                  </div>
                  <div className="field">
                    <label htmlFor="lastDonationDate">Last donation date (optional)</label>
                    <input
                      id="lastDonationDate"
                      type="date"
                      className="input_base"
                      max={new Date().toISOString().slice(0, 10)}
                      {...register("lastDonationDate")}
                    />
                    {errors.lastDonationDate ? (
                      <p className="field_error">{errors.lastDonationDate.message}</p>
                    ) : null}
                    <p className="font-body text-[11.5px] text-[#7d716a]">
                      We use this to calculate your next eligible donation date.
                    </p>
                  </div>
                </div>
              </>
            ) : null}

            {step === 3 ? (
              <>
                <h2 className="text-[24px]">Health declaration</h2>
                <p className="font-body text-[13.5px] leading-relaxed text-[#6d5f59]">
                  Please read each statement and confirm. If any statement is not true today, wait until
                  it is, or call us on WhatsApp and a coordinator will advise you.
                </p>
                <div className="rounded-[7px] bg-[#fdf8f5] px-4">
                  {declarations.map((declaration, index) => (
                    <label className="check_row" key={declaration}>
                      <input
                        type="checkbox"
                        checked={checks[index]}
                        onChange={(event) =>
                          setChecks((current) =>
                            current.map((value, position) =>
                              position === index ? event.target.checked : value,
                            ),
                          )
                        }
                      />
                      <span>{declaration}</span>
                    </label>
                  ))}
                </div>
                {healthError ? <p className="field_error">{healthError}</p> : null}

                <div className="rounded-[7px] border border-[#f1e5df] p-4">
                  <p className="font-body text-[13px] font-semibold text-[#32221d]">Summary</p>
                  <ul className="mt-2 grid gap-1.5 font-body text-[13px] text-[#6d5f59] sm:grid-cols-2">
                    <li>Name: {watched.fullName || "Not set"}</li>
                    <li>Blood type: {watched.bloodType}</li>
                    <li>County: {watched.county}</li>
                    <li>Phone: {watched.phone || "Not set"}</li>
                  </ul>
                </div>

                {needsFallback ? (
                  <RecaptchaV2Fallback
                    onToken={(token) => {
                      setFallbackToken(token);
                      setError(null);
                    }}
                  />
                ) : null}
              </>
            ) : null}
        </div>

        {error ? <div className="format_error mt-4">{error}</div> : null}

        <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
          <button
            type="button"
            className="boxed-btn"
            onClick={() => setStep((current) => Math.max(1, current - 1))}
            disabled={step === 1}
          >
            <ArrowLeft size={16} aria-hidden="true" />
            Back
          </button>

          {step < 3 ? (
            <button type="button" className="boxed-btn4" onClick={nextStep}>
              Continue
              <ArrowRight size={16} aria-hidden="true" />
            </button>
          ) : (
            <button type="submit" className="boxed-btn4" disabled={isSubmitting}>
              {isSubmitting ? <Loader2 size={16} className="animate-spin" aria-hidden="true" /> : null}
              {isSubmitting ? "Creating your profile" : "Complete registration"}
            </button>
          )}
        </div>

        <div className="mt-4">
          <RecaptchaNotice />
        </div>
      </form>
    </div>
  );
}
