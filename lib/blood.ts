export const bloodTypes = [
  "A+",
  "A-",
  "B+",
  "B-",
  "AB+",
  "AB-",
  "O+",
  "O-",
] as const;

export type BloodType = (typeof bloodTypes)[number];

type Compatibility = {
  givesTo: BloodType[];
  receivesFrom: BloodType[];
  note: string;
};

export const compatibility: Record<BloodType, Compatibility> = {
  "A+": {
    givesTo: ["A+", "AB+"],
    receivesFrom: ["A+", "A-", "O+", "O-"],
    note: "Common in Kenya. Helps A and AB patients.",
  },
  "A-": {
    givesTo: ["A+", "A-", "AB+", "AB-"],
    receivesFrom: ["A-", "O-"],
    note: "Rare Rh negative type. Keep us stocked.",
  },
  "B+": {
    givesTo: ["B+", "AB+"],
    receivesFrom: ["B+", "B-", "O+", "O-"],
    note: "Second most needed type in county hospitals.",
  },
  "B-": {
    givesTo: ["B+", "B-", "AB+", "AB-"],
    receivesFrom: ["B-", "O-"],
    note: "Rare. A small pool of donors serves many patients.",
  },
  "AB+": {
    givesTo: ["AB+"],
    receivesFrom: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"],
    note: "Universal recipient. Can receive from any type.",
  },
  "AB-": {
    givesTo: ["AB+", "AB-"],
    receivesFrom: ["A-", "B-", "AB-", "O-"],
    note: "The rarest type in Kenya. Every donor matters.",
  },
  "O+": {
    givesTo: ["A+", "B+", "AB+", "O+"],
    receivesFrom: ["O+", "O-"],
    note: "Most common type. High demand in emergency care.",
  },
  "O-": {
    givesTo: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"],
    receivesFrom: ["O-"],
    note: "Universal donor. Used in emergencies before typing.",
  },
};

export function canDonateTo(donor: BloodType, recipient: BloodType) {
  return compatibility[donor].givesTo.includes(recipient);
}

export function compatibleDonorsFor(recipient: BloodType): BloodType[] {
  return compatibility[recipient].receivesFrom;
}

export function isBloodType(value: string): value is BloodType {
  return (bloodTypes as readonly string[]).includes(value);
}

export const urgencyLevels = ["critical", "urgent", "standard"] as const;
export type Urgency = (typeof urgencyLevels)[number];

export const urgencyLabels: Record<Urgency, string> = {
  critical: "Critical",
  urgent: "Urgent",
  standard: "Standard",
};
