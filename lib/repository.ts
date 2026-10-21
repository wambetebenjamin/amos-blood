import { readDb, updateDb } from "@/lib/storage";
import {
  makeRef,
  requestExpiry,
  type BloodRequest,
  type Donor,
  type DonorResponse,
  type Hospital,
} from "@/lib/types";
import type { BloodType, Urgency } from "@/lib/blood";

const ACTIVE_WINDOW_MS = 72 * 60 * 60 * 1000;

export function isRequestLive(request: BloodRequest) {
  if (request.status !== "active") {
    return false;
  }
  return new Date(request.expiresAt).getTime() > Date.now();
}

export type PublicRequest = Omit<BloodRequest, "hospitalEmail"> & { contactPhone: string };

/**
 * Strips hospital email addresses and masks the contact phone before a
 * request leaves the server for a public page or API response.
 */
export function toPublicRequest(request: BloodRequest): PublicRequest {
  const { hospitalEmail: _hospitalEmail, ...rest } = request;
  return {
    ...rest,
    contactPhone: rest.contactPhone.replace(/(\d{3})\d{3}(\d{3})/, "$1***$2"),
  };
}

export async function listRequests(filters?: {
  bloodType?: BloodType;
  county?: string;
  urgency?: Urgency;
  limit?: number;
  liveOnly?: boolean;
}) {
  const db = await readDb();
  const all = Object.values(db.requests)
    .filter((request) => (filters?.liveOnly === false ? true : isRequestLive(request)))
    .filter((request) => (filters?.bloodType ? request.bloodType === filters.bloodType : true))
    .filter((request) => (filters?.county ? request.county === filters.county : true))
    .filter((request) => (filters?.urgency ? request.urgency === filters.urgency : true))
    .sort((a, b) => new Date(b.postedAt).getTime() - new Date(a.postedAt).getTime());

  const scoped = filters?.limit ? all.slice(0, filters.limit) : all;
  return scoped.map(toPublicRequest);
}

export async function urgentRequests(limit = 3) {
  const db = await readDb();
  const all = Object.values(db.requests)
    .filter(isRequestLive)
    .filter((request) => request.urgency === "critical" || request.urgency === "urgent")
    .sort((a, b) => {
      const weight = { critical: 0, urgent: 1, standard: 2 };
      if (weight[a.urgency] !== weight[b.urgency]) {
        return weight[a.urgency] - weight[b.urgency];
      }
      return new Date(b.postedAt).getTime() - new Date(a.postedAt).getTime();
    });
  return all.slice(0, limit).map(toPublicRequest);
}

export async function findRequest(ref: string) {
  const db = await readDb();
  const request = db.requests[ref];
  if (!request) {
    return null;
  }
  const responses = db.responses[ref] ?? [];
  return { ...request, responses };
}

export async function createRequest(input: {
  hospital: string;
  contactPerson: string;
  contactPhone: string;
  hospitalEmail?: string;
  bloodType: BloodType;
  units: number;
  urgency: Urgency;
  patientCondition: string;
  county: string;
}): Promise<BloodRequest> {
  const postedAt = new Date().toISOString();
  const request: BloodRequest = {
    ref: makeRef("AB"),
    hospital: input.hospital,
    contactPerson: input.contactPerson,
    contactPhone: input.contactPhone,
    hospitalEmail: input.hospitalEmail,
    bloodType: input.bloodType,
    units: input.units,
    urgency: input.urgency,
    patientCondition: input.patientCondition,
    county: input.county,
    postedAt,
    expiresAt: requestExpiry(postedAt),
    status: "active",
  };

  await updateDb((db) => {
    db.requests[request.ref] = request;
  });

  return request;
}

export async function addResponse(input: {
  requestRef: string;
  donorId: string;
  donorName: string;
  bloodType: BloodType;
  estimatedArrival: string;
}): Promise<DonorResponse> {
  const response: DonorResponse = {
    id: makeRef("RS"),
    requestRef: input.requestRef,
    donorId: input.donorId,
    donorName: input.donorName,
    bloodType: input.bloodType,
    estimatedArrival: input.estimatedArrival,
    createdAt: new Date().toISOString(),
    status: "offered",
  };

  await updateDb((db) => {
    const list = db.responses[input.requestRef] ?? [];
    db.responses[input.requestRef] = [response, ...list];
  });

  return response;
}

