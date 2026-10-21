import type { Metadata } from "next";
import { LegalDocument, type LegalSection } from "@/components/site/LegalDocument";

export const metadata: Metadata = {
  title: "Cookie policy",
  description:
    "Which cookies and local storage keys Amos Blood uses, what each one does, and how to change your consent choice.",
};

const sections: LegalSection[] = [
  {
    heading: "The short version",
    paragraphs: [
      "We use one consent preference stored in your browser, a small number of security tools that protect forms from abuse, and privacy friendly traffic measurement. We do not run advertising cookies, we do not build a profile of you, and we do not sell anything to a data broker.",
    ],
  },
  {
    heading: "Strictly necessary",
    paragraphs: [
      "These keep the site working and cannot be switched off through our banner. Most of them are not cookies at all but browser storage entries.",
    ],
    bullets: [
      "amos_blood_consent: stores whether you accepted or declined optional cookies. It is kept in localStorage until you clear your browser.",
      "next-auth.session-token: a signed, encrypted session cookie that keeps you signed in. It expires when you sign out or after 30 days.",
      "next-auth.csrf-token: protects sign in forms against cross site request forgery. It expires with the session.",
      "A short lived rate limit key tied to your IP address, held in server memory for 60 seconds, so a form cannot be submitted in a loop.",
    ],
  },
  {
    heading: "Security and anti abuse",
    paragraphs: [
      "Forms are protected by Google reCAPTCHA. When you submit a form, reCAPTCHA may set cookies and collect device and interaction signals to decide whether you are a person. The score is checked on our server; your response is never used for advertising. If the score is low, you may be asked to complete a visible checkbox instead.",
      "Google processes this data under its own privacy terms. You can read more at policies.google.com/privacy.",
    ],
  },
  {
    heading: "Analytics",
    paragraphs: [
      "We use Vercel Analytics and Speed Insights to count visits and measure page performance. They record aggregate data such as page views, referrer, country and a set of anonymous performance timings. They are designed not to use cookies and not to follow you across other websites.",
      "These tools load only if you accept optional cookies in the banner. If you decline, the page still works and nothing optional is loaded.",
    ],
  },
  {
    heading: "Your choice",
    paragraphs: [
      "The banner appears on your first visit. Your choice is stored as a small JSON record under amos_blood_consent. Accepting enables analytics. Decline optional leaves analytics and marketing off, and only the necessary entries stay on. The choice is remembered on that browser until you clear it.",
      "To change your mind, clear the amos_blood_consent entry in your browser storage and reload the page. The banner will ask again.",
    ],
  },
  {
    heading: "Do not track",
    paragraphs: [
      "If your browser sends a Do Not Track signal, we treat it as a decline and load nothing optional. We do not attempt to work around that signal.",
    ],
  },
  {
    heading: "Third parties",
    paragraphs: [
      "Google reCAPTCHA, Vercel hosting and Vercel Analytics appear on this list because they process a limited amount of technical data on our behalf. We do not embed social media pixels, advertising networks or session recording tools anywhere on the site.",
    ],
  },
  {
    heading: "Contact",
    paragraphs: [
      "For a question about cookies or to ask for a copy of the consent record we hold for your browser, email hello@amosblood.co.ke. The privacy policy explains the wider set of rights you have over your personal data.",
    ],
  },
];

export default function CookiePolicyPage() {
  return (
    <LegalDocument
      title="Cookie policy"
      description="The small set of things this site stores, and why"
      current="Cookie policy"
      updated="12 June 2026"
      intro="This page lists every cookie and browser storage key the site can set, what each one is for, and how long it lasts. If a tool is optional, it stays off until you accept it. There are no advertising trackers here."
      sections={sections}
    />
  );
}
