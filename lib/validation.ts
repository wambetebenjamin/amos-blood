import { z } from "zod";
import { bloodTypes, urgencyLevels } from "@/lib/blood";
import { counties } from "@/lib/site";

const phoneRegex = /^(\+?254|0)[17]\d{8}$/;
const kenyanPhone = z
  .string()
  .trim()
  .transform((value) => value.replace(/[\s-]/g, ""))
  .refine((value) => phoneRegex.test(value), {
    message: "Enter a valid Kenyan phone number, for example 0712345678 or +254712345678",
  });

export const donorSchema = z.object({
  fullName: z.string().trim().min(3, "Enter your full name").max(90),
  dateOfBirth: z
    .string()
    .min(1, "Select your date of birth")
    .refine((value) => {
      const dob = new Date(value);
      if (Number.isNaN(dob.getTime())) return false;
      const age = (Date.now() - dob.getTime()) / (365.25 * 24 * 60 * 60 * 1000);
      return age >= 16 && age <= 65;
    }, "Donors must be between 16 and 65 years old"),
  gender: z.enum(["Female", "Male", "Other"]),
  bloodType: z.enum(bloodTypes),
  county: z.enum(counties),
  subCounty: z.string().trim().min(2, "Enter your sub county").max(80),
  phone: kenyanPhone,
  email: z.string().trim().email("Enter a valid email address"),
  lastDonationDate: z
    .string()
    .optional()
    .transform((value) => (value === "" ? undefined : value))
    .refine((value) => {
      if (!value) return true;
      const date = new Date(value);
      if (Number.isNaN(date.getTime())) return false;
      return date.getTime() <= Date.now();
    }, "Last donation date cannot be in the future"),
  healthConfirmed: z.literal(true, {
    errorMap: () => ({ message: "Please confirm the health declaration" }),
  }),
  recaptchaToken: z.string().optional(),
  role: z.literal("donor").optional(),
});

export type DonorInput = z.infer<typeof donorSchema>;

export const requestSchema = z.object({
  hospital: z.string().trim().min(3, "Enter the hospital name").max(120),
  contactPerson: z.string().trim().min(3, "Enter the contact person").max(90),
  bloodType: z.enum(bloodTypes),
  units: z.coerce
    .number()
    .int("Units must be a whole number")
    .min(1, "At least one unit is required")
    .max(20, "For more than 20 units please call the blood bank"),
  urgency: z.enum(urgencyLevels),
  patientCondition: z
    .string()
    .trim()
    .min(10, "Describe the patient condition in general terms")
    .max(240)
    .refine(
      (value) => !/\b(\d{5,}|MRN|ID\s*NO|patient\s+name)\b/i.test(value),
      "Do not include personal patient details",
    ),
  county: z.enum(counties),
  contactPhone: kenyanPhone,
  recaptchaToken: z.string().optional(),
});

export type RequestInput = z.infer<typeof requestSchema>;

export const responseSchema = z.object({
  requestRef: z.string().trim().min(4),
  donorName: z.string().trim().min(3, "Confirm your name"),
  bloodType: z.enum(bloodTypes),
  estimatedArrival: z.string().trim().min(2, "Tell the hospital when to expect you").max(60),
  recaptchaToken: z.string().optional(),
});

export type ResponseInput = z.infer<typeof responseSchema>;

export const contactSchema = z.object({
  name: z.string().trim().min(2).max(90),
  email: z.string().trim().email(),
  message: z.string().trim().min(10).max(1200),
  recaptchaToken: z.string().optional(),
});

export const signInSchema = z.object({
  email: z.string().trim().email("Enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.enum(["donor", "hospital"]),
  recaptchaToken: z.string().optional(),
});

export const signUpSchema = z
  .object({
    role: z.enum(["donor", "hospital"]),
    fullName: z.string().trim().min(3, "Enter your name").max(90),
    email: z.string().trim().email("Enter a valid email address"),
    password: z.string().min(6, "Use at least 6 characters"),
    confirmPassword: z.string().min(6, "Confirm your password"),
    phone: kenyanPhone,
    county: z.enum(counties),
    bloodType: z.enum(bloodTypes).optional(),
    hospitalName: z.string().trim().max(120).optional(),
    recaptchaToken: z.string().optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  })
  .refine(
    (data) =>
      data.role === "donor"
        ? Boolean(data.bloodType)
        : Boolean(data.hospitalName && data.hospitalName.length >= 3),
    {
      message: "Complete the fields for your selected role",
      path: ["role"],
    },
  );

export type SignUpInput = z.infer<typeof signUpSchema>;

export const notificationSchema = z.object({
  email: z.boolean(),
  whatsapp: z.boolean(),
});
