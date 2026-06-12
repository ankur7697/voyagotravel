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
    return NextResponse.json(
      { error: "Flight API key is not configured." },
      { status: 500 },
    );
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
    return NextResponse.json(
      { error: "Live flight search is temporarily unavailable." },
      { status: 502 },
    );
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
