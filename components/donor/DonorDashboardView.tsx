"use client";

import Link from "next/link";
import { CalendarClock, Droplets, HeartPulse, MapPin } from "lucide-react";
import { BloodTypeBadge, UrgencyBadge } from "@/components/site/Badges";
import { NotificationSettings } from "@/components/donor/NotificationSettings";
import { TimeAgo } from "@/components/site/TimeAgo";
import type { BloodRequest, Donor } from "@/lib/types";

function formatDate(value?: string | null) {
  if (!value) return "Not set";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Not set";
  return date.toLocaleDateString("en-KE", { day: "numeric", month: "short", year: "numeric" });
}

export function DonorDashboardView({
  donor,
  opportunities,
  nextEligible,
}: {
  donor: Donor;
  opportunities: BloodRequest[];
  nextEligible: string | null;
}) {
  return (
    <div className="grid gap-6">
      <div className="grid gap-4 md:grid-cols-3">
        <div className="flat_card">
          <p className="font-body text-[12px] uppercase tracking-[0.12em] text-[#7f7174]">Donor ID</p>
          <p className="mt-1 font-body text-[18px] font-bold text-[#2a1215]">{donor.id}</p>
          <div className="mt-3">
            <BloodTypeBadge bloodType={donor.bloodType} />
          </div>
        </div>
        <div className="flat_card">
          <p className="flex items-center gap-2 font-body text-[12px] uppercase tracking-[0.12em] text-[#7f7174]">
            <MapPin size={13} aria-hidden="true" />
            County
          </p>
          <p className="mt-1 font-body text-[18px] font-semibold text-[#2a1215]">{donor.county}</p>
          <p className="mt-2 font-body text-[12.5px] text-[#7f7174]">{donor.subCounty} sub county</p>
        </div>
        <div className="flat_card">
          <p className="flex items-center gap-2 font-body text-[12px] uppercase tracking-[0.12em] text-[#7f7174]">
            <CalendarClock size={13} aria-hidden="true" />
            Next eligible donation
          </p>
          <p className="mt-1 font-body text-[18px] font-semibold text-[#8f0b1f]">
            {nextEligible ? formatDate(nextEligible) : "Eligible now"}
          </p>
          <p className="mt-2 font-body text-[12.5px] text-[#7f7174]">
            Last donation {formatDate(donor.lastDonationDate)}
          </p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
        <div className="flat_card">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <HeartPulse size={18} className="text-[#c8102e]" aria-hidden="true" />
              <h2 className="text-[22px]">Needed near you</h2>
            </div>
            <Link href="/urgent-requests" className="read_more text-[14px]">
              Full board
            </Link>
          </div>

          {opportunities.length ? (
            <ul className="mt-4 grid gap-3">
              {opportunities.map((request) => (
                <li
                  key={request.ref}
                  className="flex flex-wrap items-center justify-between gap-3 rounded-[7px] border border-[#f2e6e7] px-4 py-3"
                >
                  <div className="flex items-center gap-3">
                    <BloodTypeBadge bloodType={request.bloodType} />
                    <div>
                      <p className="font-body text-[14px] font-semibold text-[#2b1417]">{request.hospital}</p>
                      <p className="font-body text-[12.5px] text-[#7f7174]">
                        {request.county} County, {request.units} unit
                        {request.units === 1 ? "" : "s"}, <TimeAgo iso={request.postedAt} prefix="" />
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <UrgencyBadge urgency={request.urgency} />
                    <Link
                      href={`/urgent-requests?ref=${request.ref}`}
                      className="font-body text-[13px] font-semibold text-[#9a0c22] underline underline-offset-4"
                    >
                      Respond
                    </Link>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-3 font-body text-[14px] leading-relaxed text-[#6d5f62]">
              No live requests in {donor.county} County right now. We will alert you when a hospital near
              you needs {donor.bloodType} blood.
            </p>
          )}
        </div>

        <NotificationSettings donorId={donor.id} initial={donor.notifications} />
      </div>

      <div className="flat_card">
        <div className="flex items-center gap-2">
          <Droplets size={18} className="text-[#c8102e]" aria-hidden="true" />
          <h2 className="text-[22px]">Past donation log</h2>
        </div>
        {donor.donations.length ? (
          <div className="table_wrap mt-4">
            <table className="data_table">
              <thead>
                <tr>
                  <th scope="col">Date</th>
                  <th scope="col">Hospital</th>
                  <th scope="col">Units</th>
                  <th scope="col">Reference</th>
                </tr>
              </thead>
              <tbody>
                {donor.donations.map((donation) => (
                  <tr key={donation.id}>
                    <td>{formatDate(donation.date)}</td>
                    <td>{donation.hospital}</td>
                    <td>{donation.units}</td>
                    <td>{donation.id}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="mt-3 font-body text-[14px] leading-relaxed text-[#6d5f62]">
            Your log is empty for now. After a donation, the hospital confirms arrival and the record
            appears here.
          </p>
        )}
      </div>
    </div>
  );
}
