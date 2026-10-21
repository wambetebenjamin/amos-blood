import type { Metadata } from "next";
import Link from "next/link";
import { Clock, MessageCircle, ShieldCheck } from "lucide-react";
import { PageBanner } from "@/components/site/PageBanner";
import { RequestBoard } from "@/components/requests/RequestBoard";
import { listRequests } from "@/lib/repository";
import { whatsappHref } from "@/lib/site";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Live urgent blood requests",
  description:
    "See every active blood request from hospitals and blood banks in Kenya. Filter by blood type, county and urgency, then respond with your arrival time.",
};

export default async function UrgentRequestsPage() {
  const requests = await listRequests();

  return (
    <>
      <PageBanner
        title="Urgent requests board"
        description="Every live request, one clear place to help"
        current="Urgent requests"
        image="/images/blood-donation.jpg"
      />

      <section className="section_padding">
        <div className="container-t">
          <div className="mb-8 grid gap-4 sm:grid-cols-3">
            <div className="flat_card flex items-start gap-3">
              <Clock size={18} className="mt-0.5 flex-none text-[#3cc78f]" aria-hidden="true" />
              <p className="font-body text-[13px] leading-relaxed text-[#5c5c5c]">
                Requests close automatically after 72 hours so the board stays current.
              </p>
            </div>
            <div className="flat_card flex items-start gap-3">
              <ShieldCheck size={18} className="mt-0.5 flex-none text-[#3cc78f]" aria-hidden="true" />
              <p className="font-body text-[13px] leading-relaxed text-[#5c5c5c]">
                Only verified hospitals and blood banks can post a request.
              </p>
            </div>
            <div className="flat_card flex items-start gap-3">
              <MessageCircle size={18} className="mt-0.5 flex-none text-[#3cc78f]" aria-hidden="true" />
              <p className="font-body text-[13px] leading-relaxed text-[#5c5c5c]">
                Not sure if you qualify today?{" "}
                <a href={whatsappHref} target="_blank" rel="noopener noreferrer" className="text_link">
                  Ask a coordinator
                </a>
                .
              </p>
            </div>
          </div>

          <RequestBoard requests={requests} />

          <div className="mt-10 flex flex-wrap items-center justify-between gap-4 rounded-[7px] bg-[#f3fcf8] px-6 py-5">
            <p className="max-w-2xl font-body text-[13.5px] leading-relaxed text-[#4f7d6e]">
              If a patient needs blood today and no request is listed, call the hospital blood bank
              directly or message us on WhatsApp. Do not wait for a board update in an emergency.
            </p>
            <Link href="/register-donor" className="boxed-btn4">
              Register your blood type
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
