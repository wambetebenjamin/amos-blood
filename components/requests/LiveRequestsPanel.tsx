"use client";

import { useState } from "react";
import { RequestCard } from "@/components/requests/RequestCard";
import type { BloodRequest } from "@/lib/types";

export function LiveRequestsPanel({ requests }: { requests: BloodRequest[] }) {
  const [notice, setNotice] = useState<string | null>(null);

  return (
    <div>
      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {requests.map((request, index) => (
          <RequestCard
            key={request.ref}
            request={request}
            index={index}
            onResponded={setNotice}
          />
        ))}
      </div>

      {requests.length === 0 ? (
        <div className="flat_card text-center">
          <p className="font-body text-[15px] text-[#6d5f59]">
            No urgent requests are open right now. Register as a donor and we will alert you the moment
            your type is needed.
          </p>
        </div>
      ) : null}

      {notice ? (
        <div className="form_note mt-6" role="status">
          {notice}
        </div>
      ) : null}
    </div>
  );
}
