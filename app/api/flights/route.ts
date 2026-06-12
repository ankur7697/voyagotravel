import { NextResponse } from "next/server";

const AVIATIONSTACK_FLIGHTS_URL = "https://api.aviationstack.com/v1/flights";

type FlightSearchRequest = {
  origin: string;
  destination: string;
  departureDate?: string;
};

type JsonObject = Record<string, unknown>;

type AviationstackFlight = {
  flight_date?: string;
  flight_status?: string;
  departure?: {
    airport?: string;
    iata?: string;
    terminal?: string | null;
    gate?: string | null;
    delay?: number | null;
    scheduled?: string | null;
    estimated?: string | null;
    actual?: string | null;
  };
  arrival?: {
    airport?: string;
    iata?: string;
    terminal?: string | null;
    gate?: string | null;
    baggage?: string | null;
    delay?: number | null;
    scheduled?: string | null;
    estimated?: string | null;
    actual?: string | null;
  };
  airline?: {
    name?: string;
    iata?: string;
  };
  flight?: {
    number?: string;
    iata?: string;
  };
};

type NormalizedFlight = NonNullable<ReturnType<typeof normalizeFlight>>;

export async function POST(request: Request) {
  let body: FlightSearchRequest;

  try {
    body = (await request.json()) as FlightSearchRequest;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const validationError = validateSearch(body);

  if (validationError) {
    return NextResponse.json({ error: validationError }, { status: 400 });
  }

  const apiKey = process.env.AVIATIONSTACK_API_KEY;

  if (!apiKey) {
    const flights = getMockFlights(body).slice(0, 6);

    return NextResponse.json({
      availableDates: [...new Set(flights.map((flight) => flight.flightDate))],
      count: flights.length,
      flights,
      isMock: true,
    });
  }

  const url = new URL(AVIATIONSTACK_FLIGHTS_URL);
  url.searchParams.set("access_key", apiKey);
  url.searchParams.set("dep_iata", body.origin.trim().toUpperCase());
  url.searchParams.set("arr_iata", body.destination.trim().toUpperCase());
  url.searchParams.set("limit", body.departureDate ? "100" : "6");

  let flightsResponse: Response;
  let flightsData: JsonObject;

  try {
    flightsResponse = await fetch(url, { cache: "no-store" });
    flightsData = (await flightsResponse.json().catch(() => ({}))) as JsonObject;
  } catch {
    const flights = getMockFlights(body).slice(0, 6);

    return NextResponse.json({
      availableDates: [...new Set(flights.map((flight) => flight.flightDate))],
      count: flights.length,
      flights,
      isMock: true,
      warning: "Live Aviationstack search was unavailable, so demo flights are shown.",
    });
  }

  if (!flightsResponse.ok || getRecord(flightsData.error)) {
    return NextResponse.json(
      {
        error: "Aviationstack flight search failed.",
        details: flightsData,
      },
      { status: flightsResponse.ok ? 502 : flightsResponse.status },
    );
  }

  const flights = Array.isArray(flightsData.data)
    ? flightsData.data
        .map(normalizeFlight)
        .filter(isNormalizedFlight)
    : [];
  const availableDates = [...new Set(flights.map((flight) => flight.flightDate).filter(Boolean))]
    .sort()
    .reverse();
  const filteredFlights = flights
    .filter((flight) => !body.departureDate || flight.flightDate === body.departureDate)
    .slice(0, 6);

  return NextResponse.json({
    availableDates,
    count: filteredFlights.length,
    flights: filteredFlights,
    isMock: false,
  });
}

function validateSearch(body: FlightSearchRequest) {
  if (!isIata(body.origin)) {
    return "Origin must be a 3-letter IATA airport code, for example JFK.";
  }

  if (!isIata(body.destination)) {
    return "Destination must be a 3-letter IATA airport code, for example LHR.";
  }

  if (body.departureDate && !isIsoDate(body.departureDate)) {
    return "Departure date must be a valid date.";
  }

  return "";
}

function normalizeFlight(value: unknown, index: number) {
  const flight = value as AviationstackFlight;
  const flightCode = flight.flight?.iata ?? flight.flight?.number;

  if (!flightCode) {
    return undefined;
  }

  return {
    id: [
      flightCode,
      flight.airline?.iata,
      flight.departure?.iata,
      flight.arrival?.iata,
      flight.departure?.scheduled ?? flight.flight_date,
      flight.arrival?.scheduled,
      index,
    ]
      .filter(Boolean)
      .join("-"),
    flightCode,
    airline: flight.airline?.name ?? "Airline not listed",
    status: flight.flight_status ?? "unknown",
    flightDate: flight.flight_date,
    departure: {
      airport: flight.departure?.airport,
      iata: flight.departure?.iata,
      terminal: flight.departure?.terminal,
      gate: flight.departure?.gate,
      delay: flight.departure?.delay,
      scheduled: flight.departure?.scheduled,
      estimated: flight.departure?.estimated,
      actual: flight.departure?.actual,
    },
    arrival: {
      airport: flight.arrival?.airport,
      iata: flight.arrival?.iata,
      terminal: flight.arrival?.terminal,
      gate: flight.arrival?.gate,
      baggage: flight.arrival?.baggage,
      delay: flight.arrival?.delay,
      scheduled: flight.arrival?.scheduled,
      estimated: flight.arrival?.estimated,
      actual: flight.arrival?.actual,
    },
  };
}

function isNormalizedFlight(
  value: ReturnType<typeof normalizeFlight>,
): value is NormalizedFlight {
  return Boolean(value);
}

function isIata(value: unknown) {
  return typeof value === "string" && /^[A-Za-z]{3}$/.test(value.trim());
}

function isIsoDate(value: unknown) {
  return typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value);
}

