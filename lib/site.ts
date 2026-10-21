export const site = {
  name: "Amos Blood",
  tagline: "Your blood. Someone's second chance.",
  description:
    "Amos Blood connects verified blood donors across Kenya with hospitals and blood banks that need help fast.",
  whatsappNumber: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "254112272061",
  whatsappMessage:
    "Hello Amos Blood, I would like to register as a blood donor or ask about urgent blood requests.",
  email: "hello@amosblood.co.ke",
  consentKey: "amos_blood_consent",
  region: "Kenya",
} as const;

export function whatsappLink(message: string = site.whatsappMessage) {
  return `https://wa.me/${site.whatsappNumber}?text=${encodeURIComponent(message)}`;
}

export const whatsappHref = whatsappLink();

export const navigation = [
  { label: "Home", href: "/" },
  { label: "Urgent requests", href: "/urgent-requests" },
  { label: "Blood types", href: "/blood-types" },
  { label: "Eligibility", href: "/eligibility" },
  { label: "For hospitals", href: "/post-request" },
] as const;

export const counties = [
  "Baringo",
  "Bomet",
  "Bungoma",
  "Busia",
  "Elgeyo Marakwet",
  "Embu",
  "Garissa",
  "Homa Bay",
  "Isiolo",
  "Kajiado",
  "Kakamega",
  "Kericho",
  "Kiambu",
  "Kilifi",
  "Kirinyaga",
  "Kisii",
  "Kisumu",
  "Kitui",
  "Kwale",
  "Laikipia",
  "Lamu",
  "Machakos",
  "Makueni",
  "Mandera",
  "Marsabit",
  "Meru",
  "Migori",
  "Mombasa",
  "Murang'a",
  "Nairobi",
  "Nakuru",
  "Nandi",
  "Narok",
  "Nyamira",
  "Nyandarua",
  "Nyeri",
  "Samburu",
  "Siaya",
  "Taita Taveta",
  "Tana River",
  "Tharaka Nithi",
  "Trans Nzoia",
  "Turkana",
  "Uasin Gishu",
  "Vihiga",
  "Wajir",
  "West Pokot",
] as const;

export const partnerHospitals = [
  "Kericho Hills Referral Hospital",
  "Nakuru Lakeside Medical Centre",
  "Mombasa Tudor Community Hospital",
  "Eldoret Highlands Blood Bank",
  "Kisumu Riverside County Hospital",
  "Nairobi Kilimani Care Hospital",
  "Thika Greens Medical Centre",
  "Kakamega Friendship Hospital",
  "Machakos Victory Health Centre",
  "Nyeri Ridge County Hospital",
] as const;

export const impactStats = [
  { label: "Registered donors", value: 8420, icon: "users" },
  { label: "Lives impacted", value: 21360, icon: "heart" },
  { label: "Requests fulfilled", value: 3184, icon: "check" },
  { label: "Partner hospitals", value: 96, icon: "hospital" },
] as const;

export const testimonials = [
  {
    quote:
      "I registered in three minutes on my phone. Two weeks later I was called to donate for a mother in Kericho who had lost a lot of blood. That hour changed two lives, hers and mine.",
    name: "Brian Kiptoo",
    role: "Donor, Kericho County",
    image: "/images/donor-japhet.jpg",
  },
  {
    quote:
      "I used to travel to the blood bank to check if my type was needed. Now I get a message that tells me exactly which hospital needs O negative today. It is simple and it respects my time.",
    name: "Faith Njeri",
    role: "Donor, Nakuru County",
    image: "/images/donor-anna.jpg",
  },
  {
    quote:
      "When a mother is bleeding after delivery, every minute counts. Posting a request here reaches verified donors in the area and we follow up by phone. The first responders have helped us clear several shortages this year.",
    name: "Nurse Ruth Atieno",
    role: "Charge nurse, maternal unit",
    image: "/images/nurse-portrait.jpg",
  },
] as const;

export const eligibilityQuickFacts = [
  {
    title: "Age range",
    body: "You can donate if you are between 16 and 65 years old. Donors under 18 need written consent from a parent or guardian.",
  },
  {
    title: "Weight requirement",
    body: "You should weigh at least 50 kilograms. This protects your health and makes the donation safer for you.",
  },
  {
    title: "Rest period",
    body: "Wait at least 90 days between whole blood donations. Your body needs that time to rebuild its iron stores.",
  },
  {
    title: "Health conditions",
    body: "Come well rested and free of fever or infection. Tell the nurse about any long term condition or medicine you take.",
  },
] as const;
