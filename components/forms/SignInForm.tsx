"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useForm } from "react-hook-form";
import { Loader2, ShieldCheck } from "lucide-react";
import { RecaptchaNotice, RecaptchaV2Fallback, executeRecaptcha } from "@/components/forms/Recaptcha";
import { signInSchema } from "@/lib/validation";

type Role = "donor" | "hospital";

type FormValues = {
  email: string;
  password: string;
};

export function SignInForm({
  initialRole = "donor",
  googleEnabled = false,
}: {
  initialRole?: Role;
  googleEnabled?: boolean;
}) {
  const router = useRouter();
  const params = useSearchParams();
  const callbackUrl = params.get("callbackUrl") || "";
  const [role, setRole] = useState<Role>(initialRole);
  const [error, setError] = useState<string | null>(null);
  const [fallbackToken, setFallbackToken] = useState<string | null>(null);
  const [needsFallback, setNeedsFallback] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>();

  const onSubmit = handleSubmit(async (values) => {
    setError(null);
    const parsed = signInSchema.safeParse({
      ...values,
      role,
      recaptchaToken: fallbackToken ?? (await executeRecaptcha("signin")),
    });
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "Check your details.");
      return;
    }

    const result = await signIn("credentials", {
      email: parsed.data.email,
      password: parsed.data.password,
      role: parsed.data.role,
      redirect: false,
    });

    if (result?.error) {
      setError("We could not sign you in. Check your email and try again.");
      return;
    }

    const destination =
      callbackUrl ||
      (role === "hospital" ? "/hospital/dashboard" : "/donor/dashboard");
    router.push(destination);
    router.refresh();
  });

  return (
    <div className="flat_card">
      <div className="mb-5 flex gap-2 rounded-[5px] bg-[#f6efe9] p-1">
        {(["donor", "hospital"] as const).map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => setRole(option)}
            className={`flex-1 rounded-[4px] px-3 py-2.5 font-body text-[13.5px] font-semibold transition ${
              role === option ? "bg-white text-[#8a3a2c] shadow-sm" : "text-[#7c6f68]"
            }`}
            aria-pressed={role === option}
          >
            {option === "donor" ? "I am a donor" : "I represent a hospital"}
          </button>
        ))}
      </div>

      <form onSubmit={onSubmit} className="grid gap-4" noValidate>
        <div className="field">
          <label htmlFor="signin-email">Email address</label>
          <input
            id="signin-email"
            type="email"
            autoComplete="email"
            className="input_base"
            placeholder="you@example.com"
            {...register("email", { required: "Enter your email address" })}
          />
          {errors.email ? <p className="field_error">{errors.email.message}</p> : null}
        </div>

        <div className="field">
          <label htmlFor="signin-password">Password</label>
          <input
            id="signin-password"
            type="password"
            autoComplete="current-password"
            className="input_base"
            placeholder="At least 6 characters"
            {...register("password", { required: "Enter your password", minLength: { value: 6, message: "Use at least 6 characters" } })}
          />
          {errors.password ? <p className="field_error">{errors.password.message}</p> : null}
        </div>

        {needsFallback ? (
          <RecaptchaV2Fallback
            onToken={(token) => {
              setFallbackToken(token);
              setError(null);
            }}
          />
        ) : null}

        {error ? <div className="format_error">{error}</div> : null}

        <button type="submit" className="boxed-btn4 w-full" disabled={isSubmitting}>
          {isSubmitting ? <Loader2 size={16} className="animate-spin" aria-hidden="true" /> : null}
          {isSubmitting ? "Signing in" : "Sign in"}
        </button>

        {googleEnabled ? (
          <>
            <div className="flex items-center gap-3">
              <span className="h-px flex-1 bg-[#f1e6e0]" aria-hidden="true" />
              <span className="font-body text-[12px] uppercase tracking-[0.12em] text-[#7d716a]">or</span>
              <span className="h-px flex-1 bg-[#f1e6e0]" aria-hidden="true" />
            </div>
            <button
              type="button"
              className="boxed-btn w-full"
              onClick={() => void signIn("google", { callbackUrl: callbackUrl || "/donor/dashboard" })}
            >
              Continue with Google
            </button>
          </>
        ) : null}

        <RecaptchaNotice />
      </form>

      <p className="mt-5 font-body text-[13px] leading-relaxed text-[#6d5f59]">
        New here?{" "}
        <Link href="/register-donor" className="text_link">
          Register as a donor
        </Link>{" "}
        or{" "}
        <Link href="/auth/signup?role=hospital" className="text_link">
          create a hospital account
        </Link>
        .
      </p>

      <div className="mt-5 rounded-[7px] border border-[#f7e3dc] bg-[#fdf4f0] p-4">
        <p className="flex items-center gap-2 font-body text-[12.5px] font-semibold text-[#8a3a2c]">
          <ShieldCheck size={14} aria-hidden="true" />
          Preview access
        </p>
        <p className="mt-1 font-body text-[12.5px] leading-relaxed text-[#7d5a50]">
          Any email and a password of 6 or more characters opens the dashboards in this environment.
          Connect Google OAuth or your hospital directory before going live.
        </p>
      </div>
    </div>
  );
}
