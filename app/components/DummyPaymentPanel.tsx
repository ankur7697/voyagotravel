"use client";

import { FormEvent, useState } from "react";

type DummyPaymentPanelProps = {
  deposit: string;
  initialOpen?: boolean;
  onClose?: () => void;
  packageName: string;
  price: string;
};

export default function DummyPaymentPanel({
  deposit,
  initialOpen = false,
  onClose,
  packageName,
  price,
}: DummyPaymentPanelProps) {
  const [isOpen, setIsOpen] = useState(initialOpen);
  const [error, setError] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(
      "An error occurred while processing payment. Our team will reach out to you shortly.",
    );
  }

  function handleClose() {
    setError("");
    setIsOpen(false);
    onClose?.();
  }

  if (!isOpen) {
    return (
      <div className="rounded-xl border border-[#0f172a]/10 bg-[#f8fafc] p-5 shadow-sm sm:p-6">
        <div className="grid gap-5 lg:grid-cols-[1fr_auto] lg:items-center">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.14em] text-[#0f766e]">
              Secure checkout preview
            </p>
            <h3 className="mt-2 text-2xl font-black text-[#0f172a]">
              Review deposit details before continuing.
            </h3>
            <div className="mt-4 flex flex-wrap gap-3 text-sm font-bold text-[#475569]">
              <span className="rounded-md bg-white px-4 py-2">
                Package: {packageName}
              </span>
              <span className="rounded-md bg-white px-4 py-2">
                Starting from {price}
              </span>
              <span className="rounded-md bg-white px-4 py-2">
                Deposit {deposit}
              </span>
            </div>
          </div>
          <button
            className="rounded-md bg-[#0f766e] px-6 py-4 text-center font-black text-white hover:bg-[#115e59]"
            onClick={() => setIsOpen(true)}
            type="button"
          >
            Continue to Payment
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden rounded-xl border border-[#0f172a]/10 bg-[#f8fafc] shadow-sm">
      <button
        aria-label="Close payment"
        className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full border border-[#0f172a]/10 bg-white text-lg font-black text-[#0f172a] shadow-sm transition hover:border-[#d76445]/30 hover:text-[#d76445]"
        onClick={handleClose}
        type="button"
      >
        X
      </button>
      <div className="grid lg:grid-cols-[0.82fr_1.18fr]">
        <div className="bg-[#0f172a] p-5 pr-16 text-white sm:p-6 sm:pr-16">
          <p className="text-sm font-black uppercase tracking-[0.14em] text-[#fbbf24]">
            Booking summary
          </p>
          <h3 className="mt-3 text-3xl font-black">{packageName}</h3>
          <div className="mt-6 space-y-3 text-sm font-bold text-white/75">
            <div className="flex items-center justify-between gap-4 border-b border-white/10 pb-3">
              <span>Starting price</span>
              <span className="text-xl font-black text-white">{price}</span>
            </div>
            <div className="flex items-center justify-between gap-4 border-b border-white/10 pb-3">
              <span>Deposit due</span>
              <span className="text-xl font-black text-[#fbbf24]">
                {deposit}
              </span>
            </div>
            <div className="flex items-center justify-between gap-4">
              <span>Payment method</span>
              <span>Credit or debit card</span>
            </div>
          </div>
          <p className="mt-6 rounded-md bg-white/8 p-4 text-xs font-bold leading-5 text-white/70">
            Booking is confirmed only after invoice confirmation, supplier
            availability, and payment clearance.
          </p>
        </div>

        <div className="p-5 sm:p-6">
          <div className="pr-12">
            <p className="text-sm font-black uppercase tracking-[0.14em] text-[#0f766e]">
              Payment information
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              <CardIcon brand="visa" light />
              <CardIcon brand="mastercard" light />
              <CardIcon brand="amex" light />
              <CardIcon brand="discover" light />
            </div>
          </div>
          <form className="mt-5 grid gap-4 sm:grid-cols-2" onSubmit={handleSubmit}>
            <div className="rounded-lg border border-[#0f172a]/10 bg-white p-4 sm:col-span-2">
              <p className="text-sm font-black uppercase tracking-[0.12em] text-[#075985]">
                Customer details
              </p>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <label className="block">
                  <span className="mb-1 block text-sm font-black">
                    Full name
                  </span>
                  <input
                    className="h-12 w-full rounded-md border border-[#0f172a]/15 bg-[#f8fafc] px-3 font-bold outline-none focus:border-[#075985]"
                    placeholder="Traveler name"
                    required
                  />
                </label>
                <label className="block">
                  <span className="mb-1 block text-sm font-black">
                    Email address
                  </span>
                  <input
                    className="h-12 w-full rounded-md border border-[#0f172a]/15 bg-[#f8fafc] px-3 font-bold outline-none focus:border-[#075985]"
                    placeholder="name@example.com"
                    required
                    type="email"
                  />
                </label>
                <div className="block">
                  <span className="mb-1 block text-sm font-black">
                    Phone number
                  </span>
                  <div className="grid grid-cols-[120px_1fr] gap-2">
                    <select
                      aria-label="Country code"
                      className="h-12 rounded-md border border-[#0f172a]/15 bg-[#f8fafc] px-3 font-bold outline-none focus:border-[#075985]"
                      required
                    >
                      <option value="+1">US +1</option>
                      <option value="+44">UK +44</option>
                      <option value="+61">AU +61</option>
                      <option value="+971">UAE +971</option>
                      <option value="+91">IN +91</option>
                      <option value="+1-ca">CA +1</option>
                    </select>
                    <input
                      className="h-12 w-full rounded-md border border-[#0f172a]/15 bg-[#f8fafc] px-3 font-bold outline-none focus:border-[#075985]"
                      inputMode="tel"
                      placeholder="Phone number"
                      required
                    />
                  </div>
                </div>
                <label className="block">
                  <span className="mb-1 block text-sm font-black">
                    Travel date
                  </span>
                  <input
                    className="h-12 w-full rounded-md border border-[#0f172a]/15 bg-[#f8fafc] px-3 font-bold outline-none focus:border-[#075985]"
                    required
                    type="date"
                  />
                </label>
                <label className="block">
                  <span className="mb-1 block text-sm font-black">
                    Travelers
                  </span>
                  <input
                    className="h-12 w-full rounded-md border border-[#0f172a]/15 bg-[#f8fafc] px-3 font-bold outline-none focus:border-[#075985]"
                    min="1"
                    placeholder="2"
                    required
                    type="number"
                  />
                </label>
                <label className="block">
                  <span className="mb-1 block text-sm font-black">
                    Preferred contact
                  </span>
                  <select
                    className="h-12 w-full rounded-md border border-[#0f172a]/15 bg-[#f8fafc] px-3 font-bold outline-none focus:border-[#075985]"
                    required
                  >
                    <option>Email</option>
                    <option>Phone call</option>
                    <option>Text message</option>
                  </select>
                </label>
                <label className="block sm:col-span-2">
                  <span className="mb-1 block text-sm font-black">
                    Booking notes
                  </span>
                  <textarea
                    className="min-h-24 w-full resize-y rounded-md border border-[#0f172a]/15 bg-[#f8fafc] px-3 py-3 font-bold outline-none focus:border-[#075985]"
                    placeholder="Room preference, airport, special requests, or package changes"
                  />
                </label>
              </div>
            </div>

            <label className="block sm:col-span-2">
              <span className="mb-1 block text-sm font-black">Name on card</span>
              <input
                className="h-12 w-full rounded-md border border-[#0f172a]/15 bg-white px-3 font-bold outline-none focus:border-[#075985]"
                placeholder="Full name"
                required
              />
            </label>
            <label className="block sm:col-span-2">
              <span className="mb-1 block text-sm font-black">Card number</span>
              <input
                className="h-12 w-full rounded-md border border-[#0f172a]/15 bg-white px-3 font-bold outline-none focus:border-[#075985]"
                inputMode="numeric"
                placeholder="4242 4242 4242 4242"
                required
              />
            </label>
            <label className="block">
              <span className="mb-1 block text-sm font-black">Expiry</span>
              <input
                className="h-12 w-full rounded-md border border-[#0f172a]/15 bg-white px-3 font-bold outline-none focus:border-[#075985]"
                placeholder="MM/YY"
                required
              />
            </label>
            <label className="block">
              <span className="mb-1 block text-sm font-black">CVC</span>
              <input
                className="h-12 w-full rounded-md border border-[#0f172a]/15 bg-white px-3 font-bold outline-none focus:border-[#075985]"
                inputMode="numeric"
                placeholder="123"
                required
              />
            </label>

            <button
              className="rounded-md bg-[#0f766e] px-5 py-4 font-black text-white hover:bg-[#115e59] sm:col-span-2"
              type="submit"
            >
              Make Payment
            </button>
          </form>

          {error ? (
            <p className="mt-4 rounded-md bg-[#0f766e]/10 px-4 py-3 text-sm font-black leading-6 text-[#b43d27]">
              {error}
            </p>
          ) : null}

          <p className="mt-4 text-xs font-bold leading-5 text-[#64748b]">
            Payments are reviewed with your booking request before confirmation.
          </p>
        </div>
      </div>
    </div>
  );
}

function CardIcon({
  brand,
  light = false,
}: {
  brand: "visa" | "mastercard" | "amex" | "discover";
  light?: boolean;
}) {
  const baseClass = light
    ? "border-[#0f172a]/10 bg-white"
    : "border-white/15 bg-white";

  if (brand === "visa") {
    return (
      <span
        aria-label="Visa"
        className={`flex h-9 w-14 items-center justify-center rounded-md border ${baseClass}`}
      >
        <span className="text-[10px] font-black italic tracking-[-0.04em] text-[#1a3f8f]">
          VISA
        </span>
      </span>
    );
  }

  if (brand === "mastercard") {
    return (
      <span
        aria-label="Mastercard"
        className={`relative flex h-9 w-14 items-center justify-center rounded-md border ${baseClass}`}
      >
        <span className="h-5 w-5 rounded-full bg-[#eb001b]" />
        <span className="-ml-2 h-5 w-5 rounded-full bg-[#f79e1b] opacity-90" />
      </span>
    );
  }

  if (brand === "amex") {
    return (
      <span
        aria-label="American Express"
        className={`flex h-9 w-14 items-center justify-center rounded-md border ${baseClass}`}
      >
        <span className="rounded-sm bg-[#2e77bb] px-1.5 py-1 text-[9px] font-black text-white">
          AMEX
        </span>
      </span>
    );
  }

  return (
    <span
      aria-label="Discover"
      className={`flex h-9 w-14 items-center justify-center rounded-md border ${baseClass}`}
    >
      <span className="h-5 w-8 rounded-full bg-[linear-gradient(90deg,#f58220,#f9c74f)]" />
    </span>
  );
}
