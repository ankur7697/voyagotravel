"use client";

import { FormEvent, useEffect, useState } from "react";

type AirportOption = {
  airport: string;
  city: string;
  code: string;
  country: string;
};

type FlightResult = {
  id: string;
  flightCode: string;
  airline: string;
  status: string;
  flightDate?: string;
  departure: {
    airport?: string;
    iata?: string;
    terminal?: string | null;
    gate?: string | null;
    delay?: number | null;
    scheduled?: string | null;
  };
  arrival: {
    airport?: string;
    iata?: string;
    terminal?: string | null;
    gate?: string | null;
    delay?: number | null;
    scheduled?: string | null;
  };
};

type SearchResponse = {
  error?: string;
  availableDates?: string[];
  flights?: FlightResult[];
};

type SearchMode = "flights" | "hotels";

type HotelPlace = {
  placeId: string;
  name: string;
  secondaryText?: string;
  type?: string;
};

type HotelResult = {
  id: string;
  name: string;
  address?: string;
  starRating?: number;
  image?: string;
  price?: number;
  currency?: string;
  roomName?: string;
  refundable?: boolean;
};

type HotelPlacesResponse = {
  places?: HotelPlace[];
  error?: string;
};

type HotelSearchResponse = {
  hotels?: HotelResult[];
  error?: string;
};

const airportOptions: AirportOption[] = [
  {
    airport: "John F. Kennedy International Airport",
    city: "New York",
    code: "JFK",
    country: "United States",
  },
  {
    airport: "Los Angeles International Airport",
    city: "Los Angeles",
    code: "LAX",
    country: "United States",
  },
  {
    airport: "Hartsfield-Jackson Atlanta International Airport",
    city: "Atlanta",
    code: "ATL",
    country: "United States",
  },
  {
    airport: "Chicago O'Hare International Airport",
    city: "Chicago",
    code: "ORD",
    country: "United States",
  },
  {
    airport: "Dallas Fort Worth International Airport",
    city: "Dallas",
    code: "DFW",
    country: "United States",
  },
  {
    airport: "San Francisco International Airport",
    city: "San Francisco",
    code: "SFO",
    country: "United States",
  },
  {
    airport: "Miami International Airport",
    city: "Miami",
    code: "MIA",
    country: "United States",
  },
  {
    airport: "Seattle-Tacoma International Airport",
    city: "Seattle",
    code: "SEA",
    country: "United States",
  },
  {
    airport: "Heathrow Airport",
    city: "London",
    code: "LHR",
    country: "United Kingdom",
  },
  {
    airport: "Charles de Gaulle Airport",
    city: "Paris",
    code: "CDG",
    country: "France",
  },
  {
    airport: "Dubai International Airport",
    city: "Dubai",
    code: "DXB",
    country: "United Arab Emirates",
  },
  {
    airport: "Singapore Changi Airport",
    city: "Singapore",
    code: "SIN",
    country: "Singapore",
  },
  {
    airport: "Sydney Kingsford Smith Airport",
    city: "Sydney",
    code: "SYD",
    country: "Australia",
  },
  {
    airport: "Toronto Pearson International Airport",
    city: "Toronto",
    code: "YYZ",
    country: "Canada",
  },
  {
    airport: "Tokyo Haneda Airport",
    city: "Tokyo",
    code: "HND",
    country: "Japan",
  },
  {
    airport: "Doha Hamad International Airport",
    city: "Doha",
    code: "DOH",
    country: "Qatar",
  },
];

