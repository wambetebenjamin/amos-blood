# Amos Blood

**Your blood. Someone's second chance.**

Amos Blood is a blood donation and medical supply matching platform for Kenya. Donors register their blood type once, hospitals post live requests, and the board stays current for 72 hours at a time.

Built on the uploaded `charifit-master.zip` layout: same fonts, buttons and section rhythm, restyled with a blood donation palette (crimson `#C8102E`, maroon ink, rose surfaces) in a Next.js App Router application.

## Stack

Next.js 16.4.2 (App Router, Turbopack), React 19.2.0, TypeScript 5.8.3, Tailwind CSS 4.1.10, NextAuth 5 beta (JWT sessions), Zod, react-hook-form, framer-motion, GSAP, Lenis, Recharts, qrcode, jsPDF, Nodemailer.

## Run locally

```bash
nvm use            # .nvmrc pins Node 24
npm ci
cp .env.example .env.local
npm run dev
```

`npm run dev` serves http://localhost:3000. Production check:

```bash
npm run typecheck
npm run build
npm start
```

## Environment

All 18 variables are documented in `.env.example`. The app starts without any of them, but these matter:

| Variable | Effect when missing |
| --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Canonical URLs fall back to `https://amos-blood.vercel.app` |
| `NEXTAUTH_SECRET` | Sessions cannot be signed in production builds |
| `NEXT_PUBLIC_RECAPTCHA_SITE_KEY` / `RECAPTCHA_SECRET_KEY` | Forms skip the human check |
| `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` | Google sign in is hidden |
| `KV_REST_API_URL` / `KV_REST_API_TOKEN` | Storage falls back to an in-process store |
| `SMTP_*` | Email is logged to the server console instead of sent |

The reCAPTCHA secret key is read only on the server (`lib/recaptcha.ts`). It is never sent to the browser.

## Routes

Pages: `/`, `/register-donor`, `/donor-profile`, `/urgent-requests`, `/post-request`, `/hospital/dashboard`, `/donor/dashboard`, `/eligibility`, `/blood-types`, `/auth/signin`, `/auth/signup`, `/legal/privacy-policy`, `/legal/terms`, `/legal/cookie-policy`, plus `404` and `500` boundaries.

API: `/api/donors/register`, `/api/donors/[id]`, `/api/requests`, `/api/requests/urgent`, `/api/requests/create`, `/api/requests/[ref]`, `/api/requests/respond`, `/api/dashboard/hospital`, `/api/dashboard/donor`, `/api/contact`, `/api/recaptcha/verify`, with `/api/auth/*` from NextAuth and `/api/auth/signup` for account creation.

## Demo accounts

Seeded so the signed in pages can be reviewed without a database:

| Role | Email | Notes |
| --- | --- | --- |
| Donor | `donor@demo.amosblood.co.ke` | `AB-D-1001`, O negative, Nairobi |
| Hospital | `hospital@demo.amosblood.co.ke` | `AB-H-2001`, Nairobi |

Any password of 6 or more characters is accepted, and an unknown email creates a demo donor or hospital record. This is a review convenience, not production authentication: replace the Credentials provider with verified accounts before handling real patient data.

## Storage and background services

`lib/storage.ts` uses Vercel KV when `KV_REST_API_URL` and `KV_REST_API_TOKEN` are present, and an in-process map otherwise. The fallback resets on redeploy and is not shared between serverless instances, so KV is required in production.

`lib/rate-limit.ts` keeps token buckets in module memory. It protects a single instance; put a shared limiter in front of the API for a multi-instance deployment.

## Images

The nine photographs in `public/images/` are Pexels Free license images of East African subjects. Filenames, photographer credits, source links and license are recorded in `public/images/image-credits.md`. No AI generated imagery is used.

## Security notes

- Public request reads pass through `toPublicRequest()`: hospital email addresses are removed and contact phone numbers are masked. Donor responses are never exposed on the public board.
- Hospital requests are bound to the signed in facility, so an account cannot post under another hospital's name.
- Donor responses are checked against blood type compatibility and duplicate responses are rejected.
- `vercel.json` sets `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, HSTS, a referrer policy and a restrictive permissions policy.

## Dependency notes

The requested pins were followed except where a published advisory covered the pinned version. These four were raised to the smallest patched release, and the audit is clean at `--audit-level=high`:

| Package | Requested | Shipped | Reason |
| --- | --- | --- | --- |
| `next-auth` | 5.0.0-beta.28 | 5.0.0-beta.32 | Auth.js advisories in `@auth/core` |
| `nodemailer` | 6.10.1 | 10.1.7 | SMTP injection and address parser advisories |
| `jspdf` | 3.0.1 | 4.2.1 | PDF injection and file access advisories |
| `@vercel/blob` | 0.29.4 (not published) | 2.8.2 | `ETARGET`, then a `busboy`/`undici` advisory |

`@tailwindcss/postcss` is pinned to 4.1.10 to match Tailwind. `motion-dom` and `motion-utils` are pinned via `overrides` because the newest 12.x releases removed an export that framer-motion 12.18.0 still imports.

## Content rules

No em dashes anywhere in rendered copy. No dark theme. No gold or metallic gradients. No decorative diamonds or sparkles. Fonts are self hosted from `public/fonts/` and are never replaced with system or Google hosted fonts.

## Template reference

`public/template/` is an unmodified copy of the uploaded `charifit-master.zip` theme, kept for design sign-off. Nothing in the app links to it, and it can be removed once the build is approved. `charifit-master.zip` at the repo root is the original upload.
