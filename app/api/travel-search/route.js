const flightSamples = [
  {
    id: "flight-1",
    badge: "Fastest",
    title: "IndiGo / partner route",
    detail: "Morning departure, one cabin bag, consultant fare verification required.",
    price: "From $229"
  },
  {
    id: "flight-2",
    badge: "Value",
    title: "Air India / partner route",
    detail: "Afternoon departure, checked baggage option, refundable fare may vary.",
    price: "From $259"
  },
  {
    id: "flight-3",
    badge: "Flexible",
    title: "Multi-airline option",
    detail: "Flexible timing with layover options and written fare confirmation.",
    price: "From $299"
  }
];

const hotelSamples = [
  {
    id: "hotel-1",
    badge: "Recommended",
    title: "4-star city stay",
    detail: "Breakfast option, central location, family-friendly room category.",
    price: "From $82/night"
  },
  {
    id: "hotel-2",
    badge: "Premium",
    title: "Resort collection",
    detail: "Pool, airport transfer support, honeymoon and celebration add-ons.",
    price: "From $139/night"
  },
  {
    id: "hotel-3",
    badge: "Budget",
    title: "Comfort hotel",
    detail: "Clean stay option with flexible check-in request through consultant.",
    price: "From $49/night"
  }
];

function validateFlightSearch(body) {
  return body.from && body.to && body.departDate && body.travellers;
}

function validateHotelSearch(body) {
  return body.destination && body.checkIn && body.checkOut && body.guests;
}

async function fetchProviderResults(body) {
  const endpoint = process.env.TRAVEL_SEARCH_API_URL;

  if (!endpoint) {
    return null;
  }

  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(process.env.TRAVEL_SEARCH_API_KEY
        ? { Authorization: `Bearer ${process.env.TRAVEL_SEARCH_API_KEY}` }
        : {})
    },
    body: JSON.stringify(body),
    cache: "no-store"
  });

  if (!response.ok) {
    throw new Error("Live travel provider search failed");
  }

  return response.json();
}

export async function POST(request) {
  try {
    const body = await request.json();
    const type = body.type;

    if (!["flights", "hotels"].includes(type)) {
      return Response.json({ error: "Invalid search type" }, { status: 400 });
    }

    if (type === "flights" && !validateFlightSearch(body)) {
      return Response.json({ error: "Missing flight search fields" }, { status: 400 });
    }

    if (type === "hotels" && !validateHotelSearch(body)) {
      return Response.json({ error: "Missing hotel search fields" }, { status: 400 });
    }

    const providerData = await fetchProviderResults(body);

    if (providerData) {
      return Response.json(providerData);
    }

    return Response.json({
      provider: "demo",
      message:
        type === "flights"
          ? `Showing demo flight options for ${body.from} to ${body.to}. Add supplier API credentials for live fares.`
          : `Showing demo hotel options for ${body.destination}. Add supplier API credentials for live availability.`,
      results: type === "flights" ? flightSamples : hotelSamples
    });
  } catch (error) {
    return Response.json(
      { error: error.message || "Unable to complete travel search" },
      { status: 500 }
    );
  }
}
