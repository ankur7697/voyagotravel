"use client";

import { FormEvent, useEffect, useMemo, useRef, useState } from "react";

type ServiceType =
  | "Flight Booking"
  | "Hotel Booking"
  | "Holiday Package"
  | "Visa Assistance"
  | "General Query";

type LeadField =
  | "fromCity"
  | "destination"
  | "departureDate"
  | "returnDate"
  | "checkInDate"
  | "checkOutDate"
  | "passengers"
  | "guests"
  | "travelClass"
  | "budget"
  | "numberOfDays"
  | "country"
  | "name"
  | "phone"
  | "email"
  | "message";

type LeadData = Partial<Record<LeadField, string>> & {
  serviceType?: ServiceType;
};

type ChatMessage = {
  id: string;
  sender: "bot" | "user";
  text: string;
};

type FlowStep = {
  field: LeadField;
  label: string;
  required?: boolean;
  optional?: boolean;
  placeholder: string;
  type?: "text" | "date" | "email" | "tel" | "number";
  choices?: string[];
};

const serviceTypes: ServiceType[] = [
  "Flight Booking",
  "Hotel Booking",
  "Holiday Package",
  "Visa Assistance",
  "General Query",
];

const flows: Record<ServiceType, FlowStep[]> = {
  "Flight Booking": [
    {
      field: "fromCity",
      label: "From city",
      placeholder: "Example: Delhi",
      required: true,
    },
    {
      field: "destination",
      label: "Destination city",
      placeholder: "Example: Dubai",
      required: true,
    },
    {
      field: "departureDate",
      label: "Departure date",
      placeholder: "Select departure date",
      required: true,
      type: "date",
    },
    {
      field: "returnDate",
      label: "Return date",
      placeholder: "Select return date",
      optional: true,
      type: "date",
    },
    {
      field: "passengers",
      label: "Number of passengers",
      placeholder: "Example: 2",
      required: true,
      type: "number",
    },
    {
      field: "travelClass",
      label: "Travel class",
      placeholder: "Example: Economy",
      required: true,
      choices: ["Economy", "Premium Economy", "Business", "First"],
    },
    {
      field: "budget",
      label: "Budget",
      placeholder: "Example: $2,000",
      optional: true,
    },
    {
      field: "name",
      label: "Name",
      placeholder: "Your full name",
      required: true,
    },
    {
      field: "phone",
      label: "Phone / WhatsApp number",
      placeholder: "Example: +1 (707) 802-8394",
      required: true,
      type: "tel",
    },
    {
      field: "email",
      label: "Email",
      placeholder: "name@example.com",
      optional: true,
      type: "email",
    },
    {
      field: "message",
      label: "Extra message",
      placeholder: "Any airline, timing, or baggage preference?",
      optional: true,
    },
  ],
  "Hotel Booking": [
    {
      field: "destination",
      label: "Destination city",
      placeholder: "Example: Dubai",
      required: true,
    },
    {
      field: "checkInDate",
      label: "Check-in date",
      placeholder: "Select check-in date",
      required: true,
      type: "date",
    },
    {
      field: "checkOutDate",
      label: "Check-out date",
      placeholder: "Select check-out date",
      required: true,
      type: "date",
    },
    {
      field: "guests",
      label: "Number of guests",
      placeholder: "Example: 4",
      required: true,
      type: "number",
    },
    {
      field: "budget",
      label: "Hotel category/budget",
      placeholder: "Example: 4 star or $180/night",
      required: true,
      choices: ["Budget", "3 Star", "4 Star", "5 Star", "Luxury"],
    },
    {
      field: "name",
      label: "Name",
      placeholder: "Your full name",
      required: true,
    },
    {
      field: "phone",
      label: "Phone / WhatsApp number",
      placeholder: "Example: +1 (707) 802-8394",
      required: true,
      type: "tel",
    },
    {
      field: "email",
      label: "Email",
      placeholder: "name@example.com",
      optional: true,
      type: "email",
    },
    {
      field: "message",
      label: "Extra message",
      placeholder: "Room type, location, or breakfast preference?",
      optional: true,
    },
  ],
  "Holiday Package": [
    {
      field: "destination",
      label: "Destination",
      placeholder: "Example: Bali",
      required: true,
    },
    {
      field: "departureDate",
      label: "Travel month/date",
      placeholder: "Example: July 2026 or 2026-07-15",
      required: true,
    },
    {
      field: "passengers",
      label: "Number of travelers",
      placeholder: "Example: 3",
      required: true,
      type: "number",
    },
    {
      field: "numberOfDays",
      label: "Number of days",
      placeholder: "Example: 7",
      required: true,
      type: "number",
    },
    {
      field: "budget",
      label: "Budget",
      placeholder: "Example: $5,000 total",
      required: true,
    },
    {
      field: "name",
      label: "Name",
      placeholder: "Your full name",
      required: true,
    },
    {
      field: "phone",
      label: "Phone / WhatsApp number",
      placeholder: "Example: +1 (707) 802-8394",
      required: true,
      type: "tel",
    },
    {
      field: "email",
      label: "Email",
      placeholder: "name@example.com",
      optional: true,
      type: "email",
    },
    {
      field: "message",
      label: "Extra message",
      placeholder: "Occasion, pace, hotel style, or must-see places?",
      optional: true,
    },
  ],
  "Visa Assistance": [
    {
      field: "country",
      label: "Country",
      placeholder: "Example: Canada",
      required: true,
    },
    {
      field: "departureDate",
      label: "Travel date",
      placeholder: "Select travel date",
      required: true,
      type: "date",
    },
    {
      field: "name",
      label: "Name",
      placeholder: "Your full name",
      required: true,
    },
    {
      field: "phone",
      label: "Phone / WhatsApp number",
      placeholder: "Example: +1 (707) 802-8394",
      required: true,
      type: "tel",
    },
    {
      field: "email",
      label: "Email",
      placeholder: "name@example.com",
      optional: true,
      type: "email",
    },
    {
      field: "message",
      label: "Extra message",
      placeholder: "Passport status, visa type, or travel purpose?",
      optional: true,
    },
  ],
  "General Query": [
    {
      field: "message",
      label: "Message",
      placeholder: "How can we help?",
      required: true,
    },
    {
      field: "name",
      label: "Name",
      placeholder: "Your full name",
      required: true,
    },
    {
      field: "phone",
      label: "Phone / WhatsApp number",
      placeholder: "Example: +1 (707) 802-8394",
      required: true,
      type: "tel",
    },
    {
      field: "email",
      label: "Email",
      placeholder: "name@example.com",
      optional: true,
      type: "email",
    },
  ],
};