export async function requestResponses(ref: string) {
  const db = await readDb();
  return db.responses[ref] ?? [];
}

export async function registerDonor(
  input: Omit<Donor, "id" | "createdAt" | "donations" | "notifications"> & {
    notifications?: Donor["notifications"];
  },
): Promise<Donor> {
  const donor: Donor = {
    ...input,
    id: makeRef("AB-D"),
    createdAt: new Date().toISOString(),
    donations: [],
    notifications: input.notifications ?? { email: true, whatsapp: true },
  };

  await updateDb((db) => {
    db.donors[donor.id] = donor;
  });

  return donor;
}

export async function findDonor(id: string) {
  const db = await readDb();
  return db.donors[id] ?? null;
}

export async function findDonorByEmail(email: string) {
  const db = await readDb();
  const normalised = email.toLowerCase();
  return (
    Object.values(db.donors).find(
      (donor) => donor.email.toLowerCase() === normalised,
    ) ?? null
  );
}

export async function updateDonor(
  id: string,
  mutate: (donor: Donor) => void,
): Promise<Donor | null> {
  const db = await readDb();
  const donor = db.donors[id];
  if (!donor) {
    return null;
  }
  mutate(donor);
  const { writeDb } = await import("@/lib/storage");
  await writeDb(db);
  return donor;
}

export async function donorDashboard(donorId: string) {
  const db = await readDb();
  const donor = db.donors[donorId];
  const live = Object.values(db.requests)
    .filter(isRequestLive)
    .filter((request) => (donor ? request.county === donor.county : true))
    .sort((a, b) => new Date(b.postedAt).getTime() - new Date(a.postedAt).getTime())
    .slice(0, 4);

  const myResponses = Object.values(db.responses)
    .flat()
    .filter((response) => response.donorId === donorId);

  return {
    donor,
    opportunities: live.map(toPublicRequest),
    responses: myResponses,
  };
}

export async function hospitalDashboard(hospitalName: string) {
  const db = await readDb();
  const all = Object.values(db.requests).filter(
    (request) => request.hospital === hospitalName,
  );
  const active = all.filter(isRequestLive);
  const fulfilled = all.filter((request) => request.status === "fulfilled");

  const withResponses = all
    .sort((a, b) => new Date(b.postedAt).getTime() - new Date(a.postedAt).getTime())
    .map((request) => ({
      ...request,
      responseCount: (db.responses[request.ref] ?? []).length,
      responses: db.responses[request.ref] ?? [],
    }));

  const arrivals = withResponses
    .flatMap((request) =>
      request.responses.map((response) => ({
        ...response,
        requestRef: request.ref,
        hospital: request.hospital,
      })),
    )
    .filter((response) => response.status !== "offered");

  return {
    active: withResponses.filter((request) => isRequestLive(request)),
    fulfilled: withResponses.filter((request) => request.status === "fulfilled"),
    all: withResponses,
    arrivals,
    stats: {
      activeCount: active.length,
      fulfilledCount: fulfilled.length,
      responseCount: withResponses.reduce((total, item) => total + item.responseCount, 0),
      liveWindowHours: Math.round(ACTIVE_WINDOW_MS / (60 * 60 * 1000)),
    },
  };
}

export async function registerHospital(input: {
  name: string;
  county: string;
  contactPerson: string;
  phone: string;
  email: string;
}): Promise<Hospital> {
  const hospital: Hospital = {
    ...input,
    id: makeRef("AB-H"),
    createdAt: new Date().toISOString(),
  };

  await updateDb((db) => {
    db.hospitals[hospital.id] = hospital;
  });

  return hospital;
}

export async function findHospitalByEmail(email: string) {
  const db = await readDb();
  const normalised = email.toLowerCase();
  return (
    Object.values(db.hospitals).find(
      (hospital) => hospital.email.toLowerCase() === normalised,
    ) ?? null
  );
}
