const DEFAULT_BASE_URL = "https://api.liteapi.travel/v3.0";

export async function searchPlaces(textQuery) {
  const query = String(textQuery ?? "").trim();

  if (!query) {
    return [];
  }

  assertLiteApiConfigured();

  const url = new URL(`${getBaseUrl()}/data/places`);
  url.searchParams.set("textQuery", query);
  url.searchParams.set("type", "locality,airport,hotel");
  url.searchParams.set("language", "en");

  const data = await liteApiFetch(url, { method: "GET" });
  const places = Array.isArray(data) ? data : data.data ?? data.places ?? [];

  return places.map(normalizePlace).filter(Boolean);
}

export async function searchHotelRates(payload) {
  const normalizedPayload = {
    placeId: payload.placeId,
    checkin: payload.checkin,
    checkout: payload.checkout,
    currency: payload.currency ?? "USD",
    guestNationality: payload.guestNationality ?? "IN",
    occupancies: payload.occupancies?.length
      ? payload.occupancies
      : [{ adults: 2 }],
    limit: payload.limit ?? 8,
    maxRatesPerHotel: payload.maxRatesPerHotel ?? 1,
    timeout: payload.timeout ?? 3,
  };

  assertLiteApiConfigured();

  const [data, hotelCatalog] = await Promise.all([
    liteApiFetch(`${getBaseUrl()}/hotels/rates`, {
      method: "POST",
      body: JSON.stringify(normalizedPayload),
    }),
    getHotelsByPlace(normalizedPayload.placeId, normalizedPayload.limit),
  ]);
  const hotels = Array.isArray(data) ? data : data.data ?? data.hotels ?? [];

  return enrichRateHotels(hotels.slice(0, normalizedPayload.limit), hotelCatalog);
}

export function isLiteApiConfigured() {
  return Boolean(getLiteApiKey());
}

function getLiteApiKey() {
  return process.env.LITEAPI_KEY || process.env.LITEAPI_SANDBOX_KEY;
}

function getBaseUrl() {
  return process.env.LITEAPI_BASE_URL || DEFAULT_BASE_URL;
}

function assertLiteApiConfigured() {
  if (!getLiteApiKey()) {
    throw new Error(
      "LiteAPI key is not configured. Add LITEAPI_KEY to .env.local.",
    );
  }
}

async function liteApiFetch(url, init) {
  const response = await fetch(url, {
    ...init,
    cache: "no-store",
    headers: {
      "content-type": "application/json",
      "X-API-Key": getLiteApiKey(),
      ...(init.headers ?? {}),
    },
  });
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(
      data.message || data.error || `LiteAPI request failed with ${response.status}`,
    );
  }

  return data;
}

function normalizePlace(place) {
  if (!place || typeof place !== "object") {
    return undefined;
  }

  const placeId = place.placeId || place.id || place.locationId;

  if (!placeId) {
    return undefined;
  }

  return {
    placeId,
    name:
      place.name ||
      place.displayName ||
      place.fullName ||
      place.city ||
      place.address ||
      "Selected place",
    secondaryText:
      place.secondaryText ||
      place.country ||
      place.state ||
      place.formattedAddress ||
      place.address ||
      "",
    type: place.type || place.placeType || "location",
  };
}

function enrichRateHotels(hotels, hotelCatalog) {
  const catalogById = new Map(
    hotelCatalog.map((hotel) => [hotel.id || hotel.hotelId || hotel.liteHotelId, hotel]),
  );
  const enrichedHotels = hotels.map((hotel) => {
    const hotelId = hotel.hotelId || hotel.id || hotel.liteHotelId;
    return normalizeHotelWithDetail(hotel, catalogById.get(hotelId));
  });

  return enrichedHotels.filter(Boolean);
}