function getRecord(value: unknown): JsonObject | undefined {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as JsonObject)
    : undefined;
}

function getMockFlights(body: FlightSearchRequest): NormalizedFlight[] {
  const origin = body.origin.trim().toUpperCase();
  const destination = body.destination.trim().toUpperCase();
  const flightDate = body.departureDate || new Date().toISOString().slice(0, 10);
  const routeSeed = origin.charCodeAt(0) + destination.charCodeAt(0);
  const airlines = [
    { name: "Voyago Airways", prefix: "VT" },
    { name: "Global Connect", prefix: "GC" },
    { name: "Skyline Express", prefix: "SX" },
  ];

  return airlines.map((airline, index) => {
    const departHour = 8 + index * 4 + (routeSeed % 2);
    const arrivalHour = departHour + 3 + (routeSeed % 3);

    return {
      id: `mock-${airline.prefix}-${origin}-${destination}-${flightDate}-${index}`,
      flightCode: `${airline.prefix}${routeSeed + 120 + index * 17}`,
      airline: airline.name,
      status: "scheduled",
      flightDate,
      departure: {
        airport: `${origin} Airport`,
        iata: origin,
        terminal: index === 0 ? "1" : String(index + 1),
        gate: `${String.fromCharCode(65 + index)}${8 + index}`,
        delay: null,
        scheduled: makeIsoDateTime(flightDate, departHour, index * 10),
        estimated: makeIsoDateTime(flightDate, departHour, index * 10),
        actual: null,
      },
      arrival: {
        airport: `${destination} Airport`,
        iata: destination,
        terminal: String(index + 1),
        gate: `${String.fromCharCode(67 + index)}${14 + index}`,
        baggage: null,
        delay: null,
        scheduled: makeIsoDateTime(flightDate, arrivalHour, 25 + index * 5),
        estimated: makeIsoDateTime(flightDate, arrivalHour, 25 + index * 5),
        actual: null,
      },
    };
  });
}

function makeIsoDateTime(date: string, hour: number, minute: number) {
  const normalizedHour = String(hour % 24).padStart(2, "0");
  const normalizedMinute = String(minute % 60).padStart(2, "0");

  return `${date}T${normalizedHour}:${normalizedMinute}:00+00:00`;
}
