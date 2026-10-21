import Link from "next/link";
import { Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { BrandMark } from "@/components/site/BrandMark";
import { site, whatsappHref } from "@/lib/site";

const quickLinks = [
  { label: "Register as a donor", href: "/register-donor" },
  { label: "Post an urgent request", href: "/post-request" },
  { label: "Urgent requests board", href: "/urgent-requests" },
  { label: "Eligibility criteria", href: "/eligibility" },
  { label: "Blood type guide", href: "/blood-types" },
];

const accountLinks = [
  { label: "Donor sign in", href: "/auth/signin?role=donor" },
  { label: "Hospital sign in", href: "/auth/signin?role=hospital" },
  { label: "Donor dashboard", href: "/donor/dashboard" },
  { label: "Hospital dashboard", href: "/hospital/dashboard" },
];

const legalLinks = [
  { label: "Privacy policy", href: "/legal/privacy-policy" },
  { label: "Terms of use", href: "/legal/terms" },
  { label: "Cookie policy", href: "/legal/cookie-policy" },
];

export function Footer() {
  return (
    <footer className="site_footer">
      <div className="container-t">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <Link href="/" aria-label="Amos Blood home" className="inline-block">
              <BrandMark variant="dark" />
            </Link>
            <p className="footer_text mt-5">
              {site.description} Built for Kenyan hospitals, blood banks and volunteer donors.
            </p>
            <div className="mt-5 grid gap-3 font-body text-[14px] text-[#716365]">
              <span className="flex items-start gap-2.5">
                <MapPin size={16} className="mt-1 flex-none text-[#c8102e]" aria-hidden="true" />
                Nairobi, Kenya
              </span>
              <a href={`tel:+${site.whatsappNumber}`} className="flex items-center gap-2.5 hover:text-[#c8102e]">
                <Phone size={16} className="flex-none text-[#c8102e]" aria-hidden="true" />
                +{site.whatsappNumber}
              </a>
              <a href={`mailto:${site.email}`} className="flex items-center gap-2.5 hover:text-[#c8102e]">
                <Mail size={16} className="flex-none text-[#c8102e]" aria-hidden="true" />
                {site.email}
              </a>
            </div>
          </div>

          <div>
            <h2 className="footer_title">Amos Blood</h2>
            <ul className="footer_links">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href}>{link.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="footer_title">Your account</h2>
            <ul className="footer_links">
              {accountLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href}>{link.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="footer_title">Legal and contact</h2>
            <ul className="footer_links">
              {legalLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href}>{link.label}</Link>
                </li>
              ))}
              <li>
                <a href={whatsappHref} target="_blank" rel="noopener noreferrer">
                  Chat on WhatsApp
                </a>
              </li>
            </ul>
            <p className="footer_text mt-4 text-[13px]">
              Data handled under the Kenya Data Protection Act, 2019.
            </p>
          </div>
        </div>

        <div className="footer_bottom">
          <span>
            Copyright {new Date().getFullYear()} Amos Blood. All rights reserved.
          </span>
          <span className="flex items-center gap-2">
            <MessageCircle size={14} aria-hidden="true" />
            WhatsApp +{site.whatsappNumber} for urgent help
          </span>
        </div>
      </div>
    </footer>
  );
}
