"use client";

import Image from "next/image";
import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { CalendarClock, Download, Droplets, MapPin, QrCode } from "lucide-react";
import { BloodTypeBadge } from "@/components/site/Badges";
import { NotificationSettings } from "@/components/donor/NotificationSettings";
import { nextEligibleDate, type Donor } from "@/lib/types";
import { site } from "@/lib/site";

function formatDate(value?: string | null) {
  if (!value) return "Not recorded";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Not recorded";
  return date.toLocaleDateString("en-KE", { day: "numeric", month: "short", year: "numeric" });
}

export function DonorProfileView({ donor, qrCode }: { donor: Donor; qrCode: string }) {
  const reduced = useReducedMotion();
  const [pdfBusy, setPdfBusy] = useState(false);
  const [pdfMessage, setPdfMessage] = useState<string | null>(null);
  const eligible = nextEligibleDate(donor.lastDonationDate);

  const downloadCard = async () => {
    setPdfBusy(true);
    setPdfMessage(null);
    try {
      const { jsPDF } = await import("jspdf");
      const doc = new jsPDF({ orientation: "landscape", unit: "mm", format: [150, 92] });

      doc.setFillColor(60, 199, 143);
      doc.rect(0, 0, 150, 22, "F");
      doc.setTextColor(255, 255, 255);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(15);
      doc.text("Amos Blood", 9, 11);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(7.5);
      doc.text("Your blood. Someone's second chance.", 9, 16.5);

      doc.setTextColor(25, 29, 52);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(13);
      doc.text(donor.fullName, 9, 33);

      doc.setFont("helvetica", "normal");
      doc.setFontSize(8);
      doc.setTextColor(122, 123, 124);
      doc.text("Donor ID", 9, 41);
      doc.text("County", 9, 51);
      doc.text("Last donation", 9, 61);
      doc.text("Next eligible", 9, 71);

      doc.setTextColor(25, 29, 52);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(10);
      doc.text(donor.id, 42, 41);
      doc.text(`${donor.county} County`, 42, 51);
      doc.text(formatDate(donor.lastDonationDate), 42, 61);
      doc.text(eligible ? formatDate(eligible) : "Eligible now", 42, 71);

      doc.setFillColor(230, 247, 240);
      doc.roundedRect(9, 77, 26, 10, 2, 2, "F");
      doc.setTextColor(28, 122, 88);
      doc.setFontSize(13);
      doc.text(donor.bloodType, 17.5, 84);

      if (qrCode) {
        doc.addImage(qrCode, "PNG", 108, 28, 34, 34);
      }
      doc.setFont("helvetica", "normal");
      doc.setFontSize(7);
      doc.setTextColor(122, 123, 124);
      doc.text("Scan at the blood bank", 108, 67);
      doc.text("Carry photo ID when you donate.", 9, 88);
      doc.text(`Help line +${site.whatsappNumber}`, 108, 88);

      doc.save(`amos-blood-donor-card-${donor.id}.pdf`);
      setPdfMessage("Donor card downloaded.");
    } catch {
      setPdfMessage("We could not build the PDF in this browser. Please try again.");
    } finally {
      setPdfBusy(false);
    }
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
      <div className="grid gap-6">
        <div className="flat_card">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <span className="eyebrow">Donor profile</span>
              <h2 className="mt-2 text-[30px]">{donor.fullName}</h2>
              <p className="mt-1 font-body text-[13.5px] text-[#8a8a8a]">
                Donor since {formatDate(donor.createdAt)}. Keep your details current so hospitals can
                reach you.
              </p>
            </div>
            <BloodTypeBadge bloodType={donor.bloodType} size="lg" />
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <div className="rounded-[7px] bg-[#f9f9ff] px-4 py-3">
              <p className="font-body text-[11.5px] uppercase tracking-[0.12em] text-[#8a8a8a]">Donor ID</p>
              <p className="mt-1 font-body text-[15px] font-bold text-[#191d34]">{donor.id}</p>
            </div>
            <div className="rounded-[7px] bg-[#f9f9ff] px-4 py-3">
              <p className="font-body text-[11.5px] uppercase tracking-[0.12em] text-[#8a8a8a]">County</p>
              <p className="mt-1 flex items-center gap-2 font-body text-[15px] font-semibold text-[#191d34]">
                <MapPin size={14} className="text-[#3cc78f]" aria-hidden="true" />
                {donor.county}
              </p>
            </div>
            <div className="rounded-[7px] bg-[#f9f9ff] px-4 py-3">
              <p className="font-body text-[11.5px] uppercase tracking-[0.12em] text-[#8a8a8a]">Last donation</p>
              <p className="mt-1 font-body text-[15px] font-semibold text-[#191d34]">
                {formatDate(donor.lastDonationDate)}
              </p>
            </div>
            <div className="rounded-[7px] bg-[#f3fcf8] px-4 py-3">
              <p className="font-body text-[11.5px] uppercase tracking-[0.12em] text-[#4f7d6e]">
                Next eligible donation
              </p>
              <p className="mt-1 flex items-center gap-2 font-body text-[15px] font-semibold text-[#1c7a58]">
                <CalendarClock size={14} aria-hidden="true" />
                {eligible ? formatDate(eligible) : "You can donate now"}
              </p>
            </div>
          </div>
        </div>

        <div className="flat_card">
          <div className="flex items-center gap-2">
            <Droplets size={18} className="text-[#3cc78f]" aria-hidden="true" />
            <h2 className="text-[22px]">Donation history</h2>
          </div>
          {donor.donations.length ? (
            <div className="table_wrap mt-4">
              <table className="data_table">
                <thead>
                  <tr>
                    <th scope="col">Date</th>
                    <th scope="col">Hospital</th>
                    <th scope="col">Units</th>
                  </tr>
                </thead>
                <tbody>
                  {donor.donations.map((donation) => (
                    <tr key={donation.id}>
                      <td>{formatDate(donation.date)}</td>
                      <td>{donation.hospital}</td>
                      <td>{donation.units}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="mt-3 font-body text-[14px] leading-relaxed text-[#6b6a6a]">
              No donations recorded yet. When you donate at a partner hospital, the blood bank updates this
              log so your 90 day interval stays accurate.
            </p>
          )}
        </div>

        <NotificationSettings donorId={donor.id} initial={donor.notifications} />
      </div>

      <div className="grid gap-6">
        <motion.div
          initial={reduced ? false : { scale: 0.94, opacity: 0 }}
          whileInView={reduced ? undefined : { scale: 1, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="flat_card text-center"
        >
          <div className="flex items-center justify-center gap-2">
            <QrCode size={17} className="text-[#3cc78f]" aria-hidden="true" />
            <h2 className="text-[21px]">Your scan code</h2>
          </div>
          <div className="mx-auto mt-4 w-full max-w-[250px] rounded-[9px] border border-[#e6f7f0] bg-white p-3">
            {qrCode ? (
              <Image
                src={qrCode}
                alt={`QR code for donor ${donor.id}`}
                width={220}
                height={220}
                unoptimized
                className="h-auto w-full"
              />
            ) : null}
          </div>
          <p className="mt-3 font-body text-[13px] leading-relaxed text-[#6b6a6a]">
            Present this code at the blood bank. It confirms your donor ID, blood type and county without
            sharing your medical history.
          </p>
          <button type="button" className="boxed-btn4 mt-4 w-full" onClick={downloadCard} disabled={pdfBusy}>
            <Download size={16} aria-hidden="true" />
            {pdfBusy ? "Preparing card" : "Download donor card as PDF"}
          </button>
          {pdfMessage ? (
            <p className="mt-3 font-body text-[12.5px] text-[#2f7f62]" role="status">
              {pdfMessage}
            </p>
          ) : null}
        </motion.div>

        <div className="soft_card">
          <h2 className="text-[20px]">Your privacy</h2>
          <p className="mt-2 font-body text-[13.5px] leading-relaxed text-[#5c5c5c]">
            Hospitals see your donor ID, blood type and county. They do not see your date of birth,
            address or donation history. You can ask us to delete your profile at any time under the
            Kenya Data Protection Act, 2019.
          </p>
        </div>
      </div>
    </div>
  );
}
