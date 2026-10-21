import { HeartPulse, Hospital, ShieldCheck, Users } from "lucide-react";
import { impactStats } from "@/lib/site";

const icons = {
  users: Users,
  heart: HeartPulse,
  check: ShieldCheck,
  hospital: Hospital,
} as const;

export function StatCounter() {
  return (
    <div className="impact_band">
      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
        {impactStats.map((stat) => {
          const Icon = icons[stat.icon];
          return (
            <div className="impact_item" key={stat.label}>
              <Icon size={46} strokeWidth={1.4} className="icon" aria-hidden="true" />
              <div>
                <h3>{stat.value.toLocaleString("en-KE")}</h3>
                <p>{stat.label}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
