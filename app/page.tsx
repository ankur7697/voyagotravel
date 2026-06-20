import Image from "next/image";
import Link from "next/link";
import BrandLogo from "./components/BrandLogo";
import FlightSearch from "./components/FlightSearch";
import { packages } from "./data/packages";

const imageBase = "https://images.unsplash.com";

const destinations = [
  {
    name: "Bali",
    mood: "Private villas, rice terraces, beach clubs",
    image:
      `${imageBase}/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=1000&q=82`,
  },
  {
    name: "Dubai",
    mood: "Skyline stays, desert evenings, family fun",
    image:
      `${imageBase}/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1000&q=82`,
  },
  {
    name: "Singapore",
    mood: "Garden skyline, Sentosa days, easy city movement",
    image:
      `${imageBase}/photo-1525625293386-3f8f99389edd?auto=format&fit=crop&w=1000&q=82`,
  },
];

const services = [
  "Personal holiday design",
  "Live flight and stay checks",
  "Visa document support",
  "Transfers, sightseeing, and concierge help",
];

const faqs = [
  {
    question: "Is Voyagoglobal a travel consultant?",
    answer:
      "Voyagoglobal is a travel planning desk for people who want clear options before booking. We compare routes, stays, inclusions, documents, and supplier terms so your trip is planned before payment.",
  },
  {
    question: "Are the package prices final?",
    answer:
      "Package prices are starting estimates. Final pricing depends on season, flight availability, hotel category, room type, visa rules, traveller count, and final supplier confirmation.",
  },
  {
    question: "Can I customize a package?",
    answer:
      "Yes. We can adjust departure city, dates, hotel category, sightseeing pace, food preference, transfers, room type, and special occasions like honeymoon, birthdays, or family milestones.",
  },
  {
    question: "When should I make payment?",
    answer:
      "Payment should be made after the itinerary, quote, inclusions, invoice, cancellation terms, and refund conditions are shared in writing.",
  },
  {
    question: "Do you help with flights only?",
    answer:
      "Yes. You can use us for flight-only, hotel-only, visa-only, or a full holiday package. The same consultant can connect all pieces when needed.",
  },
  {
    question: "How do I contact the team after submitting an inquiry?",
    answer:
      "You can call, WhatsApp, email, or use the chatbot. Share your destination, dates, traveller count, and budget so the team can respond with practical next steps.",
  },
];

const mobileNavItems = [
  { label: "Destinations", href: "#destinations" },
  { label: "About", href: "/about-us" },
  { label: "Packages", href: "#packages" },
  { label: "Services", href: "#services" },
  { label: "FAQ", href: "#faq" },
  { label: "Contact", href: "#contact" },
];

