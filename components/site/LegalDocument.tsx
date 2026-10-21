import Link from "next/link";
import { PageBanner } from "@/components/site/PageBanner";

export type LegalSection = {
  heading: string;
  paragraphs?: string[];
  bullets?: string[];
};

export function LegalDocument({
  title,
  description,
  current,
  updated,
  intro,
  sections,
}: {
  title: string;
  description: string;
  current: string;
  updated: string;
  intro: string;
  sections: LegalSection[];
}) {
  return (
    <>
      <PageBanner title={title} description={description} current={current} />

      <section className="section_padding">
        <div className="container-t grid gap-8 lg:grid-cols-[0.28fr_0.72fr]">
          <aside className="lg:sticky lg:top-28 lg:self-start">
            <div className="flat_card">
              <p className="font-body text-[11.5px] uppercase tracking-[0.1em] text-[#7d716a]">
                Last updated
              </p>
              <p className="mt-1 font-body text-[14px] font-semibold text-[#32221d]">{updated}</p>

              <nav aria-label="On this page" className="mt-4">
                <p className="font-body text-[11.5px] uppercase tracking-[0.1em] text-[#7d716a]">
                  On this page
                </p>
                <ul className="mt-2 grid gap-1.5">
                  {sections.map((section, index) => (
                    <li key={section.heading}>
                      <a
                        href={`#section-${index + 1}`}
                        className="font-body text-[12.5px] leading-relaxed text-[#7d5a50] hover:text-[#8a382b]"
                      >
                        {section.heading}
                      </a>
                    </li>
                  ))}
                </ul>
              </nav>

              <div className="mt-5 border-t border-[#f1e5df] pt-4">
                <p className="font-body text-[12px] leading-relaxed text-[#7d716a]">
                  Related:{" "}
                  <Link href="/legal/privacy-policy" className="text_link">
                    Privacy
                  </Link>
                  ,{" "}
                  <Link href="/legal/terms" className="text_link">
                    Terms
                  </Link>
                  ,{" "}
                  <Link href="/legal/cookie-policy" className="text_link">
                    Cookies
                  </Link>
                </p>
              </div>
            </div>
          </aside>

          <article className="legal_body">
            <p className="text-[15px] leading-relaxed text-[#463d39]">{intro}</p>

            {sections.map((section, index) => (
              <section key={section.heading} id={`section-${index + 1}`}>
                <h2>{section.heading}</h2>
                {section.paragraphs?.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
                {section.bullets ? (
                  <ul>
                    {section.bullets.map((bullet) => (
                      <li key={bullet}>{bullet}</li>
                    ))}
                  </ul>
                ) : null}
              </section>
            ))}

            <div className="mt-8 rounded-[7px] bg-[#fdf4f0] px-5 py-4">
              <p className="font-body text-[13px] leading-relaxed text-[#7d5a50]">
                Questions about this policy? Email{" "}
                <a href="mailto:hello@amosblood.co.ke" className="text_link">
                  hello@amosblood.co.ke
                </a>{" "}
                or message us on WhatsApp and a coordinator will respond.
              </p>
            </div>
          </article>
        </div>
      </section>
    </>
  );
}
