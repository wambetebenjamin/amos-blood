import { bloodTypes, type BloodType, type Urgency } from "@/lib/blood";
import { partnerHospitals } from "@/lib/site";

export type DonationRecord = {
  id: string;
  date: string;
  hospital: string;
  units: number;
};

export type Donor = {
  id: string;
  fullName: string;
  dateOfBirth: string;
  gender: "Female" | "Male" | "Other";
  bloodType: BloodType;
  county: string;
  subCounty: string;
  phone: string;
  email: string;
  lastDonationDate?: string;
  healthConfirmed: boolean;
  createdAt: string;
  donations: DonationRecord[];
  notifications: {
    email: boolean;
    whatsapp: boolean;
  };
};

export type BloodRequest = {
  ref: string;
  hospital: string;
  contactPerson: string;
  contactPhone: string;
  hospitalEmail?: string;
  bloodType: BloodType;
  units: number;
  urgency: Urgency;
  patientCondition: string;
  county: string;
  postedAt: string;
  expiresAt: string;
  status: "active" | "fulfilled" | "expired";
  fulfilledAt?: string;
};

export type DonorResponse = {
  id: string;
  requestRef: string;
  donorId: string;
  donorName: string;
  bloodType: BloodType;
  estimatedArrival: string;
  createdAt: string;
  status: "offered" | "confirmed" | "completed";
};

export type Hospital = {
  id: string;
  name: string;
  county: string;
  contactPerson: string;
  phone: string;
  email: string;
  createdAt: string;
};

export type Database = {
  donors: Record<string, Donor>;
  hospitals: Record<string, Hospital>;
  requests: Record<string, BloodRequest>;
  responses: Record<string, DonorResponse[]>;
};

const HOUR = 60 * 60 * 1000;
const DAY = 24 * HOUR;

export function makeRef(prefix: string) {
  const stamp = Date.now().toString(36).toUpperCase().slice(-5);
  const rand = Math.random().toString(36).toUpperCase().slice(2, 5);
  return `${prefix}-${stamp}${rand}`;
}

export function requestExpiry(postedAt: string) {
  return new Date(new Date(postedAt).getTime() + 72 * HOUR).toISOString();
}

export function nextEligibleDate(lastDonationDate?: string) {
  if (!lastDonationDate) {
    return null;
  }
  const base = new Date(lastDonationDate);
  if (Number.isNaN(base.getTime())) {
    return null;
  }
  return new Date(base.getTime() + 90 * DAY).toISOString();
}

export const demoDonor: Donor = {
  id: "AB-D-1001",
  fullName: "Wanjiku Demo",
  dateOfBirth: "1996-04-18",
  gender: "Female",
  bloodType: "O-",
  county: "Nairobi",
  subCounty: "Kasarani",
  phone: "+254700000001",
  email: "donor@demo.amosblood.co.ke",
  lastDonationDate: new Date(Date.now() - 36 * DAY).toISOString().slice(0, 10),
  healthConfirmed: true,
  createdAt: new Date(Date.now() - 210 * DAY).toISOString(),
  donations: [
    {
      id: "DN-2401",
      date: new Date(Date.now() - 36 * DAY).toISOString().slice(0, 10),
      hospital: "Nairobi Kilimani Care Hospital",
      units: 1,
    },
    {
      id: "DN-2214",
      date: new Date(Date.now() - 152 * DAY).toISOString().slice(0, 10),
      hospital: "Nairobi Kilimani Care Hospital",
      units: 1,
    },
  ],
  notifications: { email: true, whatsapp: true },
};

export const demoHospital: Hospital = {
  id: "AB-H-2001",
  name: "Nairobi Kilimani Care Hospital",
  county: "Nairobi",
  contactPerson: "Dr. Peter Mwangi",
  phone: "+254700000002",
  email: "hospital@demo.amosblood.co.ke",
  createdAt: new Date(Date.now() - 400 * DAY).toISOString(),
};

