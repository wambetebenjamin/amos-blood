import type { Metadata } from "next";
import { LegalDocument, type LegalSection } from "@/components/site/LegalDocument";

export const metadata: Metadata = {
  title: "Terms of use",
  description:
    "The terms that govern use of the Amos Blood donor matching platform for donors, hospitals and visitors in Kenya.",
};

const sections: LegalSection[] = [
  {
    heading: "Accepting these terms",
    paragraphs: [
      "By creating an account, posting a request or using this website, you agree to these terms. If you do not agree, do not use the service.",
      "Where you act for a hospital or blood bank, you confirm that you are authorised to post requests on its behalf and that the facility is licensed to collect and transfuse blood in Kenya.",
    ],
  },
  {
    heading: "What Amos Blood is",
    paragraphs: [
      "Amos Blood is an introduction and coordination platform. We do not collect blood, we do not run a blood bank, we do not diagnose or treat anyone, and we are not a party to any donation that takes place between a donor and a hospital.",
      "We do not guarantee that a request will be matched, or that a donor who responds will pass the screening done at the blood bank. Clinical screening at the facility always governs whether a donation proceeds.",
    ],
  },
  {
    heading: "Donor responsibilities",
    paragraphs: [
      "You agree to give accurate information about your blood type, county, contact details and health screening answers, and to update them when they change.",
      "You agree to respond to a request only if you genuinely intend to donate, to arrive within the window you state, and to tell the hospital promptly if you cannot make it.",
      "You agree not to register under another person's identity, create duplicate profiles to game alerts, or use the platform to contact donors for any purpose other than a live request.",
    ],
  },
  {
    heading: "Hospital responsibilities",
    paragraphs: [
      "You agree to post only real requests that relate to a named patient need at your facility, to keep the blood type, units and urgency accurate, and to close a request once the units are secured.",
      "You agree to use donor contact details only to coordinate the donation you posted about, to keep those details confidential, and to delete them when the request closes.",
      "You agree not to post requests for commercial resale of blood, to charge donors, or to pressure a donor into donating outside the national screening rules.",
    ],
  },
  {
    heading: "Prohibited use",
    bullets: [
      "Submitting false, misleading or duplicate requests.",
      "Harvesting donor data or scraping the request board.",
      "Attempting to bypass rate limits, CAPTCHA or authentication.",
      "Uploading malicious code or interfering with the availability of the site.",
      "Using the service to discriminate against any donor on the basis of ethnicity, religion, disability, sex or sexual orientation.",
    ],
  },
  {
    heading: "Medical disclaimer",
    paragraphs: [
      "Content on this site, including the eligibility and blood type pages, is general education. It is not medical advice and it does not replace the assessment of a qualified clinician or the screening nurse at a blood bank.",
      "In an emergency, contact the nearest hospital or the national emergency line. Do not rely on this platform alone for urgent care.",
    ],
  },
  {
    heading: "No payment for blood",
    paragraphs: [
      "Blood donation in Kenya is voluntary and unpaid. Amos Blood does not process payments for blood, does not reward donors with cash, and does not charge patients or hospitals for a match. Any message that asks you to pay or to accept payment for blood should be reported to us immediately.",
    ],
  },
  {
    heading: "Account suspension",
    paragraphs: [
      "We may suspend or remove an account that breaches these terms, that we believe presents a risk to donors or patients, or that a regulator asks us to remove. Where it is practical and safe, we will tell you why.",
    ],
  },
  {
    heading: "Availability and changes",
    paragraphs: [
      "We aim to keep the platform available, but we do not promise uninterrupted service. We may change features, pause the service for maintenance, or withdraw a page at any time.",
      "We may update these terms. The date at the top of the page shows the current version, and material changes are announced by email or on the homepage.",
    ],
  },
  {
    heading: "Liability",
    paragraphs: [
      "To the extent the law allows, Amos Blood is not liable for indirect or consequential loss, for a donation that does not proceed, or for the acts of a donor or hospital using the platform. Nothing in these terms limits liability for fraud, wilful misconduct, or any liability that cannot be excluded under Kenyan law.",
    ],
  },
  {
    heading: "Governing law",
    paragraphs: [
      "These terms are governed by the laws of Kenya. The courts of Kenya have exclusive jurisdiction over any dispute arising from them, and we ask that you contact us first so we can try to resolve the issue.",
    ],
  },
];

export default function TermsPage() {
  return (
    <LegalDocument
      title="Terms of use"
      description="The rules that keep matching honest and safe"
      current="Terms of use"
      updated="12 June 2026"
      intro="These terms set out the deal between you and Amos Blood. They are deliberately plain: donors give real, accurate information and turn up when they say they will; hospitals post real needs and protect the contact details they receive; everyone treats the platform as a route to a blood bank, not as a substitute for one."
      sections={sections}
    />
  );
}
