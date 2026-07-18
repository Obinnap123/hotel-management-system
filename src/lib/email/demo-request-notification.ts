import "server-only";

import type { DemoRequest } from "@prisma/client";

const resendEndpoint = "https://api.resend.com/emails";

export async function sendDemoRequestNotification(lead: DemoRequest) {
  const apiKey = requireEnvironmentValue("RESEND_API_KEY");
  const from = requireEnvironmentValue("RESEND_FROM_EMAIL");
  const recipients = parseRecipients(
    requireEnvironmentValue("RESEND_SALES_RECIPIENTS"),
  );

  if (recipients.length === 0) {
    throw new Error("RESEND_SALES_RECIPIENTS has no valid recipients.");
  }

  const response = await fetch(resendEndpoint, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: recipients,
      reply_to: lead.workEmail,
      subject: `New demo request — ${lead.hotelName}`,
      text: createTextEmail(lead),
      html: createHtmlEmail(lead),
    }),
  });

  if (!response.ok) {
    const detail = await response.text();
    throw new Error(
      `Resend returned ${response.status}: ${detail.slice(0, 500)}`,
    );
  }
}

function parseRecipients(value: string) {
  return Array.from(
    new Set(
      value
        .split(/[,;\n]/)
        .map((recipient) => recipient.trim())
        .filter(Boolean),
    ),
  );
}

function requireEnvironmentValue(name: string) {
  const value = process.env[name]?.trim();

  if (!value) {
    throw new Error(`${name} is required for demo-request notifications.`);
  }

  return value;
}

function createTextEmail(lead: DemoRequest) {
  return [
    "A new demo request was saved in SymplyUp Hotel Suite.",
    "",
    `Name: ${lead.fullName}`,
    `Work email: ${lead.workEmail}`,
    `Phone: ${lead.phoneNumber}`,
    `Hotel: ${lead.hotelName}`,
    `Location: ${lead.hotelLocation}`,
    `Rooms: ${lead.numberOfRooms}`,
    `Role: ${lead.role}`,
    `Notes: ${lead.additionalNotes || "None provided"}`,
    `Submitted: ${lead.createdAt.toISOString()}`,
    `Lead ID: ${lead.id}`,
  ].join("\n");
}

function createHtmlEmail(lead: DemoRequest) {
  const rows = [
    ["Name", lead.fullName],
    ["Work email", lead.workEmail],
    ["Phone", lead.phoneNumber],
    ["Hotel", lead.hotelName],
    ["Location", lead.hotelLocation],
    ["Number of rooms", String(lead.numberOfRooms)],
    ["Role", lead.role],
    ["Additional notes", lead.additionalNotes || "None provided"],
    ["Submitted", lead.createdAt.toISOString()],
  ];

  return `<!doctype html>
<html><body style="margin:0;background:#f4f1ea;color:#22312d;font-family:Arial,sans-serif">
  <div style="max-width:640px;margin:0 auto;padding:32px 20px">
    <div style="background:#17362f;color:#fff;padding:28px 30px">
      <p style="margin:0 0 8px;color:#d9c39b;font-size:12px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase">SymplyUp Hotel Suite</p>
      <h1 style="margin:0;font-size:26px;line-height:1.25">New demo request</h1>
      <p style="margin:10px 0 0;color:#dce6e2;line-height:1.6">A new sales lead has been saved successfully.</p>
    </div>
    <div style="background:#fff;border:1px solid #ddd8ce;padding:12px 30px 26px">
      ${rows.map(([label, value]) => `<div style="padding:15px 0;border-bottom:1px solid #ece8df"><div style="margin-bottom:5px;color:#6d756f;font-size:11px;font-weight:700;letter-spacing:1px;text-transform:uppercase">${escapeHtml(label)}</div><div style="font-size:15px;line-height:1.6">${escapeHtml(value)}</div></div>`).join("")}
      <p style="margin:22px 0 0;color:#7a817c;font-size:12px">Lead ID: ${escapeHtml(lead.id)}</p>
    </div>
  </div>
</body></html>`;
}

function escapeHtml(value: string) {
  return value.replace(
    /[&<>"']/g,
    (character) =>
      ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#039;",
      })[character] ?? character,
  );
}
