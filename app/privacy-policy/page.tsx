import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy | Voyagoglobal",
  description:
    "Privacy policy for Voyagoglobal covering inquiries, payments, travel documents, and customer communications.",
};

const sections = [
  {
    title: "Information We Collect",
    body: [
      "We collect information you provide when you request a travel plan, contact us, make a booking, or complete a payment. This may include your name, email address, phone number, travel dates, destination preferences, passenger details, identity document details required for travel services, billing details, and messages you send to us.",
      "We may also collect basic technical information such as device type, browser, approximate location, pages visited, and referral source to help us understand website performance and advertising effectiveness.",
    ],
  },
  {
    title: "How We Use Information",
    body: [
      "We use your information to respond to inquiries, prepare itineraries, process bookings, coordinate with airlines, hotels, transport providers, visa partners, insurance providers, and payment processors, send service updates, prevent fraud, comply with legal obligations, and improve our services.",
      "If you submit an inquiry through an advertisement or landing page, we may use your contact details to follow up about that travel request. You can ask us to stop promotional follow-up at any time.",
    ],
  },
  {
    title: "Payments And Card Processing",
    body: [
      "Payments may be processed through a secure payment provider, bank transfer, or another approved method. We do not store full card numbers on our servers. Payment providers process card data according to their own security standards and privacy policies.",
      "We may receive limited payment information such as payment status, transaction ID, billing name, amount, currency, and refund status for accounting and customer support.",
    ],
  },
  {
    title: "Sharing With Travel Suppliers",
    body: [
      "Travel services often require us to share relevant passenger and booking information with third-party suppliers, including airlines, hotels, destination management companies, local transport operators, visa service providers, insurance providers, and payment processors.",
      "We only share information that is reasonably necessary to quote, reserve, confirm, service, change, or cancel your travel arrangements.",
    ],
  },
  {
    title: "Cookies And Advertising",
    body: [
      "Our website may use cookies, analytics, pixels, or similar technologies to measure traffic, understand user behavior, improve the site, and evaluate advertising campaigns. These tools may be provided by platforms such as Google, Meta, or other advertising and analytics providers.",
      "You can manage cookies through your browser settings. Blocking some cookies may affect website functionality or measurement accuracy.",
    ],
  },
  {
    title: "Data Retention",
    body: [
      "We keep personal information only as long as needed for travel service delivery, customer support, accounting, legal compliance, fraud prevention, dispute handling, and legitimate business records.",
      "Travel and payment records may be retained for longer where required by law, tax rules, payment processor requirements, or supplier dispute windows.",
    ],
  },
  {
    title: "Your Choices",
    body: [
      "You may request access, correction, or deletion of your personal information where legally permitted. Some records may need to be retained for accounting, legal, fraud prevention, or dispute resolution purposes.",
      "To make a privacy request, contact us at info@voyagoglobal.com or +1 (971) 517-5979.",
    ],
  },
  {
    title: "Contact",
    body: [
      "For privacy questions, contact Voyagoglobal at info@voyagoglobal.com, +1 (971) 517-5979, or by mail at Voyagoglobal LLC, 190 WEST WALNUT AVE, APT C, RIALTO, CA 92376. Please include enough detail for us to identify your request and respond properly.",
    ],
  },
];

export default function PrivacyPolicyPage() {
  return (
    <PolicyPage
      eyebrow="Legal"
      title="Privacy Policy"
      updated="Last updated: May 6, 2026"
      intro="This Privacy Policy explains how Voyagoglobal collects, uses, shares, and protects information when you visit our website, request travel services, make payments, or communicate with us."
      sections={sections}
    />
  );
}

function PolicyPage({
  eyebrow,
  title,
  updated,
  intro,
  sections,
}: {
  eyebrow: string;
  title: string;
  updated: string;
  intro: string;
  sections: { title: string; body: string[] }[];
}) {
  return (
    <main className="min-h-screen bg-[#f8fafc] text-[#0f172a]">
      <section className="px-4 py-14 sm:px-8 sm:py-20">
        <div className="mx-auto max-w-4xl">
          <Link className="text-sm font-black text-[#075985]" href="/">
            Back to home
          </Link>
          <p className="mt-10 text-sm font-black uppercase tracking-[0.16em] text-[#0f766e]">
            {eyebrow}
          </p>
          <h1 className="mt-4 text-4xl font-black leading-tight sm:text-6xl">
            {title}
          </h1>
          <p className="mt-4 text-sm font-bold text-[#64748b]">{updated}</p>
          <p className="mt-8 text-lg leading-8 text-[#475569]">{intro}</p>
        </div>
      </section>

      <section className="bg-white px-4 py-12 sm:px-8 sm:py-16">
        <div className="mx-auto max-w-4xl space-y-10">
          {sections.map((section) => (
            <section key={section.title}>
              <h2 className="text-2xl font-black text-[#075985]">
                {section.title}
              </h2>
              <div className="mt-4 space-y-4 text-base leading-8 text-[#475569]">
                {section.body.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
            </section>
          ))}
        </div>
      </section>
    </main>
  );
}
