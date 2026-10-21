"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useForm } from "react-hook-form";
import { Loader2 } from "lucide-react";
import { bloodTypes } from "@/lib/blood";
import { counties } from "@/lib/site";
import { RecaptchaNotice, RecaptchaV2Fallback, executeRecaptcha } from "@/components/forms/Recaptcha";
import { signUpSchema } from "@/lib/validation";

type Role = "donor" | "hospital";

type FormValues = {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
  phone: string;
  county: string;
  bloodType?: (typeof bloodTypes)[number];
  hospitalName?: string;
};

export function SignUpForm({ initialRole = "donor" }: { initialRole?: Role }) {
  const router = useRouter();
  const [role, setRole] = useState<Role>(initialRole);
  const [error, setError] = useState<string | null>(null);
  const [fallbackToken, setFallbackToken] = useState<string | null>(null);
  const [needsFallback, setNeedsFallback] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    defaultValues: { county: "Nairobi", bloodType: "O+" },
  });

  const onSubmit = handleSubmit(async (values) => {
    setError(null);
    const payload = {
      ...values,
      role,
      recaptchaToken: fallbackToken ?? (await executeRecaptcha("signup")),
    };
    const parsed = signUpSchema.safeParse(payload);
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "Check the form and try again.");
      return;
    }

    const response = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(parsed.data),
    });
    const data = (await response.json().catch(() => ({}))) as { ok?: boolean; message?: string };

    if (!response.ok || !data.ok) {
      setError(data.message || "We could not create the account. Try again.");
      return;
    }

    const signedIn = await signIn("credentials", {
      email: parsed.data.email,
      password: parsed.data.password,
      role: parsed.data.role,
      redirect: false,
    });

    if (signedIn?.error) {
      setError("Account created. Please sign in with your new details.");
      router.push("/auth/signin");
      return;
    }

    router.push(role === "hospital" ? "/hospital/dashboard" : "/donor-profile");
    router.refresh();
  });

  return (
    <div className="flat_card">
      <div className="mb-5 flex gap-2 rounded-[5px] bg-[#f4f6f8] p-1">
        {(["donor", "hospital"] as const).map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => setRole(option)}
            className={`flex-1 rounded-[4px] px-3 py-2.5 font-body text-[13.5px] font-semibold transition ${
              role === option ? "bg-white text-[#1c7a58] shadow-sm" : "text-[#7a7b7c]"
            }`}
            aria-pressed={role === option}
          >
            {option === "donor" ? "I am a donor" : "I represent a hospital"}
          </button>
        ))}
      </div>

      <form onSubmit={onSubmit} className="grid gap-4 sm:grid-cols-2" noValidate>
        <div className="field sm:col-span-2">
          <label htmlFor="signup-name">{role === "donor" ? "Full name" : "Contact person"}</label>
          <input
            id="signup-name"
            className="input_base"
            autoComplete="name"
            placeholder="Full name"
            {...register("fullName", { required: "Enter your name" })}
          />
          {errors.fullName ? <p className="field_error">{errors.fullName.message}</p> : null}
        </div>

        {role === "hospital" ? (
          <div className="field sm:col-span-2">
            <label htmlFor="signup-hospital">Hospital or blood bank name</label>
            <input
              id="signup-hospital"
              className="input_base"
              placeholder="Facility name"
              {...register("hospitalName", { required: role === "hospital" ? "Enter the facility name" : false })}
            />
            {errors.hospitalName ? <p className="field_error">{errors.hospitalName.message}</p> : null}
          </div>
        ) : (
          <div className="field">
            <label htmlFor="signup-blood">Blood type</label>
            <select id="signup-blood" className="select_base" {...register("bloodType")}>
              {bloodTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>
        )}

        <div className="field">
          <label htmlFor="signup-county">County</label>
          <select id="signup-county" className="select_base" {...register("county")}>
            {counties.map((county) => (
              <option key={county} value={county}>
                {county}
              </option>
            ))}
          </select>
        </div>

        <div className="field">
          <label htmlFor="signup-email">Email</label>
          <input
            id="signup-email"
            type="email"
            autoComplete="email"
            className="input_base"
            placeholder="you@example.com"
            {...register("email", { required: "Enter your email" })}
          />
          {errors.email ? <p className="field_error">{errors.email.message}</p> : null}
        </div>

        <div className="field">
          <label htmlFor="signup-phone">Phone number</label>
          <input
            id="signup-phone"
            className="input_base"
            inputMode="tel"
            autoComplete="tel"
            placeholder="0712345678"
            {...register("phone", { required: "Enter your phone number" })}
          />
          {errors.phone ? <p className="field_error">{errors.phone.message}</p> : null}
        </div>

        <div className="field">
          <label htmlFor="signup-password">Password</label>
          <input
            id="signup-password"
            type="password"
            autoComplete="new-password"
            className="input_base"
            placeholder="At least 6 characters"
            {...register("password", { required: "Create a password", minLength: { value: 6, message: "Use at least 6 characters" } })}
          />
          {errors.password ? <p className="field_error">{errors.password.message}</p> : null}
        </div>

        <div className="field">
          <label htmlFor="signup-confirm">Confirm password</label>
          <input
            id="signup-confirm"
            type="password"
            autoComplete="new-password"
            className="input_base"
            placeholder="Repeat your password"
            {...register("confirmPassword", { required: "Confirm your password" })}
          />
          {errors.confirmPassword ? (
            <p className="field_error">{errors.confirmPassword.message}</p>
          ) : null}
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

        {error ? (
          <div className="format_error sm:col-span-2">{error}</div>
        ) : null}

        <div className="sm:col-span-2">
          <button type="submit" className="boxed-btn4 w-full" disabled={isSubmitting}>
            {isSubmitting ? <Loader2 size={16} className="animate-spin" aria-hidden="true" /> : null}
            {isSubmitting ? "Creating your account" : `Create ${role} account`}
          </button>
        </div>

        <div className="sm:col-span-2">
          <RecaptchaNotice />
        </div>
      </form>

      <p className="mt-5 font-body text-[13px] leading-relaxed text-[#6b6a6a]">
        Already registered?{" "}
        <Link href="/auth/signin" className="text_link">
          Sign in
        </Link>
        . Donors can also{" "}
        <Link href="/register-donor" className="text_link">
          complete the full donor form
        </Link>{" "}
        to add health declarations and a QR donor card.
      </p>
    </div>
  );
}
