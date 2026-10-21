const VERIFY_ENDPOINT = "https://www.google.com/recaptcha/api/siteverify";
const MIN_SCORE = 0.5;

export type RecaptchaResult = {
  success: boolean;
  score: number | null;
  action?: string;
  skipped: boolean;
  fallbackRequired: boolean;
  reason?: string;
};

const isConfigured = Boolean(process.env.RECAPTCHA_SECRET_KEY);

export async function verifyRecaptcha(
  token: string | undefined,
  expectedAction?: string,
  remoteIp?: string,
): Promise<RecaptchaResult> {
  if (!isConfigured) {
    return {
      success: true,
      score: null,
      skipped: true,
      fallbackRequired: false,
      reason: "recaptcha-not-configured",
    };
  }

  if (!token) {
    return {
      success: false,
      score: null,
      skipped: false,
      fallbackRequired: true,
      reason: "missing-token",
    };
  }

  const body = new URLSearchParams({
    secret: process.env.RECAPTCHA_SECRET_KEY as string,
    response: token,
  });
  if (remoteIp) {
    body.set("remoteip", remoteIp);
  }

  try {
    const response = await fetch(VERIFY_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body,
      cache: "no-store",
    });

    const result = (await response.json()) as {
      success: boolean;
      score?: number;
      action?: string;
      "error-codes"?: string[];
    };

    if (!result.success) {
      return {
        success: false,
        score: result.score ?? null,
        action: result.action,
        skipped: false,
        fallbackRequired: true,
        reason: (result["error-codes"] ?? []).join(","),
      };
    }

    const score = typeof result.score === "number" ? result.score : null;
    const actionMatches = !expectedAction || result.action === expectedAction;
    const scoreOk = score === null ? true : score >= MIN_SCORE;

    return {
      success: actionMatches && scoreOk,
      score,
      action: result.action,
      skipped: false,
      fallbackRequired: !scoreOk,
      reason: !actionMatches
        ? "action-mismatch"
        : scoreOk
          ? undefined
          : "low-score",
    };
  } catch (error) {
    console.error("[recaptcha] verification request failed", error);
    return {
      success: false,
      score: null,
      skipped: false,
      fallbackRequired: false,
      reason: "verification-unavailable",
    };
  }
}

export function clientIp(headers: Headers) {
  return (
    headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    headers.get("x-real-ip") ||
    undefined
  );
}
