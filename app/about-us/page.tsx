import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About Us | Voyagoglobal",
  description:
    "Learn about Voyagoglobal, a travel consultant company helping with reservations, packages, and itinerary coordination.",
};

const strengths = [
  "Mood-based route planning",
  "Flight option assistance",
  "Hotel reservation guidance",
  "Local transfer coordination",
  "Experience and day-plan shaping",
  "Booking facilitation",
];

const processSteps = [
  "You share your route, travel dates, budget, passenger count, and preferences.",
  "We review available travel options and explain practical choices clearly.",
  "You confirm the preferred option before final booking or payment steps.",
  "We coordinate with relevant travel suppliers and share next steps in writing.",
];

export default function AboutUsPage() {
  return (
    <main className="min-h-screen bg-[#f8fbff] text-[#12213f]">
      <section className="bg-gradient-to-br from-[#eef5ff] via-white to-[#dff7ff] px-4 py-14 text-[#12213f] sm:px-8 sm:py-20">
        <div className="mx-auto max-w-4xl">
          <Link className="inline-flex items-center gap-2 text-sm font-black text-[#3157d5]" href="/">
            <span aria-hidden="true">←</span>
            Back to home
          </Link>
          <p className="mt-10 text-sm font-black uppercase tracking-[0.16em] text-[#ff7a59]">
            Mood-based planning + travel consulting
          </p>
          <h1 className="mt-4 text-4xl font-black leading-tight sm:text-6xl">
            Travel plans shaped around how you want the trip to feel.
          </h1>
          <div className="mt-8 space-y-5 border-l border-[#3157d5]/25 pl-5 text-lg leading-8 text-[#526174]">
            <p>
              Voyagoglobal is a travel consultant company. We help travelers
              choose a travel mood, compare route options, review flights and
              hotels, arrange local transfers, and coordinate itinerary details
              before booking.
            </p>
            <p>
              Our role is to make travel planning easier to understand before
              you book. We collect your requirements, compare practical
              options, explain the next steps, and help coordinate reservations
              with relevant travel suppliers where applicable.
            </p>
            <p>
              We are not an airline, hotel, embassy, or government authority.
              Final availability, prices, schedules, visa decisions, refunds,
              cancellation rules, and supplier terms depend on the companies
              providing those travel services. Our job is to assist with
              planning, communication, and consultant support.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-[#f8fbff] px-4 py-12 sm:px-8 sm:py-16">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-2xl font-black text-[#12213f]">
            What we help with
          </h2>
          <div className="mt-6 grid gap-3 text-sm font-black text-[#0f172a] sm:grid-cols-2 lg:grid-cols-3">
            {strengths.map((item) => (
              <div
                className="rounded-[1rem] border border-[#dbe7fb] bg-white p-4 shadow-sm shadow-[#3157d5]/5"
                key={item}
              >
                <span className="mb-3 block h-2 w-2 rounded-full bg-[#ff7a59]" />
                {item}
              </div>
            ))}
          </div>
          <p className="mt-8 text-base leading-8 text-[#475569]">
            Voyagoglobal works as a travel consulting partner. Final
            availability, pricing, refund rules, and cancellation terms depend
            on airlines, hotels, local operators, and other travel suppliers.
          </p>
        </div>
      </section>

      <section className="bg-[#eef5ff] px-4 py-12 text-[#12213f] sm:px-8 sm:py-16">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-2xl font-black text-[#12213f]">
            How our consulting works
          </h2>
          <ol className="mt-6 grid gap-4 text-base font-bold leading-7 text-[#526174]">
            {processSteps.map((item, index) => (
              <li
                className="rounded-[1rem] border border-[#c8dcff] bg-white/82 p-5 shadow-sm shadow-[#3157d5]/6"
                key={item}
              >
                <span className="mb-3 block text-sm font-black uppercase tracking-[0.14em] text-[#3157d5]">
                  Step {index + 1}
                </span>
                {item}
              </li>
            ))}
          </ol>
        </div>
      </section>
    </main>
  );
}