const footerGroups = [
  {
    title: "Explore",
    links: [
      { label: "Destinations", href: "#destinations" },
      { label: "About Us", href: "/about-us" },
      { label: "Packages", href: "#packages" },
      { label: "Services", href: "#services" },
      { label: "FAQ", href: "#faq" },
    ],
  },
  {
    title: "Support",
    links: [
      { label: "Flight Search", href: "#flights" },
      { label: "Hotel Search", href: "#flights" },
      { label: "Custom Trips", href: "#contact" },
      { label: "Visa Guidance", href: "#services" },
    ],
  },
  {
    title: "Policies",
    links: [
      { label: "Privacy Policy", href: "/privacy-policy" },
      { label: "Refund Policy", href: "/refund-policy" },
      { label: "Cancellation Policy", href: "/cancellation-policy" },
    ],
  },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-[#f8fbff] text-[#12213f]">
      <header className="sticky top-0 z-50 border-b border-[#dbe7fb] bg-white/92 text-[#12213f] shadow-sm shadow-[#3157d5]/5 backdrop-blur">
        <nav className="mx-auto flex min-h-20 max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-8">
          <a aria-label="VoyagoTravels home" href="#">
            <BrandLogo />
          </a>
          <div className="hidden items-center gap-8 text-sm font-bold text-[#526174] lg:flex">
            <a className="text-[#3157d5]" href="#">
              Home
            </a>
            <a href="#destinations">Destinations</a>
            <Link href="/about-us">About Us</Link>
            <a href="#packages">Packages</a>
            <a href="#services">Services</a>
            <a href="#faq">FAQ</a>
            <a href="#contact">Contact</a>
          </div>
          <a
            className="shrink-0 rounded-full bg-[#3157d5] px-4 py-3 text-sm font-black text-white shadow-lg shadow-[#3157d5]/18 hover:bg-[#2446b8] sm:px-5"
            href="#flights"
          >
            Start Search
          </a>
        </nav>
        <div className="mx-auto flex max-w-7xl gap-2 overflow-x-auto px-4 pb-3 text-xs font-bold text-[#526174] sm:px-8 sm:text-sm lg:hidden">
          {mobileNavItems.map((item) => (
            <a
              className="shrink-0 rounded-full border border-[#dbe7fb] bg-[#f8fbff] px-3 py-2 sm:px-4"
              href={item.href}
              key={item.label}
            >
              {item.label}
            </a>
          ))}
        </div>
      </header>

      <section className="relative isolate min-h-[610px] overflow-hidden bg-[#eef5ff] px-4 py-6 text-[#12213f] sm:px-8 lg:min-h-[650px] lg:py-8">
        <Image
          src={`${imageBase}/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=2200&q=86`}
          alt="VoyagoTravels bright beach holiday"
          fill
          priority
          sizes="100vw"
          className="absolute inset-0 -z-20 object-cover"
        />
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-white via-white/88 to-white/18" />
        <div className="absolute inset-x-0 bottom-0 -z-10 h-40 bg-gradient-to-t from-[#f8fbff] to-transparent" />
        <div className="mx-auto grid max-w-7xl gap-6 pt-1 lg:grid-cols-[1.05fr_0.95fr] lg:items-start lg:pt-4">
          <div className="max-w-4xl rounded-[2rem] border border-white/70 bg-white/72 p-5 shadow-2xl shadow-[#3157d5]/10 backdrop-blur sm:p-7">
            <p className="mb-4 inline-flex rounded-full border border-[#c8dcff] bg-[#eff6ff] px-4 py-2 text-xs font-black uppercase tracking-[0.16em] text-[#3157d5] sm:text-sm">
              Bespoke holidays + practical booking desk
            </p>
            <h1 className="max-w-5xl text-5xl font-black leading-[0.95] tracking-tight sm:text-7xl lg:text-8xl">
              Trip planning that feels clear before you pay.
            </h1>
            <p className="mt-5 max-w-2xl text-base font-medium leading-7 text-[#526174] sm:text-lg sm:leading-8">
              Share your destination, dates, budget, and travel style. We turn
              the idea into route options, hotel choices, flight checks,
              transfers, and a written booking path.
            </p>
            <div className="mt-5 flex flex-wrap gap-2 text-sm font-black text-[#12213f]">
              {["Family", "Honeymoon", "Visa-ready", "Groups"].map((item) => (
                <span className="rounded-full border border-[#dbe7fb] bg-white px-4 py-2" key={item}>
                  {item}
                </span>
              ))}
            </div>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <a
                className="rounded-full bg-[#3157d5] px-7 py-4 text-center font-black text-white shadow-lg shadow-[#3157d5]/16 hover:bg-[#2446b8]"
                href="#flights"
              >
                Search Flights & Hotels
              </a>
              <a
                className="rounded-full border border-[#3157d5]/30 bg-white px-7 py-4 text-center font-black text-[#3157d5] hover:border-[#ff7a59] hover:text-[#ff7a59]"
                href="#contact"
              >
                Talk to Consultant
              </a>
            </div>
            <div className="mt-7 grid max-w-2xl gap-4 border-t border-[#dbe7fb] pt-5 text-sm font-bold text-[#526174] sm:grid-cols-3">
              <p>
                <span className="block text-3xl font-black text-[#3157d5]">
                  7+
                </span>
                travel styles planned
              </p>
              <p>
                <span className="block text-3xl font-black text-[#3157d5]">
                  24h
                </span>
                quote follow-up
              </p>
              <p>
                <span className="block text-3xl font-black text-[#3157d5]">
                  35+
                </span>
                destination ideas
              </p>
            </div>
          </div>

          <div className="rounded-[2rem] border border-white/70 bg-white/78 p-5 shadow-2xl shadow-[#12213f]/10 backdrop-blur sm:p-6 lg:mt-28">
            <p className="text-sm font-black uppercase tracking-[0.18em] text-[#3157d5]">
              Planning flow
            </p>
            <div className="mt-5 space-y-5 text-[#12213f]">
              {["Trip brief", "Shortlist", "Availability check", "Booking handoff"].map(
                (item, index) => (
                  <div className="flex gap-4" key={item}>
                    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[#eaf2ff] text-sm font-black text-[#3157d5]">
                      {index + 1}
                    </span>
                    <div>
                      <h3 className="font-black">{item}</h3>
                      <p className="mt-1 text-sm leading-6 text-[#64748b]">
                        {index === 0
                          ? "Share place, dates, budget, traveller count, and non-negotiables."
                          : index === 1
                            ? "We compare sensible routes, hotel zones, and trip pace."
                            : index === 2
                              ? "Flights, hotels, visas, and cancellation terms are checked."
                              : "You receive written next steps before final confirmation."}
                      </p>
                    </div>
                  </div>
                ),
              )}
            </div>
          </div>
        </div>
      </section>

      <FlightSearch />

      <section id="destinations" className="bg-[#f8fbff] px-4 py-16 sm:px-8 sm:py-20 lg:py-28">
        <div className="mx-auto max-w-7xl">
          <SectionHeading
            eyebrow="Fresh picks"
            title="Trips selected for Indian families, couples, and small groups."
          />
          <div className="mt-12 grid gap-5 lg:grid-cols-3">
            {destinations.map((destination) => (
              <a
                className="group relative block min-h-[420px] overflow-hidden rounded-[2rem] bg-[#12213f] text-white shadow-xl shadow-[#3157d5]/10"
                href="#packages"
                key={destination.name}
              >
                <Image
                  src={destination.image}
                  alt={`${destination.name} destination`}
                  fill
                  sizes="(max-width: 1024px) 100vw, 33vw"
                  className="object-cover opacity-80 transition duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#12213f]/72 via-[#12213f]/18 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-4 p-6 sm:gap-5 sm:p-7">
                  <div>
                    <h3 className="text-3xl font-black text-white">
                      {destination.name}
                    </h3>
                    <p className="mt-2 leading-7 text-white/78">
                      {destination.mood}
                    </p>
                  </div>
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-white text-xl font-black text-[#3157d5]">
                    -&gt;
                  </span>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      <section id="packages" className="bg-white px-4 py-16 sm:px-8 sm:py-20 lg:py-28">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-8 lg:grid-cols-[0.8fr_1fr] lg:items-end">
            <SectionHeading
              eyebrow="Voyago collections"
              title="Ready starting points that can be rebuilt around your dates."
            />
            <p className="text-base leading-7 text-[#64748b] sm:text-lg sm:leading-8">
              These are not fixed brochures. Each plan can change by departure
              city, hotel category, flights, transfers, food preference,
              sightseeing style, and celebration details.
            </p>
          </div>

          <div className="mt-12 grid gap-5 lg:grid-cols-2">
            {packages.map((item) => (
              <article
                className="grid overflow-hidden rounded-[1.5rem] border border-[#dbe7fb] bg-[#fbfdff] shadow-sm shadow-[#3157d5]/5 sm:grid-cols-[220px_1fr]"
                key={item.title}
              >
                <div className="relative min-h-[240px]">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    sizes="(max-width: 1024px) 100vw, 220px"
                    className="object-cover"
                  />
                </div>
                <div className="p-5 sm:p-7">
                  <p className="text-sm font-black uppercase tracking-[0.14em] text-[#ff7a59]">
                    {item.place}
                  </p>
                  <h3 className="mt-3 text-2xl font-black leading-tight text-[#12213f]">
                    {item.title}
                  </h3>
                  <div className="mt-6 flex flex-wrap gap-3 text-sm font-bold text-[#64748b]">
                    <span className="rounded-full bg-white px-4 py-2">
                      {item.days}
                    </span>
                    <span className="rounded-full bg-white px-4 py-2">
                      Stay + transfers
                    </span>
                    <span className="rounded-full bg-white px-4 py-2">
                      Customizable
                    </span>
                  </div>
                  <div className="mt-7 flex items-center justify-between gap-5 border-t border-[#dbe7fb] pt-5">
                    <div>
                      <p className="text-sm font-bold text-[#64748b]">From</p>
                      <p className="text-3xl font-black text-[#3157d5]">
                        {item.price}
                      </p>
                    </div>
                    <Link
                      className="rounded-full bg-[#3157d5] px-5 py-3 text-sm font-black text-white hover:bg-[#2446b8]"
                      href={`/packages/${item.slug}`}
                    >
                      Enquire
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="services" className="bg-[#eef5ff] px-5 py-20 text-[#12213f] sm:px-8 lg:py-28">
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div>
            <p className="mb-5 text-sm font-black uppercase tracking-[0.16em] text-[#3157d5]">
              What Voyago handles
            </p>
            <h2 className="text-3xl font-black leading-tight sm:text-5xl">
              One quiet desk for flights, stays, documents, and ground plans.
            </h2>
            <div className="mt-10 grid gap-0 divide-y divide-[#c8dcff] border-y border-[#c8dcff]">
              {services.map((service) => (
                <div
                  className="flex items-center justify-between gap-5 py-6"
                  key={service}
                >
                  <h3 className="text-xl font-black">{service}</h3>
                  <span className="h-3 w-3 shrink-0 rounded-full bg-[#ff7a59]" />
                </div>
              ))}
            </div>
          </div>
          <div className="relative min-h-[360px] overflow-hidden rounded-[2rem] sm:min-h-[500px]">
            <Image
              src={`${imageBase}/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=1400&q=84`}
              alt="Bridge and city travel view"
              fill
              sizes="(max-width: 1024px) 100vw, 42vw"
              className="object-cover"
            />
          </div>
        </div>
      </section>

      <section id="faq" className="bg-[#f8fbff] px-4 py-16 sm:px-8 sm:py-20 lg:py-28">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.72fr_1fr] lg:items-start">
          <div className="lg:sticky lg:top-28">
            <SectionHeading
              eyebrow="Before you decide"
              title="Straight answers about quotes, changes, and consultant support."
            />
            <p className="mt-6 max-w-xl text-base leading-8 text-[#64748b]">
              Use these notes to understand how VoyagoTravels works before
              you request a route or ask for a supplier-backed quote.
            </p>
            <a
              className="mt-8 inline-block rounded-full bg-[#3157d5] px-6 py-4 font-black text-white hover:bg-[#2446b8]"
              href="#contact"
            >
              Ask a Question
            </a>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <details
                className="group rounded-[1.25rem] border border-[#dbe7fb] bg-white p-5 shadow-sm open:bg-[#eff6ff] sm:p-6"
                key={faq.question}
                open={index === 0}
              >
                <summary className="flex cursor-pointer list-none items-center justify-between gap-5 text-lg font-black text-[#12213f]">
                  <span>{faq.question}</span>
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-[#ff7a59] text-xl text-white transition group-open:rotate-45">
                    +
                  </span>
                </summary>
                <p className="mt-4 max-w-3xl text-base font-medium leading-8 text-[#64748b]">
                  {faq.answer}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <footer id="contact" className="bg-[#eef5ff] px-4 py-8 sm:px-8 sm:py-10">
        <div className="mx-auto max-w-7xl overflow-hidden rounded-[2rem] border border-[#dbe7fb] bg-white text-[#12213f] shadow-2xl shadow-[#3157d5]/10">
          <div className="grid gap-8 border-b border-[#dbe7fb] p-6 sm:p-8 lg:grid-cols-[1.2fr_0.8fr] lg:p-10">
            <div>
              <p className="mb-4 text-sm font-black uppercase tracking-[0.16em] text-[#ff7a59]">
                Send a trip brief
              </p>
              <h2 className="max-w-3xl text-3xl font-black leading-tight sm:text-5xl">
                Tell us where, when, and how you want to travel.
              </h2>
              <p className="mt-5 max-w-2xl text-base leading-7 text-[#64748b] sm:text-lg sm:leading-8">
                We will respond with route choices, stay zones, budget checks,
                document notes, and the next booking step.
              </p>
            </div>
            <div className="rounded-[1.5rem] bg-[#eaf2ff] p-5 text-[#12213f] sm:p-6 lg:self-end">
              <p className="text-sm font-black uppercase tracking-[0.14em] text-[#3157d5]">
                Quick contact
              </p>
              <a
                className="mt-4 block break-words text-2xl font-black text-[#12213f] hover:text-[#ff7a59]"
                href="mailto:info@voyagotravels.com"
              >
                info@voyagotravels.com
              </a>
              <div className="mt-4 grid gap-2 text-base font-black text-[#12213f]">
                <a className="hover:text-[#ff7a59]" href="tel:+17078028394">
                  +1 (707) 802-8394
                </a>
              </div>
              <div className="mt-5 border-t border-[#c8dcff] pt-5 text-sm font-bold leading-6 text-[#64748b]">
                <p className="font-black text-[#0f172a]">
                  VoyagoTravels LLC
                </p>
                <p>60 W Brookside Dr</p>
                <p>Cloverdale, CA 95425</p>
              </div>
              <a
                className="mt-5 inline-block rounded-full bg-[#3157d5] px-5 py-3 font-black text-white hover:bg-[#2446b8]"
                href="#flights"
              >
                Search Flights & Hotels
              </a>
            </div>
          </div>

          <div className="grid gap-8 p-6 sm:grid-cols-2 sm:p-8 lg:grid-cols-[1.3fr_1fr_1fr_1fr] lg:p-10">
            <div>
              <BrandLogo />
              <p className="mt-4 max-w-sm leading-7 text-[#64748b]">
                Practical travel planning for families, couples, groups, and
                business travellers who want clarity before booking.
              </p>
            </div>

            {footerGroups.map((group) => (
              <div key={group.title}>
                <h3 className="font-black uppercase tracking-[0.14em] text-[#ff7a59]">
                  {group.title}
                </h3>
                <ul className="mt-5 space-y-3 text-[#64748b]">
                  {group.links.map((link) => (
                    <li key={link.label}>
                      <a className="hover:text-[#3157d5]" href={link.href}>
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="flex flex-col gap-4 border-t border-[#dbe7fb] px-6 py-5 text-sm text-[#64748b] sm:px-8 lg:flex-row lg:items-center lg:justify-between lg:px-10">
            <p>Copyright 2026 VoyagoTravels. All rights reserved.</p>
            <p>Built for calm planning from first idea to final confirmation.</p>
          </div>
        </div>
      </footer>
    </main>
  );
}

function SectionHeading({
  eyebrow,
  title,
}: {
  eyebrow: string;
  title: string;
}) {
  return (
    <div className="max-w-3xl">
      <p className="mb-5 text-sm font-black uppercase tracking-[0.16em] text-[#ff7a59]">
        {eyebrow}
      </p>
      <h2 className="text-3xl font-black leading-tight tracking-tight text-[#12213f] sm:text-5xl">
        {title}
      </h2>
    </div>
  );
}