const initialMessage =
  "Hi, welcome to VoyagoTravels. Tell me what you want to plan and I will collect the right details.";
const whatsappPhoneNumber =
  process.env.NEXT_PUBLIC_VOYAGO_TRAVELS_WHATSAPP_NUMBER ?? "17078028394";
const whatsappText =
  "Hi, I submitted a VoyagoTravels enquiry and want help with my trip.";

export default function LeadChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    createMessage("bot", initialMessage),
  ]);
  const [leadData, setLeadData] = useState<LeadData>({});
  const [activeStepIndex, setActiveStepIndex] = useState(0);
  const [inputValue, setInputValue] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  const selectedFlow = leadData.serviceType ? flows[leadData.serviceType] : [];
  const activeStep = selectedFlow[activeStepIndex];
  const progressPercent = selectedFlow.length
    ? Math.round((activeStepIndex / selectedFlow.length) * 100)
    : 0;
  const whatsappUrl = useMemo(() => {
    const digits = whatsappPhoneNumber.replace(/\D/g, "");
    return `https://wa.me/${digits}?text=${encodeURIComponent(whatsappText)}`;
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  useEffect(() => {
    const timers = timersRef.current;

    return () => {
      timers.forEach((timer) => clearTimeout(timer));
    };
  }, []);

  function toggleOpen() {
    setIsOpen((current) => !current);
    setTimeout(() => messagesEndRef.current?.scrollIntoView(), 50);
  }

  function selectService(serviceType: ServiceType) {
    const firstStep = flows[serviceType][0];
    const starterMessages = [
      createMessage("bot", initialMessage),
      createMessage("user", serviceType),
    ];

    setLeadData({ serviceType });
    setActiveStepIndex(0);
    setInputValue("");
    setError("");
    setIsComplete(false);
    setMessages(starterMessages);
    queueBotMessage(getStepPrompt(firstStep), starterMessages);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!leadData.serviceType || !activeStep) {
      return;
    }

    const value = inputValue.trim();
    const validationError = validateStep(activeStep, value);

    if (validationError) {
      setError(validationError);
      return;
    }

    const nextLeadData = value
      ? { ...leadData, [activeStep.field]: value }
      : leadData;
    const nextMessages: ChatMessage[] = value
      ? [...messages, createMessage("user", value)]
      : [...messages, createMessage("user", "Skip")];
    const nextStepIndex = activeStepIndex + 1;
    const nextStep = selectedFlow[nextStepIndex];

    setLeadData(nextLeadData);
    setInputValue("");
    setError("");

    if (nextStep) {
      setActiveStepIndex(nextStepIndex);
      setMessages(nextMessages);
      queueBotMessage(getStepPrompt(nextStep), nextMessages);
      return;
    }

    await submitLead(nextLeadData, nextMessages);
  }

  async function submitLead(finalLeadData: LeadData, nextMessages: ChatMessage[]) {
    setIsSubmitting(true);
    setMessages(nextMessages);
    setIsTyping(true);

    const lead = {
      serviceType: finalLeadData.serviceType,
      fromCity: finalLeadData.fromCity,
      destination: finalLeadData.destination,
      departureDate: finalLeadData.departureDate,
      returnDate: finalLeadData.returnDate,
      checkInDate: finalLeadData.checkInDate,
      checkOutDate: finalLeadData.checkOutDate,
      passengers: finalLeadData.passengers,
      guests: finalLeadData.guests,
      travelClass: finalLeadData.travelClass,
      budget: finalLeadData.budget,
      numberOfDays: finalLeadData.numberOfDays,
      country: finalLeadData.country,
      name: finalLeadData.name,
      phone: finalLeadData.phone,
      email: finalLeadData.email,
      message: finalLeadData.message,
      source: "Website Chatbot",
      createdAt: new Date().toISOString(),
    };

    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(lead),
      });
      const data = (await response.json().catch(() => ({}))) as { error?: string };

      if (!response.ok) {
        throw new Error(data.error ?? "Lead submission failed.");
      }

      setIsComplete(true);
      setIsTyping(false);
      setMessages([
        ...nextMessages,
        createMessage(
          "bot",
          "Thank you! Our travel expert will contact you shortly with the best available options.",
        ),
      ]);
    } catch (submissionError) {
      setIsTyping(false);
      setError(
        submissionError instanceof Error
          ? submissionError.message
          : "Something went wrong. Please try again.",
      );
      setMessages(nextMessages);
    } finally {
      setIsSubmitting(false);
      setTimeout(() => messagesEndRef.current?.scrollIntoView(), 50);
    }
  }

  function resetChat() {
    setLeadData({});
    setMessages([createMessage("bot", initialMessage)]);
    setActiveStepIndex(0);
    setInputValue("");
    setError("");
    setIsSubmitting(false);
    setIsComplete(false);
    setIsTyping(false);
  }

  function queueBotMessage(text: string, baseMessages: ChatMessage[]) {
    setIsTyping(true);
    const timer = setTimeout(() => {
      setMessages([...baseMessages, createMessage("bot", text)]);
      setIsTyping(false);
    }, 620);
    timersRef.current.push(timer);
  }

  return (
    <div className="pointer-events-none fixed bottom-4 right-4 z-[80] sm:bottom-6 sm:right-6">
      <div
        className={`mb-3 w-[calc(100vw-2rem)] max-w-[370px] origin-bottom-right overflow-hidden rounded-lg border border-[#075985]/14 bg-[#f8fafc] text-[#12213f] shadow-2xl shadow-[#12213f]/22 transition duration-200 sm:w-[370px] ${
          isOpen
            ? "pointer-events-auto translate-y-0 scale-100 opacity-100"
            : "pointer-events-none translate-y-4 scale-95 opacity-0"
        }`}
      >
        <div className="relative overflow-hidden bg-[#12213f] px-4 py-3.5 text-white">
          <div className="absolute inset-x-0 bottom-0 h-1 bg-[#3157d5]" />
          <div className="absolute -right-12 -top-16 h-32 w-32 rounded-full bg-[#fbbf24]/18" />
          <div className="absolute -bottom-20 left-12 h-32 w-32 rounded-full bg-[#3157d5]/16" />
          <div className="relative flex items-center justify-between gap-3">
            <div className="flex min-w-0 items-center gap-3">
              <div className="relative grid h-11 w-11 shrink-0 place-items-center rounded-full bg-[#f8fafc] text-base font-black text-[#075985] shadow-lg ring-2 ring-white/15">
                VT
                <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-[#12213f] bg-[#35d07f]" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-black leading-5">VoyagoTravels Support</p>
                <p className="mt-0.5 inline-flex rounded-full bg-white/10 px-2 py-0.5 text-[11px] font-bold text-white/80">
                  Online now
                </p>
              </div>
            </div>
            <button
              aria-label="Close travel chatbot"
              className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-white/12 text-lg font-black leading-none text-white hover:bg-white/22"
              onClick={() => setIsOpen(false)}
              type="button"
            >
              x
            </button>
          </div>
        </div>

        <div className="max-h-[52vh] min-h-[285px] overflow-y-auto bg-[#f7f1e6] px-3.5 py-4 sm:max-h-[460px]">
          <div className="space-y-2.5">
            {messages.map((message) => (
              <div
                className={`flex items-end gap-2 ${
                  message.sender === "user" ? "justify-end" : "justify-start"
                }`}
                key={message.id}
              >
                {message.sender === "bot" ? <AgentAvatar /> : null}
                <p
                  className={`max-w-[80%] px-3 py-2 text-[13px] font-semibold leading-5 shadow-sm ${
                    message.sender === "user"
                      ? "rounded-[16px] rounded-br-md bg-[#3157d5] text-white shadow-[#3157d5]/18"
                      : "rounded-[16px] rounded-bl-md border border-[#075985]/10 bg-[#fffdf8] text-[#12213f]"
                  }`}
                >
                  {message.text}
                </p>
              </div>
            ))}
            {isTyping ? (
              <div className="flex items-end gap-2">
                <AgentAvatar />
                <div className="flex items-center gap-1 rounded-[16px] rounded-bl-md border border-[#075985]/10 bg-[#fffdf8] px-3.5 py-2.5 shadow-sm">
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-[#3157d5]" />
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-[#3157d5] [animation-delay:120ms]" />
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-[#3157d5] [animation-delay:240ms]" />
                </div>
              </div>
            ) : null}
            <div ref={messagesEndRef} />
          </div>
        </div>

        <div className="border-t border-[#075985]/10 bg-[#fffdf8] p-3.5 shadow-[0_-10px_24px_rgba(23,33,31,0.04)]">
          {leadData.serviceType && !isComplete ? (
            <div className="mb-3">
              <div className="mb-1.5 flex items-center justify-between text-[11px] font-black uppercase text-[#64748b]">
                <span>{leadData.serviceType}</span>
                <span>
                  {Math.min(activeStepIndex + 1, selectedFlow.length)}/
                  {selectedFlow.length}
                </span>
              </div>
              <div className="h-1.5 overflow-hidden rounded-full bg-[#075985]/10">
                <div
                  className="h-full rounded-full bg-[#3157d5] transition-all duration-300"
                  style={{ width: `${Math.max(progressPercent, 8)}%` }}
                />
              </div>
            </div>
          ) : null}

          {!leadData.serviceType && !isComplete ? (
            <div className="grid grid-cols-2 gap-2">
              {serviceTypes.map((serviceType) => (
                <button
                  className="rounded-md border border-[#075985]/14 bg-[#f7f1e6] px-3 py-2.5 text-left text-[13px] font-black text-[#075985] shadow-sm shadow-[#12213f]/4 hover:border-[#3157d5]/50 hover:bg-white hover:text-[#c94d34]"
                  key={serviceType}
                  onClick={() => selectService(serviceType)}
                  type="button"
                >
                  {serviceType}
                </button>
              ))}
            </div>
          ) : null}

          {activeStep && !isComplete ? (
            <form className="space-y-2.5" onSubmit={handleSubmit}>
              {activeStep.choices ? (
                <div className="flex flex-wrap gap-2">
                  {activeStep.choices.map((choice) => (
                    <button
                      className="rounded-full border border-[#075985]/10 bg-[#f7f1e6] px-3 py-1.5 text-[11px] font-black text-[#075985] hover:border-[#3157d5]/40 hover:bg-[#3157d5] hover:text-white"
                      key={choice}
                      onClick={() => setInputValue(choice)}
                      type="button"
                    >
                      {choice}
                    </button>
                  ))}
                </div>
              ) : null}

              <label className="block">
                <span className="mb-1 block text-[11px] font-black uppercase text-[#64748b]">
                  {activeStep.label}
                  {activeStep.optional ? " (optional)" : ""}
                </span>
                <input
                  className="w-full rounded-md border border-[#075985]/14 bg-[#f8fafc] px-3 py-2.5 text-[13px] font-semibold outline-none placeholder:text-[#64748b]/62 focus:border-[#075985] focus:bg-white focus:ring-2 focus:ring-[#075985]/12"
                  inputMode={activeStep.type === "number" ? "numeric" : undefined}
                  onChange={(event) => setInputValue(event.target.value)}
                  placeholder={activeStep.placeholder}
                  type={activeStep.type ?? "text"}
                  value={inputValue}
                />
              </label>

              {error ? (
                <p className="rounded-md bg-[#3157d5]/10 px-3 py-2 text-xs font-bold text-[#b53e28]">
                  {error}
                </p>
              ) : null}

              <div className="flex gap-2">
                {activeStep.optional ? (
                  <button
                    className="rounded-md border border-[#075985]/18 bg-white px-4 py-2.5 text-sm font-black text-[#64748b] hover:border-[#075985] hover:text-[#075985]"
                    disabled={isSubmitting}
                    onClick={() => setInputValue("")}
                    type="submit"
                  >
                    Skip
                  </button>
                ) : null}
                <button
                  className="flex-1 rounded-md bg-[#12213f] px-4 py-2.5 text-sm font-black text-white shadow-lg shadow-[#12213f]/18 hover:bg-[#075985] disabled:cursor-not-allowed disabled:opacity-60"
                  disabled={isSubmitting || isTyping}
                  type="submit"
                >
                  {isSubmitting ? "Sending..." : "Send"}
                </button>
              </div>
            </form>
          ) : null}

          {isComplete ? (
            <div className="space-y-3">
              <a
                className="block rounded-md bg-[#18a058] px-4 py-2.5 text-center text-sm font-black text-white shadow-lg shadow-[#18a058]/18 hover:bg-[#128348]"
                href={whatsappUrl}
                rel="noreferrer"
                target="_blank"
              >
                Chat on WhatsApp
              </a>
              <button
                className="w-full rounded-md border border-[#075985]/16 bg-white px-4 py-2.5 text-sm font-black text-[#075985] hover:border-[#3157d5] hover:text-[#3157d5]"
                onClick={resetChat}
                type="button"
              >
                Start another enquiry
              </button>
            </div>
          ) : null}
        </div>
      </div>

      <button
        aria-expanded={isOpen}
        aria-label={isOpen ? "Toggle travel chatbot" : "Open travel chatbot"}
        className="pointer-events-auto group relative ml-auto grid h-16 w-16 place-items-center rounded-full bg-[#12213f] text-white shadow-xl shadow-[#12213f]/24 hover:bg-[#075985]"
        onClick={toggleOpen}
        type="button"
      >
        <span className="absolute inset-0 -z-10 rounded-full bg-[#075985]/35 blur-lg transition group-hover:bg-[#075985]/45" />
        <span className="grid h-11 w-11 place-items-center rounded-full bg-[#f8fafc] text-[#3157d5] shadow-sm">
          <svg
            aria-hidden="true"
            className="h-6 w-6"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2.4"
            viewBox="0 0 24 24"
          >
            <path d="M21 11.5a7.5 7.5 0 0 1-8 7.47 8.4 8.4 0 0 1-3.7-.96L4 20l1.54-4.36A7.5 7.5 0 1 1 21 11.5Z" />
            <path d="M8.5 11.5h.01" />
            <path d="M12 11.5h.01" />
            <path d="M15.5 11.5h.01" />
          </svg>
        </span>
      </button>
    </div>
  );
}

function AgentAvatar() {
  return (
    <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-[#12213f] text-[10px] font-black text-[#f8fafc] shadow-sm ring-2 ring-[#f8fafc]">
      VT
    </span>
  );
}

function getStepPrompt(step: FlowStep) {
  return `Please enter your ${step.label.toLowerCase()}${
    step.optional ? " (optional)" : ""
  }.`;
}

function validateStep(step: FlowStep, value: string) {
  if (step.required && !value) {
    return `${step.label} is required so our team can prepare the right options.`;
  }

  if (step.field === "email" && value && !isValidEmail(value)) {
    return "Please enter a valid email address or skip this step.";
  }

  if (step.field === "phone" && !isValidPhone(value)) {
    return "Please enter a valid phone or WhatsApp number.";
  }

  if (
    (step.type === "number" || step.field === "numberOfDays") &&
    value &&
    Number(value) <= 0
  ) {
    return `${step.label} should be greater than zero.`;
  }

  return "";
}

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function isValidPhone(value: string) {
  return value.replace(/\D/g, "").length >= 7;
}

function createMessage(sender: ChatMessage["sender"], text: string): ChatMessage {
  return {
    id: `${sender}-${Date.now()}-${Math.random().toString(16).slice(2)}`,
    sender,
    text,
  };
}
