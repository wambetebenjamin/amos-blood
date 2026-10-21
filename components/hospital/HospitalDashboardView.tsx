"use client";

import Link from "next/link";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { CalendarCheck, ClipboardList, Droplets, Plus, Users2 } from "lucide-react";
import { BloodTypeBadge, UrgencyBadge } from "@/components/site/Badges";
import { TimeAgo } from "@/components/site/TimeAgo";
import type { BloodRequest, DonorResponse, Hospital } from "@/lib/types";

type RequestWithResponses = BloodRequest & {
  responseCount: number;
  responses: DonorResponse[];
};

export function HospitalDashboardView({
  hospital,
  active,
  fulfilled,
  all,
  arrivals,
  stats,
}: {
  hospital: Hospital;
  active: RequestWithResponses[];
  fulfilled: RequestWithResponses[];
  all: RequestWithResponses[];
  arrivals: (DonorResponse & { hospital: string })[];
  stats: {
    activeCount: number;
    fulfilledCount: number;
    responseCount: number;
    liveWindowHours: number;
  };
}) {
  const chartData = Object.entries(
    all.reduce<Record<string, number>>((accumulator, request) => {
      accumulator[request.bloodType] = (accumulator[request.bloodType] ?? 0) + 1;
      return accumulator;
    }, {}),
  ).map(([type, count]) => ({ type, count }));

  return (
    <div className="grid gap-6">
      <div className="flat_card flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="eyebrow">Hospital dashboard</span>
          <h2 className="mt-2 text-[28px]">{hospital.name}</h2>
          <p className="mt-1 font-body text-[13.5px] text-[#8a8a8a]">
            {hospital.county} County. Requests stay public for {stats.liveWindowHours} hours.
          </p>
        </div>
        <Link href="/post-request" className="boxed-btn4">
          <Plus size={16} aria-hidden="true" />
          Post new request
        </Link>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="flat_card">
          <p className="flex items-center gap-2 font-body text-[12px] uppercase tracking-[0.12em] text-[#8a8a8a]">
            <ClipboardList size={13} aria-hidden="true" />
            Active requests
          </p>
          <p className="mt-1 font-body text-[30px] font-bold text-[#191d34]">{stats.activeCount}</p>
        </div>
        <div className="flat_card">
          <p className="flex items-center gap-2 font-body text-[12px] uppercase tracking-[0.12em] text-[#8a8a8a]">
            <Users2 size={13} aria-hidden="true" />
            Donor responses
          </p>
          <p className="mt-1 font-body text-[30px] font-bold text-[#191d34]">{stats.responseCount}</p>
        </div>
        <div className="flat_card">
          <p className="flex items-center gap-2 font-body text-[12px] uppercase tracking-[0.12em] text-[#8a8a8a]">
            <CalendarCheck size={13} aria-hidden="true" />
            Fulfilled requests
          </p>
          <p className="mt-1 font-body text-[30px] font-bold text-[#191d34]">{stats.fulfilledCount}</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="flat_card">
          <div className="flex items-center gap-2">
            <Droplets size={18} className="text-[#3cc78f]" aria-hidden="true" />
            <h2 className="text-[22px]">Active requests</h2>
          </div>
          {active.length ? (
            <div className="table_wrap mt-4">
              <table className="data_table">
                <thead>
                  <tr>
                    <th scope="col">Reference</th>
                    <th scope="col">Type</th>
                    <th scope="col">Units</th>
                    <th scope="col">Urgency</th>
                    <th scope="col">Responses</th>
                    <th scope="col">Posted</th>
                  </tr>
                </thead>
                <tbody>
                  {active.map((request) => (
                    <tr key={request.ref}>
                      <td className="font-semibold text-[#191d34]">{request.ref}</td>
                      <td>
                        <BloodTypeBadge bloodType={request.bloodType} />
                      </td>
                      <td>{request.units}</td>
                      <td>
                        <UrgencyBadge urgency={request.urgency} />
                      </td>
                      <td>{request.responseCount}</td>
                      <td>
                        <TimeAgo iso={request.postedAt} prefix="" />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="mt-3 font-body text-[14px] leading-relaxed text-[#6b6a6a]">
              No live requests. Post a new request to reach verified donors in your county.
            </p>
          )}
        </div>

        <div className="flat_card">
          <h2 className="text-[20px]">Requests by blood type</h2>
          <p className="mt-1 font-body text-[12.5px] text-[#8a8a8a]">All requests posted by this facility.</p>
          <div className="mt-4 h-[220px] w-full">
            {chartData.length ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 4, right: 8, left: -18, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eef0f3" />
                  <XAxis dataKey="type" tick={{ fontSize: 11, fill: "#7a7b7c" }} axisLine={false} tickLine={false} />
                  <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: "#7a7b7c" }} axisLine={false} tickLine={false} />
                  <Tooltip
                    contentStyle={{ borderRadius: 6, border: "1px solid #eef0f3", fontSize: 12 }}
                    labelStyle={{ color: "#191d34", fontWeight: 600 }}
                  />
                  <Bar dataKey="count" fill="#3cc78f" radius={[4, 4, 0, 0]} maxBarSize={34} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <p className="font-body text-[13px] text-[#8a8a8a]">No data yet.</p>
            )}
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="flat_card">
          <h2 className="text-[22px]">Confirmed donor arrivals</h2>
          {arrivals.length ? (
            <ul className="mt-4 grid gap-3">
              {arrivals.map((arrival) => (
                <li key={arrival.id} className="rounded-[7px] border border-[#eef0f3] px-4 py-3">
                  <div className="flex items-center justify-between gap-3">
                    <span className="font-body text-[14px] font-semibold text-[#222222]">{arrival.donorName}</span>
                    <BloodTypeBadge bloodType={arrival.bloodType} />
                  </div>
                  <p className="mt-1 font-body text-[12.5px] text-[#8a8a8a]">
                    {arrival.hospital} · Request {arrival.requestRef} · Arrival {arrival.estimatedArrival}
                  </p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-3 font-body text-[14px] leading-relaxed text-[#6b6a6a]">
              Donors who confirm arrival appear here. Confirm each donor at the blood bank, then close the
              request when the units are secured.
            </p>
          )}
        </div>

        <div className="flat_card">
          <h2 className="text-[22px]">Fulfilled requests</h2>
          {fulfilled.length ? (
            <div className="table_wrap mt-4">
              <table className="data_table">
                <thead>
                  <tr>
                    <th scope="col">Reference</th>
                    <th scope="col">Type</th>
                    <th scope="col">Units</th>
                    <th scope="col">Closed</th>
                  </tr>
                </thead>
                <tbody>
                  {fulfilled.map((request) => (
                    <tr key={request.ref}>
                      <td>{request.ref}</td>
                      <td>{request.bloodType}</td>
                      <td>{request.units}</td>
                      <td>
                        {request.fulfilledAt
                          ? new Date(request.fulfilledAt).toLocaleDateString("en-KE", {
                              day: "numeric",
                              month: "short",
                            })
                          : "Closed"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="mt-3 font-body text-[14px] leading-relaxed text-[#6b6a6a]">
              No fulfilled requests recorded yet. History appears here after a request closes.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
