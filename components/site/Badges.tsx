import { AlertTriangle, Clock, ShieldCheck } from "lucide-react";
import type { Urgency } from "@/lib/blood";
import { urgencyLabels } from "@/lib/blood";

const urgencyClass: Record<Urgency, string> = {
  critical: "badge_base badge_critical",
  urgent: "badge_base badge_urgent",
  standard: "badge_base badge_standard",
};

export function UrgencyBadge({ urgency }: { urgency: Urgency }) {
  return (
    <span className={urgencyClass[urgency]}>
      {urgency === "critical" ? (
        <AlertTriangle size={12} aria-hidden="true" />
      ) : urgency === "urgent" ? (
        <Clock size={12} aria-hidden="true" />
      ) : (
        <ShieldCheck size={12} aria-hidden="true" />
      )}
      {urgencyLabels[urgency]}
    </span>
  );
}

export function BloodTypeBadge({
  bloodType,
  size = "sm",
}: {
  bloodType: string;
  size?: "sm" | "lg";
}) {
  return <span className={`blood_badge${size === "lg" ? " lg" : ""}`}>{bloodType}</span>;
}
