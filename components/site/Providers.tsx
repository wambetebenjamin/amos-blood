"use client";

import type { ReactNode } from "react";
import { SessionProvider } from "next-auth/react";
import { RecaptchaScript } from "@/components/forms/Recaptcha";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <SessionProvider>
      <RecaptchaScript />
      {children}
    </SessionProvider>
  );
}
