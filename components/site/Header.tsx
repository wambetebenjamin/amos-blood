"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { signOut, useSession } from "next-auth/react";
import {
  Facebook,
  Instagram,
  Mail,
  Menu,
  MessageCircle,
  Phone,
  Twitter,
  X,
} from "lucide-react";
import { BrandMark } from "@/components/site/BrandMark";
import { navigation, site, whatsappHref } from "@/lib/site";

function isActive(pathname: string, href: string) {
  if (href === "/") {
    return pathname === "/";
  }
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function Header() {
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  const role = session?.user?.role;
  const dashboardHref =
    role === "hospital" ? "/hospital/dashboard" : role === "donor" ? "/donor/dashboard" : "/auth/signin";

  return (
    <header>
      <div className="top_strip">
        <div className="container-t top_strip_inner">
          <div className="short_contact_list">
            <a href={`tel:+${site.whatsappNumber}`}>
              <Phone size={14} aria-hidden="true" />
              <span>+{site.whatsappNumber}</span>
            </a>
            <a href={`mailto:${site.email}`}>
              <Mail size={14} aria-hidden="true" />
              <span>{site.email}</span>
            </a>
            <a href={whatsappHref} target="_blank" rel="noopener noreferrer">
              <MessageCircle size={14} aria-hidden="true" />
              <span>WhatsApp a coordinator</span>
            </a>
          </div>
          <div className="social_media_links" aria-label="Amos Blood social media">
            <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Amos Blood on Facebook">
              <Facebook size={15} aria-hidden="true" />
            </a>
            <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Amos Blood on Instagram">
              <Instagram size={15} aria-hidden="true" />
            </a>
            <a href="https://x.com" target="_blank" rel="noopener noreferrer" aria-label="Amos Blood on X">
              <Twitter size={15} aria-hidden="true" />
            </a>
          </div>
        </div>
      </div>

      <div className="container-t">
        <div className="main-header-area">
          <div className="header_row">
            <Link href="/" aria-label="Amos Blood home">
              <BrandMark />
            </Link>

            <nav className="main-menu" aria-label="Primary">
              <ul>
                {navigation.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="nav-link"
                      aria-current={isActive(pathname, item.href) ? "page" : undefined}
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            <div className="menu_group">
              {status === "authenticated" ? (
                <>
                  <Link href={dashboardHref} className="nav_signin">
                    My dashboard
                  </Link>
                  <button
                    type="button"
                    className="book_btn"
                    onClick={() => void signOut({ callbackUrl: "/" })}
                  >
                    Sign out
                  </button>
                </>
              ) : (
                <>
                  <Link href="/auth/signin" className="nav_signin">
                    Sign in
                  </Link>
                  <Link href="/register-donor" className="book_btn">
                    Register as donor
                  </Link>
                </>
              )}
              <button
                type="button"
                className="mobile_toggle"
                aria-expanded={open}
                aria-controls="mobile-navigation"
                aria-label={open ? "Close menu" : "Open menu"}
                onClick={() => setOpen((value) => !value)}
              >
                {open ? <X size={20} aria-hidden="true" /> : <Menu size={20} aria-hidden="true" />}
              </button>
            </div>
          </div>

          {open ? (
            <div className="mobile_panel" id="mobile-navigation">
              <ul>
                {navigation.map((item) => (
                  <li key={item.href}>
                    <Link href={item.href}>{item.label}</Link>
                  </li>
                ))}
                <li>
                  <Link href="/hospital/dashboard">Hospital dashboard</Link>
                </li>
                <li>
                  <Link href="/donor/dashboard">Donor dashboard</Link>
                </li>
                <li>
                  <Link href="/auth/signin">Sign in</Link>
                </li>
                <li>
                  <Link href="/register-donor" className="mobile_cta">
                    Register as donor
                  </Link>
                </li>
              </ul>
            </div>
          ) : null}
        </div>
      </div>
    </header>
  );
}
