import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Providers } from "@/components/site/Providers";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { Preloader } from "@/components/site/Preloader";
import { SmoothScroll } from "@/components/site/SmoothScroll";
import { CookieConsent } from "@/components/site/CookieConsent";
import { WhatsAppButton } from "@/components/site/WhatsAppButton";
import { VoiceTour } from "@/components/site/VoiceTour";
import { Analytics } from "@/components/site/Analytics";
import { site } from "@/lib/site";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://amos-blood.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${site.name} | ${site.tagline}`,
    template: `%s | ${site.name}`,
  },
  description: site.description,
  applicationName: site.name,
  keywords: [
    "blood donation Kenya",
    "blood donors Nairobi",
    "urgent blood requests",
    "blood bank Kenya",
    "Amos Blood",
  ],
  openGraph: {
    title: `${site.name} | ${site.tagline}`,
    description: site.description,
    url: siteUrl,
    siteName: site.name,
    locale: "en_KE",
    type: "website",
    images: [{ url: "/images/hero-community-health.jpg", width: 1500, height: 1000, alt: "Community health workers supporting patients in Kenya" }],
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.name} | ${site.tagline}`,
    description: site.description,
    images: ["/images/hero-community-health.jpg"],
  },
  icons: {
    icon: [{ url: "/favicon.svg", type: "image/svg+xml" }],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#C8102E",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-KE">
      <body>
        <Providers>
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[10050] focus:rounded focus:bg-white focus:px-4 focus:py-2 focus:font-body focus:text-sm focus:text-[#2a1215] focus:shadow-lg"
          >
            Skip to main content
          </a>
          <SmoothScroll />
          <Preloader />
          <Header />
          <main id="main-content">{children}</main>
          <Footer />
          <WhatsAppButton />
          <VoiceTour />
          <CookieConsent />
          <Analytics />
        </Providers>
      </body>
    </html>
  );
}
