import nodemailer, { type Transporter } from "nodemailer";
import { site } from "@/lib/site";

let cachedTransport: Transporter | null = null;

function transport(): Transporter | null {
  if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
    return null;
  }
  if (!cachedTransport) {
    cachedTransport = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT || 587),
      secure: Number(process.env.SMTP_PORT || 587) === 465,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }
  return cachedTransport;
}

const fromAddress = () =>
  process.env.SMTP_FROM || `"${site.name}" <${site.email}>`;

type MailPayload = {
  to: string;
  subject: string;
  text: string;
  html: string;
};

async function deliver(payload: MailPayload) {
  const mailer = transport();
  if (!mailer) {
    console.info(
      `[mailer] SMTP is not configured. Skipping delivery to ${payload.to}: ${payload.subject}`,
    );
    return { delivered: false as const, reason: "smtp-not-configured" };
  }

  try {
    await mailer.sendMail({
      from: fromAddress(),
      to: payload.to,
      subject: payload.subject,
      text: payload.text,
      html: payload.html,
    });
    return { delivered: true as const };
  } catch (error) {
    console.error("[mailer] delivery failed", error);
    return { delivered: false as const, reason: "delivery-failed" };
  }
}

function wrap(title: string, body: string) {
  return `<!doctype html>
<html lang="en">
  <body style="margin:0;padding:28px;background:#f7f7f7;font-family:'Open Sans',Arial,sans-serif;color:#222222;">
    <div style="max-width:560px;margin:0 auto;background:#ffffff;border-radius:10px;overflow:hidden;border:1px solid #eeeeee;">
      <div style="background:#3CC78F;padding:20px 26px;color:#ffffff;">
        <div style="font-size:20px;font-weight:700;letter-spacing:0.4px;">Amos Blood</div>
        <div style="font-size:12px;opacity:0.9;margin-top:4px;">Your blood. Someone's second chance.</div>
      </div>
      <div style="padding:26px;">
        <h1 style="font-size:20px;margin:0 0 14px;color:#191d34;font-weight:600;">${title}</h1>
        ${body}
      </div>
      <div style="padding:18px 26px;background:#f3fcf8;color:#6f6f6f;font-size:12px;line-height:1.7;">
        Amos Blood, Nairobi, Kenya. WhatsApp ${site.whatsappNumber}.<br />
        You are receiving this message because you used the Amos Blood platform.
      </div>
    </div>
  </body>
</html>`;
}

export async function sendDonorConfirmation(params: {
  to: string;
  donorName: string;
  donorId: string;
  bloodType: string;
  county: string;
}) {
  const body = `
    <p style="font-size:14px;line-height:1.8;color:#5c5c5c;">Hello ${params.donorName},</p>
    <p style="font-size:14px;line-height:1.8;color:#5c5c5c;">Your donor profile is ready. Thank you for joining the Amos Blood network in ${params.county}.</p>
    <table style="width:100%;margin:18px 0;border-collapse:collapse;">
      <tr>
        <td style="padding:10px 14px;background:#f9f9ff;font-size:13px;color:#7a7b7c;">Donor ID</td>
        <td style="padding:10px 14px;background:#f9f9ff;font-size:14px;font-weight:700;color:#222222;">${params.donorId}</td>
      </tr>
      <tr>
        <td style="padding:10px 14px;font-size:13px;color:#7a7b7c;">Blood type</td>
        <td style="padding:10px 14px;font-size:14px;font-weight:700;color:#222222;">${params.bloodType}</td>
      </tr>
    </table>
    <p style="font-size:14px;line-height:1.8;color:#5c5c5c;">Sign in to your donor dashboard to download your donor card and set your alert preferences.</p>
    <p style="font-size:14px;line-height:1.8;color:#5c5c5c;">Wait at least 90 days between donations. Drink water before you come and eat a proper meal.</p>
  `;
  return deliver({
    to: params.to,
    subject: `Your Amos Blood donor ID is ${params.donorId}`,
    text: `Hello ${params.donorName}, your Amos Blood donor ID is ${params.donorId}. Blood type ${params.bloodType}. County ${params.county}. Thank you for joining.`,
    html: wrap("You are registered as a donor", body),
  });
}

export async function sendResponseAlert(params: {
  to?: string;
  hospital: string;
  requestRef: string;
  donorName: string;
  bloodType: string;
  estimatedArrival: string;
}) {
  if (!params.to) {
    console.info(
      `[mailer] No hospital email for request ${params.requestRef}. Alert logged for ${params.hospital}.`,
    );
    return { delivered: false as const, reason: "no-hospital-email" };
  }
  const body = `
    <p style="font-size:14px;line-height:1.8;color:#5c5c5c;">A verified donor has responded to your request <strong>${params.requestRef}</strong>.</p>
    <table style="width:100%;margin:18px 0;border-collapse:collapse;">
      <tr><td style="padding:10px 14px;background:#f9f9ff;font-size:13px;color:#7a7b7c;">Donor</td><td style="padding:10px 14px;background:#f9f9ff;font-size:14px;color:#222222;">${params.donorName}</td></tr>
      <tr><td style="padding:10px 14px;font-size:13px;color:#7a7b7c;">Blood type</td><td style="padding:10px 14px;font-size:14px;color:#222222;">${params.bloodType}</td></tr>
      <tr><td style="padding:10px 14px;background:#f9f9ff;font-size:13px;color:#7a7b7c;">Estimated arrival</td><td style="padding:10px 14px;background:#f9f9ff;font-size:14px;color:#222222;">${params.estimatedArrival}</td></tr>
    </table>
    <p style="font-size:14px;line-height:1.8;color:#5c5c5c;">Confirm the donor on arrival and mark the request as fulfilled in your hospital dashboard.</p>
  `;
  return deliver({
    to: params.to,
    subject: `Donor response for request ${params.requestRef}`,
    text: `A donor has responded to ${params.requestRef}. ${params.donorName}, ${params.bloodType}, arrival ${params.estimatedArrival}.`,
    html: wrap("A donor is on the way", body),
  });
}

export async function sendContactMessage(params: {
  name: string;
  email: string;
  message: string;
}) {
  return deliver({
    to: site.email,
    subject: `Website message from ${params.name}`,
    text: `${params.message}\n\nReply to: ${params.email}`,
    html: wrap(
      "New message from the website",
      `<p style="font-size:14px;line-height:1.8;color:#5c5c5c;">${params.message.replace(/\n/g, "<br />")}</p>
       <p style="font-size:13px;color:#7a7b7c;">From ${params.name}, ${params.email}</p>`,
    ),
  });
}

export async function sendRequestReceipt(params: {
  to?: string;
  hospital: string;
  requestRef: string;
  bloodType: string;
  units: number;
  urgency: string;
}) {
  if (!params.to) {
    return { delivered: false as const, reason: "no-hospital-email" };
  }
  return deliver({
    to: params.to,
    subject: `Request ${params.requestRef} is live for 72 hours`,
    text: `${params.hospital}: request ${params.requestRef} for ${params.units} units of ${params.bloodType} is live for 72 hours.`,
    html: wrap(
      "Your request is live",
      `<p style="font-size:14px;line-height:1.8;color:#5c5c5c;">${params.hospital} posted request <strong>${params.requestRef}</strong> for ${params.units} unit(s) of ${params.bloodType}. Urgency level: ${params.urgency}.</p>
       <p style="font-size:14px;line-height:1.8;color:#5c5c5c;">The request stays visible on the public board for 72 hours. Track responses in your hospital dashboard.</p>`,
    ),
  });
}
