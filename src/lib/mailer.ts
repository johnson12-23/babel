import "server-only";

import nodemailer from "nodemailer";

type ContactEmailPayload = {
  fullName: string;
  email: string;
  type: string;
  message: string;
};

function getTransporter() {
  const host = process.env.SMTP_HOST;
  const port = process.env.SMTP_PORT ? Number(process.env.SMTP_PORT) : undefined;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!host || !port || !user || !pass) {
    return null;
  }

  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: {
      user,
      pass,
    },
  });
}

export async function sendContactConfirmationEmail(payload: ContactEmailPayload) {
  const transporter = getTransporter();
  if (!transporter) {
    return { sent: false, reason: "SMTP not configured" as const };
  }

  const from = process.env.CONTACT_EMAIL_FROM || process.env.SMTP_USER;
  const supportEmail = process.env.CONTACT_SUPPORT_EMAIL || "reservations@babelaccra.com";

  await transporter.sendMail({
    from,
    to: payload.email,
    subject: "We received your message | Babel Restaurant Ghana",
    replyTo: supportEmail,
    text: `Hello ${payload.fullName},\n\nThank you for contacting Babel Restaurant Ghana. We received your message and our team will reply shortly.\n\nInquiry Type: ${payload.type}\nYour Message: ${payload.message}\n\nFor urgent reservations, please call +233 20 000 0600.\n\nWarm regards,\nBabel Restaurant Ghana`,
    html: `<div style="font-family: Arial, sans-serif; line-height:1.6; color:#141414;">
      <p>Hello <strong>${payload.fullName}</strong>,</p>
      <p>Thank you for contacting <strong>Babel Restaurant Ghana</strong>. We received your message and our team will reply shortly.</p>
      <p><strong>Inquiry Type:</strong> ${payload.type}<br/><strong>Your Message:</strong> ${payload.message}</p>
      <p>For urgent reservations, please call <strong>+233 20 000 0600</strong>.</p>
      <p>Warm regards,<br/>Babel Restaurant Ghana</p>
    </div>`,
  });

  return { sent: true as const };
}
