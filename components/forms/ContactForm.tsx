"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { Loader2 } from "lucide-react";
import { RecaptchaNotice, RecaptchaV2Fallback, executeRecaptcha } from "@/components/forms/Recaptcha";
import { contactSchema } from "@/lib/validation";

type FormValues = { name: string; email: string; message: string };

export function ContactForm() {
  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [fallbackToken, setFallbackToken] = useState<string | null>(null);
  const [needsFallback, setNeedsFallback] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>();

  const onSubmit = handleSubmit(async (values) => {
    setError(null);
    setStatus(null);
    const parsed = contactSchema.safeParse({
      ...values,
      recaptchaToken: fallbackToken ?? (await executeRecaptcha("contact")),
    });
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "Check the form.");
      return;
    }

    const response = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(parsed.data),
    });
    const data = (await response.json().catch(() => ({}))) as {
      ok?: boolean;
      message?: string;
      fallbackRequired?: boolean;
    };

    if (data.fallbackRequired) {
      setNeedsFallback(true);
      setError("Complete the quick check and send again.");
      return;
    }
    if (!response.ok || !data.ok) {
      setError(data.message || "Your message was not sent. Try again.");
      return;
    }

    setStatus(data.message || "Message received.");
    reset();
  });

  return (
    <form onSubmit={onSubmit} className="flat_card grid gap-4" noValidate>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="field">
          <label htmlFor="contact-name">Your name</label>
          <input id="contact-name" className="input_base" {...register("name", { required: "Enter your name" })} />
          {errors.name ? <p className="field_error">{errors.name.message}</p> : null}
        </div>
        <div className="field">
          <label htmlFor="contact-email">Email</label>
          <input
            id="contact-email"
            type="email"
            className="input_base"
            {...register("email", { required: "Enter your email" })}
          />
          {errors.email ? <p className="field_error">{errors.email.message}</p> : null}
        </div>
      </div>
      <div className="field">
        <label htmlFor="contact-message">How can we help?</label>
        <textarea
          id="contact-message"
          className="textarea_base"
          placeholder="Ask about donor eligibility, a request, or a partnership."
          {...register("message", { required: "Write a short message", minLength: { value: 10, message: "Use at least 10 characters" } })}
        />
        {errors.message ? <p className="field_error">{errors.message.message}</p> : null}
      </div>

      {needsFallback ? <RecaptchaV2Fallback onToken={setFallbackToken} /> : null}
      {error ? <div className="format_error">{error}</div> : null}
      {status ? (
        <div className="form_note" role="status">
          {status}
        </div>
      ) : null}

      <div className="flex flex-wrap items-center gap-3">
        <button type="submit" className="boxed-btn4" disabled={isSubmitting}>
          {isSubmitting ? <Loader2 size={16} className="animate-spin" aria-hidden="true" /> : null}
          {isSubmitting ? "Sending" : "Send message"}
        </button>
        <RecaptchaNotice />
      </div>
    </form>
  );
}