function seedRequest(
  index: number,
  bloodType: BloodType,
  urgency: Urgency,
  hospital: string,
  county: string,
  units: number,
  condition: string,
  ageHours: number,
): BloodRequest {
  const postedAt = new Date(Date.now() - ageHours * HOUR).toISOString();
  return {
    ref: `AB-26${(6100 + index).toString()}`,
    hospital,
    contactPerson: index % 2 === 0 ? "Nurse Mercy Chebet" : "Dr. Alex Otieno",
    contactPhone: `+2547000100${(10 + index).toString().slice(-2)}`,
    hospitalEmail: `bloodbank${index + 1}@amosblood.co.ke`,
    bloodType,
    units,
    urgency,
    patientCondition: condition,
    county,
    postedAt,
    expiresAt: requestExpiry(postedAt),
    status: "active",
  };
}

export function seedRequests(): BloodRequest[] {
  return [
    seedRequest(
      1,
      "O-",
      "critical",
      partnerHospitals[0],
      "Kericho",
      3,
      "Post partum haemorrhage in the maternity unit",
      0.6,
    ),
    seedRequest(
      2,
      "B+",
      "critical",
      partnerHospitals[5],
      "Nairobi",
      2,
      "Emergency surgery for a road traffic injury",
      1.4,
    ),
    seedRequest(
      3,
      "A+",
      "urgent",
      partnerHospitals[1],
      "Nakuru",
      4,
      "Anaemia management for a patient in the general ward",
      3.2,
    ),
    seedRequest(
      4,
      "O+",
      "urgent",
      partnerHospitals[7],
      "Kakamega",
      5,
      "Sickle cell crisis support in the paediatric ward",
      5.5,
    ),
    seedRequest(
      5,
      "AB-",
      "standard",
      partnerHospitals[4],
      "Kisumu",
      2,
      "Planned transfusion for a patient with a rare type",
      9,
    ),
    seedRequest(
      6,
      "A-",
      "standard",
      partnerHospitals[2],
      "Mombasa",
      3,
      "Elective surgery preparation, no personal details",
      16,
    ),
  ];
}

function demoHospitalRequests(): BloodRequest[] {
  const activePosted = new Date(Date.now() - 2.2 * HOUR).toISOString();
  const closedPosted = new Date(Date.now() - 9 * DAY).toISOString();
  const closedAt = new Date(Date.now() - 7 * DAY).toISOString();
  return [
    {
      ref: "AB-263201",
      hospital: demoHospital.name,
      contactPerson: demoHospital.contactPerson,
      contactPhone: demoHospital.phone,
      hospitalEmail: demoHospital.email,
      bloodType: "O+",
      units: 3,
      urgency: "urgent",
      patientCondition: "Emergency caesarean section, theatre reserve units",
      county: demoHospital.county,
      postedAt: activePosted,
      expiresAt: requestExpiry(activePosted),
      status: "active",
    },
    {
      ref: "AB-263188",
      hospital: demoHospital.name,
      contactPerson: demoHospital.contactPerson,
      contactPhone: demoHospital.phone,
      hospitalEmail: demoHospital.email,
      bloodType: "A+",
      units: 2,
      urgency: "standard",
      patientCondition: "Paediatric ward transfusion support",
      county: demoHospital.county,
      postedAt: closedPosted,
      expiresAt: requestExpiry(closedPosted),
      status: "fulfilled",
      fulfilledAt: closedAt,
    },
  ];
}

export function initialDatabase(): Database {
  const requests = [...seedRequests(), ...demoHospitalRequests()];
  const fulfilled = requests.find((request) => request.ref === "AB-263188");
  return {
    donors: { [demoDonor.id]: demoDonor },
    hospitals: { [demoHospital.id]: demoHospital },
    requests: Object.fromEntries(requests.map((request) => [request.ref, request])),
    responses: fulfilled
      ? {
          [fulfilled.ref]: [
            {
              id: "RS-263188",
              requestRef: fulfilled.ref,
              donorId: demoDonor.id,
              donorName: demoDonor.fullName,
              bloodType: "A+",
              estimatedArrival: "Arrived within 40 minutes",
              createdAt: fulfilled.postedAt,
              status: "completed",
            },
          ],
        }
      : {},
  };
}

export const allBloodTypes = bloodTypes;
