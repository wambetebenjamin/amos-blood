"use client";

import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { CheckCircle2, Loader2 } from "lucide-react";
import { bloodTypes, urgencyLevels, urgencyLabels } from "@/lib/blood";
import { counties, whatsappLink } from "@/lib/site";
import { RecaptchaNotice, RecaptchaV2Fallback, executeRecaptcha } from "@/components/forms/Recaptcha";
import { requestSchema } from "@/lib/validation";

type FormValues = {
  hospital: string;
  contactPerson: string;
  bloodType: (typeof bloodTypes)[number];
  units: number;
  urgency: (typeof urgencyLevels)[number];
  patientCondition: string;
  county: string;
  contactPhone: string;
};

type Success = { reference: string; expiresAt: string };

export function PostRequestForm({
  defaults,
}: {
  defaults: Partial<FormValues>;
}) {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<Success | null>(null);
  const [fallbackToken, setFallbackToken] = useState<string | null>(null);
  const [needsFallback, setNeedsFallback] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    defaultValues: {
      hospital: defaults.hospital ?? "",
      contactPerson: defaults.contactPerson ?? "",
      contactPhone: defaults.contactPhone ?? "",
      county: defaults.county ?? "Nairobi",
      bloodType: "O+",
      urgency: "urgent",
      units: 2,
      patientCondition: "",
    },
  });

  const onSubmit = handleSubmit(async (values) => {
    setError(null);
    const payload = {
      ...values,
      units: Number(values.units),
      recaptchaToken: fallbackToken ?? (await executeRecaptcha("post_request")),
    };
    const parsed = requestSchema.safeParse(payload);
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "Check the form and try again.");
      return;
    }

    const response = await fetch("/api/requests/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(parsed.data),
    });
    const data = (await response.json().catch(() => ({}))) as {
      ok?: boolean;
      message?: string;
      reference?: string;
      expiresAt?: string;
      fallbackRequired?: boolean;
    };

    if (data.fallbackRequired) {
      setNeedsFallback(true);
      setError("Complete the quick check and submit again.");
      return;
    }
    if (!response.ok || !data.ok || !data.reference) {
      setError(data.message || "The request was not published. Try again.");
      return;
    }

    setSuccess({ reference: data.reference, expiresAt: data.expiresAt ?? "" });
    reset();
  });

  if (success) {
    return (
      <div className="flat_card">
        <CheckCircle2 size={42} className="text-[#c8102e]" aria-hidden="true" />
        <h2 className="mt-4 text-[28px]">Your request is live</h2>
        <p className="mt-2 font-body text-[14.5px] leading-relaxed text-[#6d5f62]">
          Keep this reference. Donors in your county can now see the request and respond with an
          estimated arrival time.
        </p>
        <div className="mt-5 rounded-[7px] bg-[#fff4f5] px-5 py-4">
          <p className="font-body text-[12px] uppercase tracking-[0.14em] text-[#7e4a52]">Reference</p>
          <p className="font-body text-[26px] font-bold text-[#2a1215]">{success.reference}</p>
          {success.expiresAt ? (
            <p className="mt-1 font-body text-[12.5px] text-[#6d5f62]">
              Closes automatically on{" "}
              {new Date(success.expiresAt).toLocaleString("en-KE", {
                day: "numeric",
                month: "short",
                hour: "2-digit",
                minute: "2-digit",
              })}
              .
            </p>
          ) : null}
        </div>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link href="/hospital/dashboard" className="boxed-btn4">
            Open hospital dashboard
          </Link>
          <Link href="/urgent-requests" className="boxed-btn">
            View the public board
          </Link>
          <a
            href={whatsappLink(`Hello Amos Blood, I have posted request ${success.reference} and need help reaching donors.`)}
            target="_blank"
            rel="noopener noreferrer"
            className="read_more"
          >
            Ask a coordinator
          </a>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="flat_card grid gap-4 sm:grid-cols-2" noValidate>
      <div className="field sm:col-span-2">
        <label htmlFor="req-hospital">Hospital or blood bank name</label>
        <input
          id="req-hospital"
          className="input_base"
          placeholder="Facility name"
          {...register("hospital", { required: "Enter the facility name" })}
        />
        {errors.hospital ? <p className="field_error">{errors.hospital.message}</p> : null}
      </div>

      <div className="field">
        <label htmlFor="req-contact">Contact person</label>
        <input
          id="req-contact"
          className="input_base"
          placeholder="Nurse or doctor on duty"
          {...register("contactPerson", { required: "Enter the contact person" })}
        />
        {errors.contactPerson ? <p className="field_error">{errors.contactPerson.message}</p> : null}
      </div>

      <div className="field">
        <label htmlFor="req-phone">Contact phone</label>
        <input
          id="req-phone"
          className="input_base"
          inputMode="tel"
          placeholder="0712345678"
          {...register("contactPhone", { required: "Enter a contact phone" })}
        />
        {errors.contactPhone ? <p className="field_error">{errors.contactPhone.message}</p> : null}
      </div>

      <div className="field">
        <label htmlFor="req-blood">Blood type needed</label>
        <select id="req-blood" className="select_base" {...register("bloodType")}>
          {bloodTypes.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
      </div>

      <div className="field">
        <label htmlFor="req-units">Units required</label>
        <input
          id="req-units"
          type="number"
          min={1}
          max={20}
          className="input_base"
          {...register("units", { required: true, min: 1, max: 20, valueAsNumber: true })}
        />
        {errors.units ? <p className="field_error">Enter between 1 and 20 units.</p> : null}
      </div>

      <div className="field">
        <label htmlFor="req-urgency">Urgency level</label>
        <select id="req-urgency" className="select_base" {...register("urgency")}>
          {urgencyLevels.map((level) => (
            <option key={level} value={level}>
              {urgencyLabels[level]}
            </option>
          ))}
        </select>
      </div>

      <div className="field">
        <label htmlFor="req-county">County</label>
        <select id="req-county" className="select_base" {...register("county")}>
          {counties.map((county) => (
            <option key={county} value={county}>
              {county}
            </option>
          ))}
        </select>
      </div>

      <div className="field sm:col-span-2">
        <label htmlFor="req-condition">Patient condition, general terms only</label>
        <textarea
          id="req-condition"
          className="textarea_base"
          placeholder="For example, post partum haemorrhage in the maternity unit"
          {...register("patientCondition", {
            required: "Describe the general condition",
            minLength: { value: 10, message: "Use at least 10 characters" },
          })}
        />
        {errors.patientCondition ? (
          <p className="field_error">{errors.patientCondition.message}</p>
        ) : null}
        <p className="font-body text-[11.5px] leading-relaxed text-[#7f7174]">
          Do not include patient names, ID numbers or file numbers. Requests stay public for 72 hours.
        </p>
      </div>

      {needsFallback ? (
        <div className="sm:col-span-2">
          <RecaptchaV2Fallback
            onToken={(token) => {
              setFallbackToken(token);
              setError(null);
            }}
          />
        </div>
      ) : null}

      {error ? <div className="format_error sm:col-span-2">{error}</div> : null}

      <div className="sm:col-span-2 flex flex-wrap items-center justify-between gap-3">
        <button type="submit" className="boxed-btn4" disabled={isSubmitting}>
          {isSubmitting ? <Loader2 size={16} className="animate-spin" aria-hidden="true" /> : null}
          {isSubmitting ? "Publishing request" : "Publish request"}
        </button>
        <span className="font-body text-[12.5px] text-[#7f7174]">
          Active for 72 hours, then closes automatically.
        </span>
      </div>

      <div className="sm:col-span-2">
        <RecaptchaNotice />
      </div>
    </form>
  );
}
