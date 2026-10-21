"use client";

import { useState } from "react";
import { Building2, MapPin, Users2 } from "lucide-react";
import { Reveal } from "@/components/site/Reveal";
import { BloodTypeBadge, UrgencyBadge } from "@/components/site/Badges";
import { TimeAgo } from "@/components/site/TimeAgo";
import { RespondModal } from "@/components/requests/RespondModal";
import type { BloodRequest } from "@/lib/types";

type RequestCardProps = {
  request: BloodRequest;
  index?: number;
  onResponded?: (message: string) => void;
};

export function RequestCard({ request, index = 0, onResponded }: RequestCardProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Reveal className="h-full" delay={Math.min(index * 0.06, 0.3)} y={22}>
        <article
          className={`flat_card flex h-full flex-col gap-4 ${
            request.urgency === "critical" ? "request_card_pulse border-[#f0cfc6]" : ""
          }`}
        >
          <div className="flex items-start justify-between gap-3">
            <BloodTypeBadge bloodType={request.bloodType} />
            <UrgencyBadge urgency={request.urgency} />
          </div>

          <div>
            <h3 className="text-[20px] leading-snug">{request.hospital}</h3>
            <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 font-body text-[13px] text-[#7c6f68]">
              <span className="inline-flex items-center gap-1.5">
                <MapPin size={13} aria-hidden="true" />
                {request.county} County
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Users2 size={13} aria-hidden="true" />
                {request.units} unit{request.units === 1 ? "" : "s"} needed
              </span>
            </div>
          </div>

          <p className="font-body text-[13.5px] leading-relaxed text-[#6d5f59]">
            {request.patientCondition}.
          </p>

          <div className="mt-auto flex flex-wrap items-center justify-between gap-3 border-t border-[#f2e7e1] pt-4">
            <span className="font-body text-[12.5px] text-[#7d716a]">
              <TimeAgo iso={request.postedAt} />
            </span>
            <button
              type="button"
              className="boxed-btn4 !px-5 !py-2.5 !text-[14px]"
              onClick={() => setOpen(true)}
            >
              Respond
            </button>
          </div>

          <span className="sr-only">
            <Building2 aria-hidden="true" /> Request reference {request.ref}
          </span>
        </article>
      </Reveal>

      <RespondModal
        request={request}
        open={open}
        onClose={() => setOpen(false)}
        onSuccess={(message) => {
          onResponded?.(message);
        }}
      />
    </>
  );
}
