"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Loader2 } from "lucide-react";
import { Modal } from "@/components/site/Modal";
import { bloodTypes } from "@/lib/blood";
import type { BloodRequest } from "@/lib/types";
import { useSession } from "next-auth/react";
import { useRecaptcha, RecaptchaV2Fallback, RecaptchaNotice } from "@/components/forms/Recaptcha";
import { responseSchema } from "@/lib/validation";

type FormValues = {
  donorName: string;
  bloodType: (typeof bloodTypes)[number];
  estimatedArrival: string;
};

type RespondModalProps = {
  request: BloodRequest | null;
  open: boolean;
  onClose: () => void;
  onSuccess?: (message: string) => void;
};

export function RespondModal({ request, open, onClose, onSuccess }: RespondModalProps) {
  const { data: session } = useSession();
  const recaptcha = useRecaptcha("respond");

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    defaultValues: { donorName: "", bloodType: "O+", estimatedArrival: "" },
  });

  useEffect(() => {
    if (request) {
      setValue("bloodType", request.bloodType);
    }
  }, [request, setValue]);

  useEffect(() => {
    if (session?.user?.name) {
      setValue("donorName", session.user.name);
    }
  }, [session, setValue]);

  const onSubmit = handleSubmit(async (values) => {
    if (!request) {
      return;
    }
    const parsed = responseSchema.safeParse({
      requestRef: request.ref,
      donorName: values.donorName,
      bloodType: values.bloodType,
      estimatedArrival: values.estimatedArrival,
      recaptchaToken: recaptcha.token,
    });
    if (!parsed.success) {
      const first = parsed.error.issues[0]?.message;
      onSuccess?.(first ? `Check the form: ${first}` : "Check the form and try again.");
      return;
    }

    const token = recaptcha.token ?? (await recaptcha.execute());

    const response = await fetch("/api/requests/respond", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...parsed.data, recaptchaToken: token }),
    });

    const payload = (await response.json().catch(() => ({}))) as {
      ok?: boolean;
      message?: string;
      fallbackRequired?: boolean;
    };

    if (payload.fallbackRequired) {
      recaptcha.requestFallback();
      return;
    }

    if (!response.ok || !payload.ok) {
      onSuccess?.(payload.message || "We could not send your response. Please try again.");
      return;
    }

    reset();
    onSuccess?.(
      payload.message ||
        "Thank you. The hospital has your details and will call you if they need more information.",
    );
    onClose();
  });

  if (!request) {
    return null;
  }

  const signedIn = Boolean(session?.user);

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Respond to this request"
      description={`${request.hospital}, ${request.county}`}
    >
      <div className="mb-4 flex flex-wrap items-center gap-3 rounded-[7px] bg-[#fff4f5] p-4">
        <span className="blood_badge">{request.bloodType}</span>
        <span className="font-body text-[13.5px] text-[#7e4a52]">
          {request.units} unit{request.units === 1 ? "" : "s"} needed. Reference {request.ref}.
        </span>
      </div>

      {!signedIn ? (
        <div className="format_error mb-4">
          Sign in as a donor so the hospital knows your response is verified.{" "}
          <Link
            className="text_link"
            href={`/auth/signin?role=donor&callbackUrl=${encodeURIComponent("/urgent-requests")}`}
          >
            Sign in as a donor
          </Link>
          .
        </div>
      ) : null}

      <form onSubmit={onSubmit} className="grid gap-3" noValidate>
        <div className="field">
          <label htmlFor="respond-name">Your name</label>
          <input
            id="respond-name"
            className="input_base"
            placeholder="Full name as registered"
            {...register("donorName", { required: true, minLength: 3 })}
          />
          {errors.donorName ? <p className="field_error">Enter the name on your donor profile.</p> : null}
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <div className="field">
            <label htmlFor="respond-type">Your blood type</label>
            <select id="respond-type" className="select_base" {...register("bloodType")}>
              {bloodTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>
          <div className="field">
            <label htmlFor="respond-eta">Estimated arrival</label>
            <input
              id="respond-eta"
              className="input_base"
              placeholder="For example, in 45 minutes"
              {...register("estimatedArrival", { required: true, minLength: 2 })}
            />
            {errors.estimatedArrival ? (
              <p className="field_error">Tell the hospital when to expect you.</p>
            ) : null}
          </div>
        </div>

        {recaptcha.needsFallback ? (
          <RecaptchaV2Fallback onToken={(token) => recaptcha.setToken(token)} />
        ) : null}

        <button type="submit" className="boxed-btn4 mt-2 w-full" disabled={isSubmitting}>
          {isSubmitting ? <Loader2 size={16} className="animate-spin" aria-hidden="true" /> : null}
          {isSubmitting ? "Sending response" : "Send my response"}
        </button>

        <RecaptchaNotice />
      </form>
    </Modal>
  );
}