export default function FlightSearch() {
  const [mode, setMode] = useState<SearchMode>("flights");
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [departureDate, setDepartureDate] = useState(() => getTodayDate());
  const [message, setMessage] = useState("");
  const [results, setResults] = useState<FlightResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hotelDestinationText, setHotelDestinationText] = useState("");
  const [selectedHotelPlace, setSelectedHotelPlace] =
    useState<HotelPlace | null>(null);
  const [hotelPlaces, setHotelPlaces] = useState<HotelPlace[]>([]);
  const [hotelCheckin, setHotelCheckin] = useState(() => getFutureDate(30));
  const [hotelCheckout, setHotelCheckout] = useState(() => getFutureDate(33));
  const [hotelAdults, setHotelAdults] = useState(2);
  const [hotelRooms, setHotelRooms] = useState(1);
  const [hotelResults, setHotelResults] = useState<HotelResult[]>([]);
  const [hotelMessage, setHotelMessage] = useState("");
  const [isHotelPlaceLoading, setIsHotelPlaceLoading] = useState(false);
  const [isHotelLoading, setIsHotelLoading] = useState(false);
  const [selectedHotel, setSelectedHotel] = useState<HotelResult | null>(null);

  useEffect(() => {
    if (
      hotelDestinationText.trim().length < 2 ||
      selectedHotelPlace?.name === hotelDestinationText
    ) {
      return;
    }

    const timer = window.setTimeout(async () => {
      setIsHotelPlaceLoading(true);

      try {
        const response = await fetch(
          `/api/hotels/places?query=${encodeURIComponent(hotelDestinationText)}`,
        );
        const data = (await response.json()) as HotelPlacesResponse;

        if (!response.ok) {
          throw new Error(data.error ?? "Hotel destination search failed.");
        }

        setHotelPlaces(data.places ?? []);
      } catch (error) {
        setHotelMessage(
          error instanceof Error
            ? error.message
            : "Hotel destination search failed.",
        );
      } finally {
        setIsHotelPlaceLoading(false);
      }
    }, 350);

    return () => window.clearTimeout(timer);
  }, [hotelDestinationText, selectedHotelPlace?.name]);

  function handleClear() {
    setOrigin("");
    setDestination("");
    setDepartureDate(getTodayDate());
    setMessage("");
    setResults([]);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);
    setMessage("");
    setResults([]);

    try {
      const response = await fetch("/api/flights", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          origin: getAirportCode(origin),
          destination: getAirportCode(destination),
          departureDate: departureDate || undefined,
        }),
      });

      const data = (await response.json().catch(() => ({}))) as SearchResponse;

      if (!response.ok) {
        setMessage(data.error ?? "Flight search failed. Please try again.");
        return;
      }

      setResults(data.flights ?? []);
      setMessage(
        data.flights?.length
          ? `Flights found from ${getAirportCode(origin)} to ${getAirportCode(destination)}`
          : getEmptyMessage(departureDate, data.availableDates),
      );
    } catch {
      setMessage("Flight search is temporarily unavailable. Please check your connection or try again.");
    } finally {
      setIsLoading(false);
    }
  }

  async function handleHotelSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setHotelMessage("");
    setHotelResults([]);
    setSelectedHotel(null);

    if (!selectedHotelPlace?.placeId) {
      setHotelMessage("Please select a hotel destination from the suggestions.");
      return;
    }

    if (hotelCheckout <= hotelCheckin) {
      setHotelMessage("Check-out date must be after check-in date.");
      return;
    }

    setIsHotelLoading(true);

    const response = await fetch("/api/hotels/search", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        placeId: selectedHotelPlace.placeId,
        checkin: hotelCheckin,
        checkout: hotelCheckout,
        currency: "USD",
        guestNationality: "IN",
        occupancies: [{ adults: hotelAdults, rooms: hotelRooms }],
        limit: 8,
        maxRatesPerHotel: 1,
        timeout: 3,
      }),
    });
    const data = (await response.json().catch(() => ({}))) as HotelSearchResponse;

    setIsHotelLoading(false);

    if (!response.ok) {
      setHotelMessage(data.error ?? "Hotel search failed. Please try again.");
      return;
    }

    setHotelResults(data.hotels ?? []);
    setHotelMessage(
      data.hotels?.length
        ? `Hotels available in ${selectedHotelPlace.name}`
        : "No hotels found for this destination and date range.",
    );
  }

  function clearHotelSearchResults() {
    setHotelResults([]);
    setHotelMessage("");
    setSelectedHotel(null);
  }

  function switchMode(nextMode: SearchMode) {
    setMode(nextMode);

    if (nextMode !== "hotels") {
      clearHotelSearchResults();
    }

    if (nextMode !== "flights") {
      handleClear();
    }
  }

  const hasExpandedFlightResults = mode === "flights" && results.length > 0;
  const hasExpandedHotelResults = mode === "hotels" && hotelResults.length > 0;
  const hasExpandedResults = hasExpandedFlightResults || hasExpandedHotelResults;

  return (
    <section id="flights" className="bg-[#f8fbff] px-4 py-14 text-white sm:px-8 sm:py-20">
      <div
        className={`mx-auto grid max-w-7xl gap-8 ${
          hasExpandedResults
            ? "lg:grid-cols-1"
            : "2xl:grid-cols-[0.62fr_1.38fr] 2xl:items-start"
        }`}
      >
        <div
          className={
            hasExpandedResults
              ? "max-w-4xl"
              : undefined
          }
        >
          <p className="mb-3 text-xs font-black uppercase tracking-[0.2em] text-[#3157d5] sm:mb-4 sm:text-sm">
            Fare and stay desk
          </p>
          <h2 className="text-3xl font-black leading-tight sm:text-5xl">
            Search flights and hotels before we build your quote.
          </h2>
          <p className="mt-4 max-w-2xl text-sm leading-6 text-white/68 sm:mt-6 sm:text-lg sm:leading-8">
            Use this desk for a quick availability check. Our consultant can
            then verify supplier terms, cancellation rules, and booking steps.
          </p>
          <div className="mt-8 hidden border-l border-white/16 pl-5 text-sm font-bold leading-7 text-white/62 2xl:block">
            <p>Flight route lookup</p>
            <p>Hotel city and stay search</p>
            <p>Callback handoff by phone or WhatsApp</p>
          </div>
        </div>

        <div className="relative z-10 overflow-visible rounded-[2.25rem] border border-white/12 bg-[#ffffff] text-white shadow-2xl shadow-black/25">
          <div className="grid lg:grid-cols-[210px_1fr]">
            <div className="border-b border-white/10 bg-white/[0.04] p-4 lg:border-b-0 lg:border-r lg:p-5">
              <p className="mb-4 text-[11px] font-black uppercase tracking-[0.2em] text-[#3157d5]">
                Select service
              </p>
              <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-1">
                <button
                  className={`min-h-20 rounded-[1.25rem] border p-4 text-left transition ${
                    mode === "flights"
                      ? "border-[#3157d5] bg-[#3157d5] text-[#f8fbff]"
                      : "border-white/12 bg-white/6 text-white hover:border-white/30"
                  }`}
                  onClick={() => switchMode("flights")}
                  type="button"
                >
                  <span className="block text-lg font-black">Flights</span>
                  <span className="mt-1 block text-xs font-bold opacity-70">
                    Route, airline, timing
                  </span>
                </button>
                <button
                  className={`min-h-20 rounded-[1.25rem] border p-4 text-left transition ${
                    mode === "hotels"
                      ? "border-[#3157d5] bg-[#3157d5] text-[#f8fbff]"
                      : "border-white/12 bg-white/6 text-white hover:border-white/30"
                  }`}
                  onClick={() => switchMode("hotels")}
                  type="button"
                >
                  <span className="block text-lg font-black">Hotels</span>
                  <span className="mt-1 block text-xs font-bold opacity-70">
                    Stays, rooms, guests
                  </span>
                </button>
              </div>
            </div>

            <div className="p-4 sm:p-7">
              <div className="mb-6 flex flex-col gap-2 border-b border-white/10 pb-5 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="text-[11px] font-black uppercase tracking-[0.18em] text-[#ff7a59]">
                    {mode === "flights" ? "Route check" : "Stay check"}
                  </p>
                  <p className="mt-1 text-2xl font-black text-white">
                    {mode === "flights"
                      ? "Find flight availability"
                      : "Find hotel availability"}
                  </p>
                </div>
                <p className="text-xs font-bold text-white/52">
                  {mode === "flights"
                    ? "Origin, destination, date"
                    : "Destination, dates, guests"}
                </p>
              </div>

          {mode === "flights" ? (
            <form className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-8" onSubmit={handleSubmit}>
              <AirportInput
                label="From"
                onChange={setOrigin}
                placeholder="City or airport, e.g. Delhi or DEL"
                value={origin}
              />
              <AirportInput
                label="To"
                onChange={setDestination}
                placeholder="City or airport, e.g. Dubai or DXB"
                value={destination}
              />
              <label className="min-w-0 lg:col-span-2">
                <span className="mb-2 block whitespace-nowrap text-sm font-black text-white/78">
                  Depart
                </span>
                <input
                  className="h-12 w-full min-w-0 rounded-[1rem] border border-white/12 bg-white/8 px-3 text-sm font-bold text-white outline-none transition [color-scheme:dark] focus:border-[#3157d5] focus:bg-white/12 focus:ring-2 focus:ring-[#3157d5]/15 sm:h-14 sm:px-4"
                  onChange={(event) => setDepartureDate(event.target.value)}
                  type="date"
                  value={departureDate}
                />
              </label>
              <button
                className="h-12 rounded-[1rem] bg-[#ff7a59] px-5 text-base font-black text-white shadow-lg shadow-black/20 transition hover:-translate-y-0.5 hover:bg-[#e85d3f] disabled:cursor-not-allowed disabled:translate-y-0 disabled:opacity-65 sm:h-14 sm:text-lg lg:col-span-2 lg:self-end"
                disabled={isLoading}
                type="submit"
              >
                {isLoading ? "Searching..." : "Search Flights"}
              </button>
            </form>
          ) : (
            <form
              className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-12 lg:items-end"
              onSubmit={handleHotelSubmit}
            >
              <HotelDestinationInput
                isLoading={isHotelPlaceLoading}
                onChange={(value) => {
                  setHotelDestinationText(value);
                  setSelectedHotelPlace(null);
                  clearHotelSearchResults();
                  if (value.trim().length < 2) {
                    setHotelPlaces([]);
                  }
                }}
                onSelect={(place) => {
                  setSelectedHotelPlace(place);
                  setHotelDestinationText(place.name);
                  setHotelPlaces([]);
                  clearHotelSearchResults();
                }}
                places={hotelPlaces}
                value={hotelDestinationText}
              />
              <DateInput
                label="Check-in"
                onChange={(value) => {
                  setHotelCheckin(value);
                  clearHotelSearchResults();
                }}
                value={hotelCheckin}
              />
              <DateInput
                label="Check-out"
                onChange={(value) => {
                  setHotelCheckout(value);
                  clearHotelSearchResults();
                }}
                value={hotelCheckout}
              />
              <NumberInput
                label="Adults"
                min={1}
                onChange={(value) => {
                  setHotelAdults(value);
                  clearHotelSearchResults();
                }}
                value={hotelAdults}
              />
              <NumberInput
                label="Rooms"
                min={1}
                onChange={(value) => {
                  setHotelRooms(value);
                  clearHotelSearchResults();
                }}
                value={hotelRooms}
              />
              <button
                className="h-11 w-full min-w-0 rounded-[1rem] bg-[#ff7a59] px-4 text-center text-sm font-black text-white shadow-lg shadow-black/20 transition hover:-translate-y-0.5 hover:bg-[#e85d3f] disabled:translate-y-0 disabled:cursor-not-allowed sm:col-span-2 sm:h-12 lg:col-span-3 lg:self-end"
                disabled={isHotelLoading || !selectedHotelPlace}
                type="submit"
              >
                {isHotelLoading ? "Searching..." : "Search Hotels"}
              </button>
            </form>
          )}

          {mode === "flights" && message ? (
            <div className="mt-6 overflow-hidden rounded-[1.25rem] border border-white/12 bg-white/8 shadow-sm">
              <div className="flex flex-col gap-4 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0">
                  <p className="text-xs font-black uppercase tracking-[0.14em] text-[#3157d5]">
                    Flight availability
                  </p>
                  <h3 className="mt-1 max-w-full break-words text-xl font-black leading-tight text-white [overflow-wrap:anywhere] sm:text-2xl">
                    {message}
                  </h3>
                  {results.length ? (
                    <p className="mt-2 text-sm font-bold text-white/62">
                      {departureDate} · {results.length} flight
                      {results.length === 1 ? "" : "s"} returned
                    </p>
                  ) : null}
                </div>
                <button
                  className="w-fit shrink-0 rounded-full border border-white/16 bg-white/10 px-3 py-2 text-sm font-black text-white hover:border-[#3157d5] hover:text-[#3157d5]"
                  onClick={handleClear}
                  type="button"
                >
                  Clear
                </button>
              </div>
            </div>
          ) : null}

          {mode === "hotels" && hotelMessage ? (
            <div className="mt-6 overflow-hidden rounded-[1.25rem] border border-white/12 bg-white/8 shadow-sm">
              <div className="grid gap-4 p-4 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center">
                <div className="min-w-0">
                  <p className="text-xs font-black uppercase tracking-[0.14em] text-[#3157d5]">
                    Hotel availability
                  </p>
                  <h3 className="mt-1 max-w-full break-words text-xl font-black leading-tight text-white [overflow-wrap:anywhere] sm:text-2xl">
                    {hotelMessage}
                  </h3>
                  {hotelResults.length ? (
                    <div className="mt-3 flex min-w-0 flex-wrap gap-2 text-xs font-black text-white/72">
                      <span className="max-w-full break-words rounded-full bg-white/10 px-3 py-2 shadow-sm [overflow-wrap:anywhere]">
                        {hotelCheckin} to {hotelCheckout}
                      </span>
                      <span className="max-w-full break-words rounded-full bg-white/10 px-3 py-2 shadow-sm [overflow-wrap:anywhere]">
                        {hotelAdults} adult{hotelAdults === 1 ? "" : "s"}
                      </span>
                      <span className="max-w-full break-words rounded-full bg-white/10 px-3 py-2 shadow-sm [overflow-wrap:anywhere]">
                        {hotelRooms} room{hotelRooms === 1 ? "" : "s"}
                      </span>
                    </div>
                  ) : null}
                </div>
                {hotelResults.length ? (
                  <div className="flex flex-wrap items-center gap-3">
                    <div className="shrink-0 rounded-[1rem] bg-[#3157d5] px-4 py-3 text-[#f8fbff] shadow-lg shadow-black/15">
                      <p className="text-3xl font-black">{hotelResults.length}</p>
                      <p className="text-xs font-black uppercase opacity-72">
                        available
                      </p>
                    </div>
                    <button
                      className="rounded-full border border-white/16 bg-white/10 px-3 py-2 text-sm font-black text-white hover:border-[#3157d5] hover:text-[#3157d5]"
                      onClick={clearHotelSearchResults}
                      type="button"
                    >
                      Clear
                    </button>
                  </div>
                ) : null}
              </div>
            </div>
          ) : null}

          {mode === "flights" && results.length ? (
            <div className="mt-6 space-y-3">
              {results.map((result) => (
                <div
                  className="grid overflow-hidden rounded-[1.25rem] border border-white/12 bg-white text-[#12213f] shadow-sm lg:grid-cols-[220px_1fr_auto] lg:items-stretch"
                  key={`flight-${result.id}`}
                >
                  <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#12213f]/10 bg-[#eff6ff] px-4 py-3 lg:block lg:border-b-0 lg:border-r lg:py-5">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-black text-[#12213f]">
                        {result.airline}
                      </p>
                      <p className="mt-1 text-xs font-bold text-[#64748b]">
                        {result.flightCode}
                      </p>
                    </div>
                    <span className={`rounded-full px-3 py-1 text-xs font-black lg:mt-4 lg:inline-block ${getStatusClass(result.status)}`}>
                      {formatStatus(result.status)}
                    </span>
                  </div>

                  <div className="grid gap-4 p-4 sm:grid-cols-[1fr_auto_1fr] sm:items-center lg:px-6">
                    <AirportBlock
                      airport={result.departure.airport}
                      code={result.departure.iata ?? "DEP"}
                      delay={result.departure.delay}
                      label="Departure"
                      time={result.departure.scheduled}
                    />

                    <div className="hidden min-w-24 items-center justify-center sm:flex">
                      <div className="h-px w-10 bg-[#12213f]/20" />
                      <div className="grid h-9 w-9 place-items-center rounded-full bg-[#12213f] text-xs font-black text-white">
                        To
                      </div>
                      <div className="h-px w-10 bg-[#12213f]/20" />
                    </div>

                    <AirportBlock
                      airport={result.arrival.airport}
                      code={result.arrival.iata ?? "ARR"}
                      delay={result.arrival.delay}
                      label="Arrival"
                      time={result.arrival.scheduled}
                    />
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[#12213f]/10 px-4 py-3 lg:block lg:border-l lg:border-t-0 lg:py-5">
                    <p className="text-xs font-bold text-[#64748b]">
                      Flight date: {result.flightDate ?? "Not listed"}
                    </p>
                    <a
                      className="rounded-full bg-[#ff7a59] px-4 py-3 text-sm font-black text-white hover:bg-[#e85d3f] lg:mt-4 lg:inline-block"
                      href="tel:+17078028394"
                    >
                      Book this flight
                    </a>
                  </div>
                </div>
              ))}
            </div>
          ) : null}

          {mode === "hotels" && hotelResults.length ? (
            <div
              className={`mt-5 grid gap-4 ${
                hasExpandedHotelResults
                  ? "lg:grid-cols-[repeat(2,minmax(0,1fr))] xl:grid-cols-[repeat(3,minmax(0,1fr))]"
                  : "lg:grid-cols-[repeat(2,minmax(0,1fr))]"
              }`}
            >
              {hotelResults.map((hotel) => (
                <HotelResultCard
                  hotel={hotel}
                  key={hotel.id}
                  onViewDetails={setSelectedHotel}
                />
              ))}
            </div>
          ) : null}
            </div>
          </div>
        </div>
      </div>
      {selectedHotel ? (
        <HotelDetailsModal
          hotel={selectedHotel}
          onClose={() => setSelectedHotel(null)}
        />
      ) : null}
    </section>
  );
}

function AirportBlock({
  airport,
  code,
  delay,
  label,
  time,
}: {
  airport?: string;
  code: string;
  delay?: number | null;
  label: string;
  time?: string | null;
}) {
  return (
    <div className="min-w-0">
      <p className="text-xs font-black uppercase tracking-[0.14em] text-[#ff7a59]">
        {label}
      </p>
      <div className="mt-2 flex items-baseline gap-3">
        <p className="text-3xl font-black text-[#12213f]">{code}</p>
        <p className="text-base font-black text-[#12213f]">
          {formatTime(time)}
          {formatDelay(delay)}
        </p>
      </div>
      <p className="mt-2 line-clamp-2 text-sm font-bold leading-6 text-[#64748b]">
        {airport ?? "Airport not listed"}
      </p>
      <p className="mt-1 text-xs font-bold text-[#475569]">
        {formatDate(time)}
      </p>
    </div>
  );
}

function AirportInput({
  label,
  onChange,
  placeholder,
  value,
}: {
  label: string;
  onChange: (value: string) => void;
  placeholder: string;
  value: string;
}) {
  const [isFocused, setIsFocused] = useState(false);
  const suggestions = getAirportSuggestions(value);
  const inputId = `flight-${label.toLowerCase()}-airport`;

  function selectAirport(airport: AirportOption) {
    onChange(formatAirportSelection(airport));
    setIsFocused(false);
  }

  return (
    <div className="block min-w-0 lg:col-span-2">
      <label className="mb-2 flex items-center justify-between gap-2 text-sm font-black text-white/78" htmlFor={inputId}>
        {label}
        <span className="text-[11px] font-bold uppercase tracking-[0.08em] text-white/42">
          Airport / City
        </span>
      </label>
      <input
        aria-label={label}
        autoComplete="off"
        className="pointer-events-auto h-12 w-full touch-manipulation rounded-[1rem] border border-white/12 bg-white/8 px-3 text-base font-black text-white outline-none transition placeholder:text-white/35 focus:border-[#3157d5] focus:bg-white/12 focus:ring-2 focus:ring-[#3157d5]/15 sm:h-14 sm:px-4 sm:text-sm"
        id={inputId}
        onBlur={() => {
          window.setTimeout(() => setIsFocused(false), 260);
        }}
        onChange={(event) => onChange(event.target.value)}
        onFocus={() => setIsFocused(true)}
        placeholder={placeholder}
        required
        spellCheck={false}
        type="text"
        value={value}
      />
      {isFocused && suggestions.length ? (
        <div className="mt-2 max-h-64 overflow-y-auto rounded-[1rem] border border-white/12 bg-[#ffffff] p-2 shadow-lg shadow-black/20">
          {suggestions.map((airport) => (
            <button
              className="flex w-full touch-manipulation items-center justify-between gap-3 rounded-[0.75rem] px-3 py-3 text-left hover:bg-white/8"
              key={`${label}-${airport.code}`}
              onMouseDown={(event) => event.preventDefault()}
              onPointerDown={(event) => {
                event.preventDefault();
                selectAirport(airport);
              }}
              onClick={() => {
                selectAirport(airport);
              }}
              type="button"
            >
              <span className="min-w-0">
                <span className="block truncate text-sm font-black text-white">
                  {airport.city}, {airport.country}
                </span>
                <span className="mt-1 block truncate text-xs font-bold text-[#64748b]">
                  {airport.airport}
                </span>
              </span>
              <span className="shrink-0 rounded-full bg-[#3157d5] px-3 py-2 text-sm font-black text-[#f8fbff]">
                {airport.code}
              </span>
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}

function HotelDestinationInput({
  isLoading,
  onChange,
  onSelect,
  places,
  value,
}: {
  isLoading: boolean;
  onChange: (value: string) => void;
  onSelect: (place: HotelPlace) => void;
  places: HotelPlace[];
  value: string;
}) {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div className="relative block min-w-0 sm:col-span-2 lg:col-span-4">
      <label className="mb-2 flex items-center justify-between gap-2 text-sm font-black text-white/78" htmlFor="hotel-place">
        Destination
        <span className="text-[11px] font-bold uppercase tracking-[0.08em] text-white/42">
          City / Hotel
        </span>
      </label>
      <input
        autoComplete="off"
        className="h-12 w-full rounded-[1rem] border border-white/12 bg-white/8 px-3 text-base font-black text-white outline-none transition placeholder:text-white/35 focus:border-[#3157d5] focus:bg-white/12 focus:ring-2 focus:ring-[#3157d5]/15 sm:h-14 sm:px-4"
        id="hotel-place"
        onBlur={() => window.setTimeout(() => setIsFocused(false), 220)}
        onChange={(event) => onChange(event.target.value)}
        onFocus={() => setIsFocused(true)}
        placeholder="City, airport, or hotel"
        type="text"
        value={value}
      />
      {isFocused && value.trim().length >= 2 ? (
        <div className="absolute left-0 right-0 top-[calc(100%+0.5rem)] z-[100] max-h-72 min-w-0 overflow-y-auto rounded-[1rem] border border-white/12 bg-[#ffffff] p-2 shadow-2xl shadow-black/25">
          {isLoading ? (
            <p className="px-3 py-3 text-sm font-bold text-white/62">
              Searching destinations...
            </p>
          ) : places.length ? (
            places.map((place) => (
              <button
                className="flex w-full min-w-0 items-start justify-between gap-3 rounded-[0.75rem] px-3 py-2.5 text-left hover:bg-white/8"
                key={place.placeId}
                onMouseDown={(event) => event.preventDefault()}
                onPointerDown={(event) => {
                  event.preventDefault();
                  onSelect(place);
                  setIsFocused(false);
                }}
                onClick={() => {
                  onSelect(place);
                  setIsFocused(false);
                }}
                type="button"
              >
                <span className="min-w-0 flex-1">
                  <span className="block break-words text-sm font-black text-white [overflow-wrap:anywhere]">
                    {place.name}
                  </span>
                  <span className="mt-0.5 block break-words text-xs font-bold text-[#64748b] [overflow-wrap:anywhere]">
                    {place.secondaryText || place.type || "Location"}
                  </span>
                </span>
                <span className="max-w-24 shrink-0 break-words rounded-full bg-[#3157d5] px-2.5 py-1.5 text-[11px] font-black uppercase text-[#f8fbff] [overflow-wrap:anywhere]">
                  {place.type || "place"}
                </span>
              </button>
            ))
          ) : (
            <p className="px-3 py-3 text-sm font-bold text-white/62">
              No matching locations found.
            </p>
          )}
        </div>
      ) : null}
    </div>
  );
}

function DateInput({
  label,
  onChange,
  value,
}: {
  label: string;
  onChange: (value: string) => void;
  value: string;
}) {
  return (
    <label className="min-w-0 lg:col-span-3">
      <span className="mb-2 block whitespace-nowrap text-sm font-black text-white/78">
        {label}
      </span>
      <input
        className="h-12 w-full min-w-0 rounded-[1rem] border border-white/12 bg-white/8 px-3 text-sm font-bold text-white outline-none transition [color-scheme:dark] focus:border-[#3157d5] focus:bg-white/12 focus:ring-2 focus:ring-[#3157d5]/15 sm:h-14 sm:px-4"
        onChange={(event) => onChange(event.target.value)}
        type="date"
        value={value}
      />
    </label>
  );
}

function NumberInput({
  label,
  min,
  onChange,
  value,
}: {
  label: string;
  min: number;
  onChange: (value: number) => void;
  value: number;
}) {
  return (
    <label className="min-w-0 lg:col-span-2">
      <span className="mb-2 block text-sm font-black text-white/78">{label}</span>
      <input
        className="h-12 w-full rounded-[1rem] border border-white/12 bg-white/8 px-3 text-base font-bold text-white outline-none transition focus:border-[#3157d5] focus:bg-white/12 focus:ring-2 focus:ring-[#3157d5]/15 sm:h-14 sm:px-4"
        min={min}
        onChange={(event) => onChange(Number(event.target.value))}
        type="number"
        value={value}
      />
    </label>
  );
}

function HotelResultCard({
  hotel,
  onViewDetails,
}: {
  hotel: HotelResult;
  onViewDetails: (hotel: HotelResult) => void;
}) {
  return (
    <article className="min-w-0 overflow-hidden rounded-lg border border-[#12213f]/10 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-xl hover:shadow-[#12213f]/10">
      <div
        className="relative min-h-[190px] bg-[#12213f]/10 bg-cover bg-center"
        style={{
          backgroundImage: `url("${hotel.image || "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=900&q=84"}")`,
        }}
      >
        <div className="absolute left-3 top-3 rounded-md bg-white/94 px-3 py-2 text-xs font-black text-[#12213f] shadow-sm">
          {hotel.starRating ? `${Math.round(hotel.starRating)} star` : "Rating TBA"}
        </div>
        {typeof hotel.refundable === "boolean" ? (
          <div className="absolute bottom-3 left-3 rounded-md bg-[#12213f]/86 px-3 py-2 text-xs font-black text-[#ffffff]">
            {hotel.refundable ? "Refundable" : "Non-refundable"}
          </div>
        ) : null}
      </div>
      <div className="p-4">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <h3 className="break-words text-xl font-black leading-tight text-[#12213f] [overflow-wrap:anywhere]">
              {hotel.name}
            </h3>
            <p className="mt-2 break-words text-sm font-bold leading-6 text-[#64748b] [overflow-wrap:anywhere]">
              {hotel.address || "Location available on request"}
            </p>
          </div>
        </div>
        <div className="mt-4 flex min-w-0 flex-wrap gap-2 text-xs font-black text-[#475569]">
          <span className="max-w-full break-words rounded-md bg-[#eff6ff] px-3 py-2 [overflow-wrap:anywhere]">
            {hotel.roomName || "Room details available"}
          </span>
        </div>
        <div className="mt-5 flex min-w-0 flex-wrap items-center justify-between gap-4 border-t border-[#12213f]/10 pt-4">
          <HotelPriceBlock hotel={hotel} />
          <button
            className="max-w-full break-words rounded-md bg-[#12213f] px-4 py-3 text-sm font-black text-[#ffffff] hover:bg-[#12213f] [overflow-wrap:anywhere]"
            onClick={() => onViewDetails(hotel)}
            type="button"
          >
            View Details
          </button>
        </div>
      </div>
    </article>
  );
}

function HotelDetailsModal({
  hotel,
  onClose,
}: {
  hotel: HotelResult;
  onClose: () => void;
}) {
  const whatsappText = encodeURIComponent(
    `Hi, I want details for ${hotel.name} on Voyagoglobal.`,
  );

  return (
    <div className="fixed inset-0 z-[90] flex items-end bg-[#12213f]/62 px-4 py-4 backdrop-blur-sm sm:items-center sm:justify-center">
      <div className="max-h-[92vh] w-full max-w-3xl min-w-0 overflow-y-auto rounded-lg bg-white text-[#12213f] shadow-2xl">
        <div
          className="relative min-h-[220px] bg-[#12213f]/10 bg-cover bg-center sm:min-h-[320px]"
          style={{
            backgroundImage: `url("${hotel.image || "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=84"}")`,
          }}
        >
          <button
            aria-label="Close hotel details"
            className="absolute right-4 top-4 grid h-10 w-10 place-items-center rounded-full bg-white/92 text-lg font-black text-[#12213f] shadow-lg hover:bg-white"
            onClick={onClose}
            type="button"
          >
            x
          </button>
        </div>
        <div className="p-5 sm:p-7">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
            <div className="min-w-0">
              <p className="text-xs font-black uppercase tracking-[0.14em] text-[#ff7a59]">
                Hotel details
              </p>
              <h3 className="mt-2 break-words text-2xl font-black leading-tight text-[#12213f] [overflow-wrap:anywhere] sm:text-3xl">
                {hotel.name}
              </h3>
              <p className="mt-3 break-words text-sm font-bold leading-6 text-[#64748b] [overflow-wrap:anywhere]">
                {hotel.address || "Location available on request"}
              </p>
            </div>
            <span className="w-fit shrink-0 rounded-md bg-[#fbbf24]/25 px-3 py-2 text-xs font-black text-[#715010]">
              {hotel.starRating ? `${Math.round(hotel.starRating)} star` : "Rating TBA"}
            </span>
          </div>

          <div className="mt-6 border-y border-[#12213f]/10 py-5">
            <p className="text-xs font-black uppercase tracking-[0.14em] text-[#64748b]">
              Approx. total
            </p>
            <p className="mt-2 break-words text-4xl font-black leading-none text-[#ff7a59] [overflow-wrap:anywhere] sm:text-5xl">
              <span className="mr-2 align-middle text-base text-[#e85d3f]">
                {hotel.currency || "USD"}
              </span>
              {formatHotelPrice(hotel.price)}
            </p>
            <p className="mt-2 text-xs font-bold text-[#64748b]">
              Live rate from the current hotel availability search.
            </p>
          </div>

          <div className="mt-6 grid min-w-0 gap-3 sm:grid-cols-[repeat(2,minmax(0,1fr))]">
            <HotelDetailItem
              label="Room"
              value={hotel.roomName || "Room details available"}
            />
            <HotelDetailItem
              label="Cancellation"
              value={
                typeof hotel.refundable === "boolean"
                  ? hotel.refundable
                    ? "Refundable"
                    : "Non-refundable"
                  : "Policy available on request"
              }
            />
            <HotelDetailItem
              label="Currency"
              value={hotel.currency || "USD"}
            />
            <HotelDetailItem label="Hotel ID" value={hotel.id} />
          </div>

          <div className="mt-6 rounded-lg bg-[#eff6ff] p-4">
            <p className="text-sm font-black text-[#12213f]">
              Rate note
            </p>
            <p className="mt-2 text-sm font-bold leading-6 text-[#64748b]">
              Prices and rooms are live search results and may change until the
              booking is confirmed by the travel team.
            </p>
          </div>

          <div className="mt-6 flex min-w-0 flex-col gap-3 sm:flex-row sm:flex-wrap">
            <a
              className="max-w-full break-words rounded-md bg-[#18a058] px-5 py-3 text-center text-sm font-black text-white hover:bg-[#128348] [overflow-wrap:anywhere]"
              href={`https://wa.me/17078028394?text=${whatsappText}`}
              rel="noreferrer"
              target="_blank"
            >
              Ask on WhatsApp
            </a>
            <a
              className="max-w-full break-words rounded-md bg-[#12213f] px-5 py-3 text-center text-sm font-black text-white hover:bg-[#12213f] [overflow-wrap:anywhere]"
              href="tel:+17078028394"
            >
              Call Travel Expert
            </a>
            <button
              className="max-w-full break-words rounded-md border border-[#12213f]/15 px-5 py-3 text-sm font-black text-[#12213f] hover:border-[#ff7a59] hover:text-[#ff7a59] [overflow-wrap:anywhere]"
              onClick={onClose}
              type="button"
            >
              Back to Results
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function HotelDetailItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0 rounded-lg border border-[#12213f]/10 bg-[#fbfaf6] p-4">
      <p className="break-words text-xs font-black uppercase tracking-[0.12em] text-[#ff7a59] [overflow-wrap:anywhere]">
        {label}
      </p>
      <p className="mt-2 break-words text-sm font-black leading-6 text-[#12213f] [overflow-wrap:anywhere]">
        {value}
      </p>
    </div>
  );
}

function HotelPriceBlock({ hotel }: { hotel: HotelResult }) {
  return (
    <div className="min-w-0">
      <p className="text-[11px] font-black uppercase tracking-[0.12em] text-[#64748b]">
        From
      </p>
      <p className="mt-1 break-words text-3xl font-black leading-none text-[#ff7a59] [overflow-wrap:anywhere]">
        <span className="mr-1 align-middle text-xs text-[#e85d3f]">
          {hotel.currency || "USD"}
        </span>
        {formatHotelPrice(hotel.price)}
      </p>
      <p className="mt-1 text-[11px] font-bold text-[#64748b]">
        approx. total
      </p>
    </div>
  );
}

function formatHotelPrice(price?: number) {
  return price ? Math.round(price).toLocaleString("en-US") : "TBA";
}

function getAirportSuggestions(value: string) {
  const query = value.trim().toLowerCase();

  if (!query) {
    return airportOptions.slice(0, 6);
  }

  return airportOptions
    .filter((airport) => {
      return [
        airport.airport,
        airport.city,
        airport.code,
        airport.country,
      ].some((field) => field.toLowerCase().includes(query));
    })
    .slice(0, 6);
}

function formatAirportSelection(airport: AirportOption) {
  return `${airport.city} (${airport.code})`;
}

function getAirportCode(value: string) {
  const parenthesizedCode = value.match(/\(([A-Za-z]{3})\)/);

  if (parenthesizedCode?.[1]) {
    return parenthesizedCode[1].toUpperCase();
  }

  const directCode = value.trim().match(/^[A-Za-z]{3}$/);

  if (directCode?.[0]) {
    return directCode[0].toUpperCase();
  }

  const matchedAirport = airportOptions.find((airport) => {
    const normalizedValue = value.trim().toLowerCase();

    return (
      airport.city.toLowerCase() === normalizedValue ||
      airport.airport.toLowerCase() === normalizedValue
    );
  });

  return matchedAirport?.code ?? value.trim().toUpperCase();
}

function getTodayDate() {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function getFutureDate(daysAhead: number) {
  const date = new Date();
  date.setDate(date.getDate() + daysAhead);

  return date.toISOString().slice(0, 10);
}

function formatTime(value?: string | null) {
  if (!value) {
    return "time TBA";
  }

  return new Intl.DateTimeFormat("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    day: "2-digit",
    month: "short",
  }).format(new Date(value));
}

function formatDate(value?: string | null) {
  if (!value) {
    return "Date TBA";
  }

  return new Intl.DateTimeFormat("en-IN", {
    weekday: "short",
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}

function formatDelay(value?: number | null) {
  return typeof value === "number" && value > 0 ? ` +${value}m` : "";
}

function formatStatus(value: string) {
  const normalized = value.toLowerCase();

  const labels: Record<string, string> = {
    active: "In flight",
    scheduled: "Scheduled",
    landed: "Landed",
    cancelled: "Cancelled",
    incident: "Incident",
    diverted: "Diverted",
    unknown: "Status unavailable",
  };

  return labels[normalized] ?? "Status unavailable";
}

function getStatusClass(value: string) {
  const normalized = value.toLowerCase();

  if (normalized === "active") {
    return "bg-[#12213f]/10 text-[#12213f]";
  }

  if (normalized === "scheduled") {
    return "bg-[#fbbf24]/25 text-[#715010]";
  }

  if (normalized === "landed") {
    return "bg-[#12213f]/10 text-[#12213f]";
  }

  if (normalized === "cancelled" || normalized === "incident") {
    return "bg-[#ff7a59]/12 text-[#d94b35]";
  }

  return "bg-[#64748b]/12 text-[#475569]";
}

function getEmptyMessage(selectedDate: string, availableDates?: string[]) {
  if (!selectedDate) {
    return "Search completed, but no matching flights were returned.";
  }

  if (!availableDates?.length) {
    return "No flights were returned for this route.";
  }

  return `No matching flights for ${selectedDate}. Aviationstack returned flights for ${availableDates.join(", ")}.`;
}
