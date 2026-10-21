import type { Metadata } from "next";
import { LegalDocument, type LegalSection } from "@/components/site/LegalDocument";

export const metadata: Metadata = {
  title: "Privacy policy",
  description:
    "How Amos Blood collects, uses, stores and protects donor and hospital data in Kenya, including your rights under the Data Protection Act 2019.",
};

const sections: LegalSection[] = [
  {
    heading: "Who we are",
    paragraphs: [
      "Amos Blood is a blood donation and medical supply matching service that connects verified donors with hospitals and blood banks in Kenya. In this policy, \"we\" and \"us\" refer to Amos Blood, and \"you\" refers to a donor, a hospital user or a visitor to this website.",
      "We are the data controller for the personal data described here. Our contact address is hello@amosblood.co.ke.",
    ],
  },
  {
    heading: "What we collect",
    paragraphs: [
      "We collect only what a matching service needs to work. If a field is optional, we mark it as optional in the form.",
    ],
    bullets: [
      "Identity and contact data: your name, email address and phone number.",
      "Donor matching data: blood type, county, sub county and your stated date of birth, which we use to confirm the 16 to 65 age range.",
      "Donation data: the date of your last donation, the hospital that received it and the reference number attached to it.",
      "Health declarations: the yes or no answers you give to the four screening questions at registration. We store the answers, not the underlying medical records.",
      "Hospital data: facility name, county, contact person, phone number and work email.",
      "Technical data: the pages you visit, your approximate location from your IP address, and your consent choice. See the cookie policy for details.",
    ],
  },
  {
    heading: "Why we use it",
    paragraphs: [
      "We use personal data to create and verify accounts, match a hospital request with donors who have a compatible blood type and are eligible to donate, send the alerts you have asked for, keep an audit trail of requests and responses, and answer support messages.",
      "We also use aggregated, de-identified figures to understand which counties and blood types face the deepest shortages. Those figures never identify an individual donor.",
    ],
  },
  {
    heading: "What hospitals can see",
    paragraphs: [
      "When you respond to a request, the hospital that posted it sees your donor ID, first name, blood type, county, phone number and the arrival time you provided. The hospital does not see your date of birth, your email address, your sub county or your screening answers.",
      "No hospital can browse the donor database. Donor details are released only after you respond to a specific live request.",
    ],
  },
  {
    heading: "Legal basis",
    paragraphs: [
      "We rely on your consent for donor registration, alert notifications and non-essential cookies, on the performance of a service you have requested for response handling, and on our legitimate interest in keeping the platform safe from abuse.",
      "Where we process health related declarations, we do so on the basis of your explicit consent and only for the purpose of confirming that you can donate safely.",
    ],
  },
  {
    heading: "How long we keep it",
    paragraphs: [
      "Donor profiles stay active until you delete your account or ask us to remove them. If no donation or response is recorded for 36 months, we deactivate the profile and delete the contact details.",
      "Request records and donor responses are kept for 24 months so a hospital can audit its own history, after which they are aggregated and anonymised. Support messages are kept for 12 months.",
    ],
  },
  {
    heading: "Who we share it with",
    paragraphs: [
      "We share data with the hospital or blood bank whose request you answered, with service providers who host the site, deliver email, protect forms from abuse and measure traffic, and with a regulator or court where the law requires it.",
      "We do not sell personal data, we do not share it with advertisers, and we never pay donors for blood or charge patients for a match.",
    ],
  },
  {
    heading: "Your rights",
    paragraphs: [
      "Under the Kenya Data Protection Act 2019 you can ask for a copy of your data, correct it, delete it, restrict how we use it, or withdraw consent at any time. You can also object to processing and ask us to port your data to another service.",
      "Email hello@amosblood.co.ke with the subject line Data request. We respond within 14 days. If you are unhappy with our answer, you can complain to the Office of the Data Protection Commissioner.",
    ],
  },
  {
    heading: "Security",
    paragraphs: [
      "Traffic is encrypted in transit. Access to donor records is limited to the small operations team that handles matching and support, and every access is logged. Form submissions are protected by reCAPTCHA and rate limits.",
      "No system is perfect. If a breach affects your data, we will notify you and the Commissioner without undue delay and tell you what we know, what we have done and what you should do.",
    ],
  },
  {
    heading: "Children",
    paragraphs: [
      "Donors aged 16 and 17 may register with the written consent of a parent or guardian. We do not knowingly collect data from anyone under 16. If you believe a minor has registered without consent, contact us and we will delete the record.",
    ],
  },
  {
    heading: "Changes to this policy",
    paragraphs: [
      "If we change how we handle data, we update this page and change the date at the top. For a material change we also notify registered donors by email before it takes effect.",
    ],
  },
];

export default function PrivacyPolicyPage() {
  return (
    <LegalDocument
      title="Privacy policy"
      description="What we collect, why, and the control you keep"
      current="Privacy policy"
      updated="12 June 2026"
      intro="Amos Blood handles sensitive contact and health information for one purpose: getting the right donor to the right hospital quickly. This policy explains exactly what we collect, who sees it, how long we keep it, and how you can take it back. It is written to be read, not to hide behind."
      sections={sections}
    />
  );
}
