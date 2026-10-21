import Link from "next/link";
import { Droplets, Home, Search } from "lucide-react";

export default function NotFound() {
  return (
    <section className="section_padding bg-[#faf5f1]">
      <div className="container-t">
        <div className="mx-auto max-w-3xl text-center">
          <span className="eyebrow">Error 404</span>
          <h1 className="mt-4 text-[64px] leading-none text-[#32221d] sm:text-[92px]">404</h1>
          <h2 className="mt-4 text-[30px]">This page has moved on</h2>
          <p className="mx-auto mt-4 max-w-xl font-body text-[14.5px] leading-relaxed text-[#6d5f59]">
            The link may be old, or the request it pointed to has closed. A live request stays on the board
            for 72 hours, then the reference retires. Try the board, or start again from the homepage.
          </p>

          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <Link href="/" className="boxed-btn4">
              <Home size={16} aria-hidden="true" />
              Back to homepage
            </Link>
            <Link href="/urgent-requests" className="boxed-btn">
              <Search size={16} aria-hidden="true" />
              Search live requests
            </Link>
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            {[
              { href: "/register-donor", label: "Register as donor", copy: "Add your blood type to the network." },
              { href: "/blood-types", label: "Blood types", copy: "See who can give to whom." },
              { href: "/eligibility", label: "Eligibility", copy: "Check if you can donate today." },
            ].map((item) => (
              <Link href={item.href} key={item.href} className="flat_card hover_lift text-left">
                <Droplets size={18} className="text-[#ad4a3a]" aria-hidden="true" />
                <h3 className="mt-2 text-[18px]">{item.label}</h3>
                <p className="mt-1 font-body text-[12.5px] leading-relaxed text-[#6d5f59]">{item.copy}</p>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