async function getHotelsByPlace(placeId, limit) {
  const url = new URL(`${getBaseUrl()}/data/hotels`);
  url.searchParams.set("placeId", placeId);
  url.searchParams.set("limit", String(limit));
  url.searchParams.set("timeout", "2");
  url.searchParams.set("language", "en");

  try {
    const data = await liteApiFetch(url, { method: "GET" });
    return Array.isArray(data) ? data : data.data ?? data.hotels ?? [];
  } catch {
    return [];
  }
}

function normalizeHotelWithDetail(hotel, details = {}) {
  if (!hotel || typeof hotel !== "object") {
    return undefined;
  }

  const rate = getFirstRate(hotel);
  const price = getPrice(rate) ?? getPrice(hotel) ?? getPrice(hotel.roomTypes?.[0]);
  const id =
    details.id ||
    hotel.id ||
    hotel.hotelId ||
    hotel.liteHotelId ||
    hotel.code;
  const name =
    details.name ||
    hotel.name ||
    hotel.hotelName ||
    (id ? `Hotel ${id}` : undefined);

  if (!id) {
    return undefined;
  }

  return {
    id,
    name,
    address:
      details.address ||
      [details.city, details.country].filter(Boolean).join(", ") ||
      hotel.address ||
      hotel.location?.address ||
      hotel.city ||
      hotel.destination ||
      "Location details available on request",
    starRating: Number(
      details.starRating || hotel.starRating || hotel.stars || hotel.rating || 0,
    ),
    image: getHotelImage(details) || getHotelImage(hotel),
    price,
    currency:
      rate?.currency ||
      rate?.retailRate?.total?.[0]?.currency ||
      rate?.retailRate?.currency ||
      hotel.roomTypes?.[0]?.offerRetailRate?.currency ||
      hotel.currency ||
      hotel.price?.currency ||
      "USD",
    roomName:
      rate?.roomName ||
      rate?.roomType ||
      rate?.name ||
      hotel.roomTypes?.[0]?.name ||
      rate?.boardName ||
      "Room details available after selection",
    refundable:
      typeof rate?.refundable === "boolean"
        ? rate.refundable
        : typeof rate?.isRefundable === "boolean"
          ? rate.isRefundable
          : typeof rate?.cancellationPolicies?.refundableTag === "string"
            ? rate.cancellationPolicies.refundableTag === "RFN"
          : undefined,
  };
}

function getFirstRate(hotel) {
  if (Array.isArray(hotel.rates)) {
    return hotel.rates[0];
  }

  if (Array.isArray(hotel.roomTypes?.[0]?.rates)) {
    return hotel.roomTypes[0].rates[0];
  }

  return hotel.rate || hotel.bestRate;
}

function getPrice(value) {
  if (!value || typeof value !== "object") {
    return undefined;
  }

  const amount =
    value.retailRate?.total?.[0]?.amount ||
    value.offerRetailRate?.amount ||
    value.suggestedSellingPrice?.amount ||
    value.price?.amount ||
    value.price ||
    value.amount ||
    value.total ||
    value.net ||
    value.retailRate?.total?.amount ||
    value.retailRate?.amount;

  return typeof amount === "number" ? amount : Number(amount) || undefined;
}

function getHotelImage(hotel) {
  if (!hotel || typeof hotel !== "object") {
    return undefined;
  }

  if (typeof hotel.image === "string") {
    return hotel.image;
  }

  if (typeof hotel.main_photo === "string") {
    return hotel.main_photo;
  }

  if (typeof hotel.main_photo === "string") {
    return hotel.main_photo;
  }

  if (typeof hotel.thumbnail === "string") {
    return hotel.thumbnail;
  }

  if (Array.isArray(hotel.images)) {
    const image = hotel.images[0];
    return typeof image === "string" ? image : image?.url;
  }

  if (Array.isArray(hotel.hotelImages)) {
    const image = hotel.hotelImages.find((item) => item.defaultImage) || hotel.hotelImages[0];
    return image?.urlHd || image?.url;
  }

  return "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=900&q=84";
}
