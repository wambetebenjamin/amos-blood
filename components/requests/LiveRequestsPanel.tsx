"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { RequestCard } from "@/components/requests/RequestCard";
import type { BloodRequest } from "@/lib/types";

export function LiveRequestsPanel({ requests }: { requests: BloodRequest[] }) {
  const [notice, setNotice] = useState<string | null>(null);

  return (
    <div>
      <AnimatePresence mode="popLayout">
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {requests.map((request, index) => (
            <motion.div key={request.ref} layout exit={{ opacity: 0, y: -12 }}>
              <RequestCard request={request} index={index} onResponded={setNotice} />
            </motion.div>
          ))}
        </div>
      </AnimatePresence>

      {requests.length === 0 ? (
        <div className="flat_card text-center">
          <p className="font-body text-[15px] text-[#6b6a6a]">
            No urgent requests are open right now. Register as a donor and we will alert you the moment
            your type is needed.
          </p>
        </div>
      ) : null}

      <AnimatePresence>
        {notice ? (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="form_note mt-6"
            role="status"
          >
            {notice}
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
