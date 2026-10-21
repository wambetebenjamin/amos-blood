import { redirect } from "next/navigation";
import type { Session } from "next-auth";
import { auth } from "@/auth";

export type AppRole = "donor" | "hospital";

export async function currentSession(): Promise<Session | null> {
  return auth();
}

export function roleOf(session: Session | null): AppRole | null {
  const role = session?.user?.role;
  return role === "donor" || role === "hospital" ? role : null;
}

export async function requireRole(role: AppRole, next?: string) {
  const session = await auth();
  if (!session?.user) {
    redirect(`/auth/signin${next ? `?callbackUrl=${encodeURIComponent(next)}` : ""}`);
  }
  if (roleOf(session) !== role) {
    redirect(`/auth/signin?role=${role}&reason=role-required`);
  }
  return session;
}

export async function signedInIdentity() {
  const session = await auth();
  if (!session?.user) {
    return null;
  }
  return {
    name: session.user.name ?? "Amos Blood member",
    email: session.user.email ?? "",
    role: roleOf(session),
    donorId: session.user.donorId,
    hospitalId: session.user.hospitalId,
  };
}
