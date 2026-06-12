"use client";

import Image from "next/image";
import { useState } from "react";
import DummyPaymentPanel from "./DummyPaymentPanel";
import type { TravelPackage } from "../data/packages";

type PackageDetailBodyProps = {
  item: TravelPackage;
};

export default function PackageDetailBody({ item }: PackageDetailBodyProps) {
  const [mode, setMode] = useState<"details" | "payment">("details");
  const isPayment = mode === "payment";

  return (
    <section className="bg-[#f8fafc] px-4 py-12 sm:px-8 sm:py-16">
      <div
        className={`mx-auto grid max-w-7xl gap-8 lg:items-start ${
          isPayment ? "" : "lg:grid-cols-[1fr_360px]"
        }`}
      >
        <div>
          {isPayment ? (
            <div className="space-y-6">
              <section id="payment">
                <div className="mb-5">
                  <p className="text-sm font-black uppercase tracking-[0.14em] text-[#3157d5]">
                    Payment
                  </p>
                  <h2 className="mt-3 text-3xl font-black text-[#075985]">
                    Continue with package deposit
                  </h2>
                  <p className="mt-3 max-w-3xl text-base leading-8 text-[#475569]">
                    Review the package deposit details below. Final payment is
                    processed after your quote, invoice, and supplier
                    availability are confirmed.
                  </p>
                </div>
                <DummyPaymentPanel
                  deposit={item.deposit}
                  initialOpen
                  onClose={() => setMode("details")}
                  packageName={item.place}
                  price={item.price}
                />
              </section>

              <ImportantNotes />
            </div>
          ) : (
            <div className="space-y-10">
              <section>
                <SectionHeading
                  eyebrow="Destination preview"
                  title="Trip gallery"
                />
                <div className="mt-5 grid gap-4 sm:grid-cols-3">
                  {item.gallery.map((image, index) => (
                    <div
                      className="group relative aspect-[4/3] overflow-hidden rounded-xl bg-[#12213f]"
                      key={`${item.slug}-gallery-${index}`}
                    >
                      <Image
                        alt={`${item.place} gallery ${index + 1}`}
                        className="object-cover transition duration-500 group-hover:scale-105"
                        fill
                        sizes="(max-width: 640px) 100vw, 33vw"
                        src={image}
                      />
                    </div>
                  ))}
                </div>
              </section>
              <InfoBlock title="What is included" items={item.highlights} />
              <InfoBlock title="Sample itinerary" items={item.itinerary} ordered />
              <ImportantNotes />
            </div>
          )}
        </div>

        {!isPayment ? (
          <aside className="overflow-hidden rounded-2xl border border-[#12213f]/10 bg-white shadow-[0_20px_50px_rgba(23,33,31,0.10)] lg:sticky lg:top-28">
          <div className="bg-[#12213f] p-6 text-white">
            <p className="text-xs font-black uppercase tracking-[0.2em] text-[#fbbf24]">
              Package price
            </p>
            <h2 className="mt-3 text-3xl font-black">{item.place}</h2>
            <p className="mt-2 text-sm font-bold leading-6 text-white/70">
              Custom quote support with reservation assistance after trip
              details are confirmed.
            </p>
          </div>
          <div className="p-5">
            <div className="rounded-xl border border-[#12213f]/10 bg-[#f8fafc] p-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-bold text-[#64748b]">
                    Starting from
                  </p>
                  <p className="mt-1 text-5xl font-black leading-none text-[#d76445]">
                    {item.price}
                  </p>
                </div>
                <span className="rounded-full bg-[#075985]/10 px-3 py-1 text-xs font-black uppercase tracking-[0.1em] text-[#075985]">
                  {item.days}
                </span>
              </div>
              <div className="mt-5 grid grid-cols-2 gap-3">
                <PriceMiniCard label="Deposit" value={item.deposit} />
                <PriceMiniCard label="Quote" value="Custom" />
              </div>
            </div>
            <div className="mt-4 grid gap-2 text-sm font-bold text-[#475569]">
              <p className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-[#075985]" />
                Hotel and room options reviewed
              </p>
              <p className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-[#075985]" />
                Flight and local transport assistance
              </p>
              <p className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-[#075985]" />
                Final invoice before confirmation
              </p>
            </div>
          <div className="mt-5">
            {!isPayment ? (
              <button
                className="w-full rounded-lg bg-[#d76445] px-5 py-4 font-black text-white shadow-[0_12px_24px_rgba(215,100,69,0.25)] transition hover:bg-[#bf5237]"
                onClick={() => setMode("payment")}
                type="button"
              >
                Continue to Payment
              </button>
            ) : null}
          </div>
          <p className="mt-5 rounded-lg bg-[#f8fafc] p-4 text-xs font-bold leading-5 text-[#64748b]">
            Final price depends on dates, supplier availability, room type,
            flights, and traveler count.
          </p>
          </div>
          </aside>
        ) : null}
      </div>
    </section>
  );
}

function ImportantNotes() {
  return (
    <section className="rounded-2xl border border-[#12213f]/10 bg-white p-6 shadow-sm">
      <SectionHeading eyebrow="Before booking" title="Important notes" />
      <div className="mt-4 space-y-4 text-base leading-8 text-[#475569]">
        <p>
          Prices shown are starting estimates and may change based on travel
          dates, flight availability, hotel category, room type, number of
          travelers, destination rules, and supplier terms.
        </p>
        <p>
          Final payment should be made only after the itinerary, invoice,
          cancellation rules, and refund terms are confirmed in writing.
        </p>
      </div>
    </section>
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
    <div>
      <p className="text-xs font-black uppercase tracking-[0.18em] text-[#d76445]">
        {eyebrow}
      </p>
      <h2 className="mt-2 text-3xl font-black text-[#075985]">{title}</h2>
    </div>
  );
}

function InfoBlock({
  title,
  items,
  ordered = false,
}: {
  title: string;
  items: string[];
  ordered?: boolean;
}) {
  const List = ordered ? "ol" : "ul";

  return (
    <section>
      <SectionHeading
        eyebrow={ordered ? "Flexible day plan" : "Designed for comfort"}
        title={title}
      />
      <List
        className={`mt-5 grid gap-4 text-base font-bold leading-7 text-[#475569] ${
          ordered ? "" : "sm:grid-cols-2"
        }`}
      >
        {items.map((item, index) => (
          <li
            className={`group rounded-xl border border-[#12213f]/8 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md ${
              ordered
                ? "flex items-start gap-4 p-5"
                : "min-h-24 border-l-4 border-l-[#d76445] p-5"
            }`}
            key={`${title}-${index}`}
          >
            {ordered ? (
              <span className="mt-2 h-3 w-3 shrink-0 rounded-full bg-[#d76445] shadow-[0_0_0_6px_rgba(215,100,69,0.12)]" />
            ) : null}
            <div>
              {!ordered ? (
                <span className="mb-3 block h-8 w-8 rounded-full bg-[#075985]/10 text-center text-lg leading-8 text-[#075985]">
                  ✓
                </span>
              ) : null}
              <span>{item}</span>
            </div>
          </li>
        ))}
      </List>
    </section>
  );
}

function PriceMiniCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-white p-3">
      <p className="text-xs font-black uppercase tracking-[0.12em] text-[#8a7770]">
        {label}
      </p>
      <p className="mt-1 text-xl font-black text-[#075985]">{value}</p>
    </div>
  );
}
