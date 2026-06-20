import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

type ServiceType =
  | "Flight Booking"
  | "Hotel Booking"
  | "Holiday Package"
  | "Visa Assistance"
  | "General Query";

type Lead = {
  serviceType?: ServiceType;
  fromCity?: string;
  destination?: string;
  departureDate?: string;
  returnDate?: string;
  checkInDate?: string;
  checkOutDate?: string;
  passengers?: string;
  guests?: string;
  travelClass?: string;
  budget?: string;
  numberOfDays?: string;
  country?: string;
  name?: string;
  phone?: string;
  email?: string;
  message?: string;
  source: "Website Chatbot";
  createdAt: string;
};

const serviceTypes: ServiceType[] = [
  "Flight Booking",
  "Hotel Booking",
  "Holiday Package",
  "Visa Assistance",
  "General Query",
];

const requiredFieldsByService: Record<ServiceType, (keyof Lead)[]> = {
  "Flight Booking": [
    "fromCity",
    "destination",
    "departureDate",
    "passengers",
    "travelClass",
  ],
  "Hotel Booking": [
    "destination",
    "checkInDate",
    "checkOutDate",
    "guests",
    "budget",
  ],
  "Holiday Package": [
    "destination",
    "departureDate",
    "passengers",
    "numberOfDays",
    "budget",
  ],
  "Visa Assistance": ["country", "departureDate"],
  "General Query": ["message"],
};

const localLeadStore: Lead[] = [];

export async function POST(request: Request) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const lead = normalizeLead(body);
  const validationError = validateLead(lead);

  if (validationError) {
    return NextResponse.json({ error: validationError }, { status: 400 });
  }

  const savedLead: Lead = {
    serviceType: lead.serviceType,
    fromCity: lead.fromCity,
    destination: lead.destination,
    departureDate: lead.departureDate,
    returnDate: lead.returnDate,
    checkInDate: lead.checkInDate,
    checkOutDate: lead.checkOutDate,
    passengers: lead.passengers,
    guests: lead.guests,
    travelClass: lead.travelClass,
    budget: lead.budget,
    numberOfDays: lead.numberOfDays,
    country: lead.country,
    name: lead.name,
    phone: lead.phone,
    email: lead.email,
    message: lead.message,
    source: "Website Chatbot",
    createdAt: new Date().toISOString(),
  };

  await saveLead(savedLead);
  await sendLeadEmailNotification(savedLead);

  return NextResponse.json({
    success: true,
    message: "Lead submitted successfully.",
  });
}

function normalizeLead(value: unknown): Partial<Lead> {
  const record = isRecord(value) ? value : {};

  return {
    serviceType: serviceTypes.includes(record.serviceType as ServiceType)
      ? (record.serviceType as ServiceType)
      : undefined,
    fromCity: cleanString(record.fromCity),
    destination: cleanString(record.destination),
    departureDate: cleanString(record.departureDate),
    returnDate: cleanString(record.returnDate),
    checkInDate: cleanString(record.checkInDate),
    checkOutDate: cleanString(record.checkOutDate),
    passengers: cleanString(record.passengers),
    guests: cleanString(record.guests),
    travelClass: cleanString(record.travelClass),
    budget: cleanString(record.budget),
    numberOfDays: cleanString(record.numberOfDays),
    country: cleanString(record.country),
    name: cleanString(record.name),
    phone: cleanString(record.phone),
    email: cleanString(record.email),
    message: cleanString(record.message),
    source: "Website Chatbot",
    createdAt: new Date().toISOString(),
  };
}

function validateLead(lead: Partial<Lead>) {
  if (!lead.serviceType) {
    return "Please select a travel service.";
  }

  if (!lead.name) {
    return "Name is required.";
  }

  if (!lead.phone) {
    return "Phone / WhatsApp number is required.";
  }

  if (!isValidPhone(lead.phone)) {
    return "Please enter a valid phone or WhatsApp number.";
  }

  if (lead.email && !isValidEmail(lead.email)) {
    return "Please enter a valid email address.";
  }

  const missingField = requiredFieldsByService[lead.serviceType].find(
    (field) => !lead[field],
  );

  if (missingField) {
    return `${formatFieldName(missingField)} is required for ${lead.serviceType}.`;
  }

  return "";
}

