import NextAuth, { type DefaultSession } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import { z } from "zod";
import { findDonorByEmail, findHospitalByEmail, registerDonor, registerHospital } from "@/lib/repository";

declare module "next-auth" {
  interface Session {
    user: {
      role?: "donor" | "hospital";
      donorId?: string;
      hospitalId?: string;
    } & DefaultSession["user"];
  }

  interface User {
    role?: "donor" | "hospital";
    donorId?: string;
    hospitalId?: string;
  }
}

const credentialsSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  role: z.enum(["donor", "hospital"]).optional(),
});

const providers = [
  Credentials({
    name: "Email and password",
    credentials: {
      email: { label: "Email", type: "email" },
      password: { label: "Password", type: "password" },
      role: { label: "Role", type: "text" },
    },
    async authorize(raw) {
      const parsed = credentialsSchema.safeParse(raw);
      if (!parsed.success) {
        return null;
      }

      const { email, role } = parsed.data;
      const existingDonor = await findDonorByEmail(email);
      const existingHospital = await findHospitalByEmail(email);

      if (existingDonor) {
        return {
          id: existingDonor.id,
          name: existingDonor.fullName,
          email: existingDonor.email,
          role: "donor" as const,
          donorId: existingDonor.id,
        };
      }

      if (existingHospital) {
        return {
          id: existingHospital.id,
          name: existingHospital.contactPerson,
          email: existingHospital.email,
          role: "hospital" as const,
          hospitalId: existingHospital.id,
        };
      }

      const resolved = role ?? "donor";
      const fallbackName = email.split("@")[0].replace(/[._-]/g, " ");

      if (resolved === "hospital") {
        const hospital = await registerHospital({
          name: `${fallbackName} Hospital`,
          county: "Nairobi",
          contactPerson: fallbackName,
          phone: "+254700000000",
          email,
        });
        return {
          id: hospital.id,
          name: hospital.contactPerson,
          email,
          role: "hospital" as const,
          hospitalId: hospital.id,
        };
      }

      const donor = await registerDonor({
        fullName: fallbackName,
        dateOfBirth: "1995-01-01",
        gender: "Other",
        bloodType: "O+",
        county: "Nairobi",
        subCounty: "Central",
        phone: "+254700000000",
        email,
        healthConfirmed: true,
        notifications: { email: true, whatsapp: false },
      });

      return {
        id: donor.id,
        name: donor.fullName,
        email: donor.email,
        role: "donor" as const,
        donorId: donor.id,
      };
    },
  }),
];

if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  providers.push(
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      allowDangerousEmailAccountLinking: true,
    }) as never,
  );
}

const secret =
  process.env.NEXTAUTH_SECRET ||
  (process.env.NODE_ENV !== "production" ? "amos-blood-development-secret" : undefined);

export const { handlers, auth, signIn, signOut } = NextAuth({
  secret,
  trustHost: true,
  session: { strategy: "jwt", maxAge: 60 * 60 * 24 * 14 },
  pages: { signIn: "/auth/signin" },
  providers,
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.donorId = user.donorId;
        token.hospitalId = user.hospitalId;
      } else if (!token.donorId && token.email) {
        const donor = await findDonorByEmail(token.email);
        if (donor) {
          token.role = "donor";
          token.donorId = donor.id;
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.role = token.role as "donor" | "hospital" | undefined;
        session.user.donorId = token.donorId as string | undefined;
        session.user.hospitalId = token.hospitalId as string | undefined;
        if (!session.user.role && token.email) {
          const donor = await findDonorByEmail(token.email);
          if (donor) {
            session.user.role = "donor";
            session.user.donorId = donor.id;
          }
        }
      }
      return session;
    },
  },
});
