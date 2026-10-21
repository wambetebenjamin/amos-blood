"use client";

import { useState } from "react";
import { BellRing, Mail, MessageCircle } from "lucide-react";
import type { Donor } from "@/lib/types";

export function NotificationSettings({
  donorId,
  initial,
}: {
  donorId: string;
  initial: Donor["notifications"];
}) {
  const [settings, setSettings] = useState(initial);
  const [status, setStatus] = useState<string | null>(null);
  const [saving, setSaving] = useState<string | null>(null);

  const update = async (key: "email" | "whatsapp", value: boolean) => {
    const next = { ...settings, [key]: value };
    setSettings(next);
    setSaving(key);
    setStatus(null);
    try {
      const response = await fetch(`/api/donors/${donorId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ notifications: next }),
      });
      const data = (await response.json().catch(() => ({}))) as { ok?: boolean; message?: string };
      if (!response.ok || !data.ok) {
        setSettings(settings);
        setStatus(data.message || "We could not save that preference.");
      } else {
        setStatus(`${key === "email" ? "Email" : "WhatsApp"} alerts ${value ? "turned on" : "paused"}.`);
      }
    } catch {
      setSettings(settings);
      setStatus("Network issue. Try again in a moment.");
    } finally {
      setSaving(null);
    }
  };

  return (
    <div className="flat_card">
      <div className="flex items-center gap-2">
        <BellRing size={18} className="text-[#c8102e]" aria-hidden="true" />
        <h2 className="text-[22px]">Urgent request alerts</h2>
      </div>
      <p className="mt-2 font-body text-[13.5px] leading-relaxed text-[#6d5f62]">
        Choose how hospitals reach you when your blood type is needed nearby. You can pause alerts at any
        time.
      </p>

      <div className="mt-4 grid gap-3">
        <label className="flex cursor-pointer items-center justify-between gap-4 rounded-[7px] border border-[#f2e6e7] px-4 py-3">
          <span className="flex items-center gap-3">
            <Mail size={17} className="text-[#c8102e]" aria-hidden="true" />
            <span>
              <span className="block font-body text-[14px] font-semibold text-[#2b1417]">Email alerts</span>
              <span className="block font-body text-[12.5px] text-[#7f7174]">Sent to your registered address</span>
            </span>
          </span>
          <input
            type="checkbox"
            className="h-5 w-5 accent-[#c8102e]"
            checked={settings.email}
            disabled={saving === "email"}
            onChange={(event) => void update("email", event.target.checked)}
          />
        </label>

        <label className="flex cursor-pointer items-center justify-between gap-4 rounded-[7px] border border-[#f2e6e7] px-4 py-3">
          <span className="flex items-center gap-3">
            <MessageCircle size={17} className="text-[#c8102e]" aria-hidden="true" />
            <span>
              <span className="block font-body text-[14px] font-semibold text-[#2b1417]">WhatsApp alerts</span>
              <span className="block font-body text-[12.5px] text-[#7f7174]">Sent to your registered number</span>
            </span>
          </span>
          <input
            type="checkbox"
            className="h-5 w-5 accent-[#c8102e]"
            checked={settings.whatsapp}
            disabled={saving === "whatsapp"}
            onChange={(event) => void update("whatsapp", event.target.checked)}
          />
        </label>
      </div>

      {status ? (
        <p className="mt-3 font-body text-[12.5px] text-[#8b2531]" role="status">
          {status}
        </p>
      ) : null}
    </div>
  );
}