async function saveLead(lead: Lead) {
  // Replace this in-memory store with your real database insert when DB setup
  // is added, for example Prisma, Supabase, MongoDB, or a CRM webhook.
  localLeadStore.push(lead);
}

async function sendLeadEmailNotification(lead: Lead) {
  const emailConfig = getLeadEmailConfig();

  if (!emailConfig) {
    return;
  }

  const transporter = nodemailer.createTransport({
    host: emailConfig.host,
    port: emailConfig.port,
    secure: emailConfig.secure,
    auth: {
      user: emailConfig.user,
      pass: emailConfig.password,
    },
  });

  await transporter.sendMail({
    from: `"Voyagoglobal Leads" <${emailConfig.user}>`,
    to: emailConfig.to,
    replyTo: lead.email || undefined,
    subject: `New ${lead.serviceType} lead from website chatbot`,
    text: formatLeadText(lead),
    html: formatLeadHtml(lead),
  });
}

function getLeadEmailConfig() {
  const host = process.env.LEAD_EMAIL_HOST;
  const port = Number(process.env.LEAD_EMAIL_PORT);
  const user = process.env.LEAD_EMAIL_USER;
  const password = process.env.LEAD_EMAIL_PASSWORD;
  const to = process.env.LEAD_EMAIL_TO;
  const secure = process.env.LEAD_EMAIL_SECURE === "true";

  if (!host || !port || !user || !password || !to) {
    // Email notifications are optional. Add LEAD_EMAIL_* values to .env.local
    // to send chatbot leads through GoDaddy SMTP.
    return undefined;
  }

  return {
    host,
    port,
    secure,
    user,
    password,
    to,
  };
}

function formatLeadText(lead: Lead) {
  return getLeadRows(lead)
    .map(([label, value]) => `${label}: ${value}`)
    .join("\n");
}

function formatLeadHtml(lead: Lead) {
  const rows = getLeadRows(lead)
    .map(
      ([label, value]) => `
        <tr>
          <td style="padding:8px 12px;border-bottom:1px solid #e8e2d6;font-weight:700;color:#17211f;">${escapeHtml(label)}</td>
          <td style="padding:8px 12px;border-bottom:1px solid #e8e2d6;color:#42514d;">${escapeHtml(value)}</td>
        </tr>
      `,
    )
    .join("");

  return `
    <div style="font-family:Arial,Helvetica,sans-serif;max-width:680px;color:#17211f;">
      <h2 style="margin:0 0 12px;color:#0d5b57;">New Website Chatbot Lead</h2>
      <p style="margin:0 0 18px;color:#42514d;">A new travel enquiry was submitted on Voyagoglobal.</p>
      <table style="width:100%;border-collapse:collapse;border:1px solid #e8e2d6;background:#fffaf1;">
        ${rows}
      </table>
    </div>
  `;
}

function getLeadRows(lead: Lead): [string, string][] {
  return [
    ["Service Type", lead.serviceType],
    ["From City", lead.fromCity],
    ["Destination", lead.destination],
    ["Departure / Travel Date", lead.departureDate],
    ["Return Date", lead.returnDate],
    ["Check-in Date", lead.checkInDate],
    ["Check-out Date", lead.checkOutDate],
    ["Passengers / Travelers", lead.passengers],
    ["Guests", lead.guests],
    ["Travel Class", lead.travelClass],
    ["Budget", lead.budget],
    ["Number of Days", lead.numberOfDays],
    ["Country", lead.country],
    ["Name", lead.name],
    ["Phone / WhatsApp", lead.phone],
    ["Email", lead.email],
    ["Message", lead.message],
    ["Source", lead.source],
    ["Created At", lead.createdAt],
  ].filter((row): row is [string, string] => Boolean(row[1]));
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function cleanString(value: unknown) {
  return typeof value === "string" && value.trim() ? value.trim() : undefined;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function isValidPhone(value: string) {
  return value.replace(/\D/g, "").length >= 7;
}

function formatFieldName(field: keyof Lead) {
  return field
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (letter) => letter.toUpperCase());
}
