import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Cancellation Policy | Voyagoglobal",
  description:
    "Cancellation policy for Voyagoglobal bookings, itinerary changes, no-shows, supplier penalties, and travel credits.",
};

const sections = [
  {
    title: "Before You Cancel",
    body: [
      "Please contact us as soon as possible if you need to cancel or change a trip. Travel suppliers often calculate penalties based on the exact cancellation time, local time zones, departure date, check-in date, and ticketing status.",
      "A cancellation is not confirmed until we acknowledge your request and, where required, receive supplier confirmation.",
    ],
  },
  {
    title: "Cancellation Charges",
    body: [
      "Cancellation charges may include airline penalties, hotel penalties, tour operator penalties, transfer charges, visa or document fees, payment processor fees, taxes, currency conversion differences, and Voyagoglobal service fees.",
      "Some bookings are fully non-refundable after confirmation, especially discounted fares, promotional hotels, group bookings, cruise cabins, event tickets, peak season packages, and last-minute arrangements.",
    ],
  },
  {
    title: "No-Shows And Late Cancellations",
    body: [
      "If a traveler does not arrive for a flight, hotel, tour, transfer, appointment, or service, the booking may be treated as a no-show. No-shows are usually non-refundable and may cancel remaining itinerary segments.",
      "Late cancellations close to departure or check-in may carry higher penalties or no refund, depending on supplier rules.",
    ],
  },
  {
    title: "Changes Instead Of Cancellation",
    body: [
      "Where suppliers allow it, we may help with date changes, route changes, passenger corrections, hotel amendments, or travel credits. Change fees, fare differences, room rate differences, supplier charges, and service fees may apply.",
      "Name changes or corrections are subject to airline, hotel, visa, and supplier rules and may not always be possible.",
    ],
  },
  {
    title: "Supplier Cancellations",
    body: [
      "If an airline, hotel, transport provider, tour operator, or other supplier cancels or materially changes a service, available remedies may include rebooking, credit, partial refund, full refund, or alternative service, depending on supplier policy and applicable law.",
      "We will help coordinate available options, but final approval and timing may depend on the supplier.",
    ],
  },
  {
    title: "How To Cancel",
    body: [
      "Email info@voyagoglobal.com or call +1 (971) 517-5979 with your booking name, invoice number, travel dates, service to cancel, and reason for cancellation. Written requests may also be sent to Voyagoglobal LLC, 190 WEST WALNUT AVE, APT C, RIALTO, CA 92376. Urgent travel changes should also be communicated by phone or messaging if you have an assigned travel consultant.",,
      "We will review your booking terms and share the estimated cancellation outcome before proceeding where possible.",
    ],
  },
];

export default function CancellationPolicyPage() {
  return (
    <main className="min-h-screen bg-[#f8fafc] text-[#0f172a]">
      <section className="px-4 py-14 sm:px-8 sm:py-20">
        <div className="mx-auto max-w-4xl">
          <Link className="text-sm font-black text-[#075985]" href="/">
            Back to home
          </Link>
          <p className="mt-10 text-sm font-black uppercase tracking-[0.16em] text-[#0f766e]">
            Legal
          </p>
          <h1 className="mt-4 text-4xl font-black leading-tight sm:text-6xl">
            Cancellation Policy
          </h1>
          <p className="mt-4 text-sm font-bold text-[#64748b]">
            Last updated: May 6, 2026
          </p>
          <p className="mt-8 text-lg leading-8 text-[#475569]">
            This Cancellation Policy explains how cancellations, changes,
            no-shows, supplier penalties, and travel credits are handled for
            bookings arranged through Voyagoglobal.
          </p>
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
