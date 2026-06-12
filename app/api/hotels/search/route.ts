import { postHotelSearch } from "@/controllers/hotelController";
import { NextResponse } from "next/server";

type HotelSearchPayload = {
  placeId?: string;
  checkin?: string;
  checkout?: string;
  currency?: string;
  guestNationality?: string;
  occupancies?: { adults?: number; rooms?: number }[];
  limit?: number;
  maxRatesPerHotel?: number;
  timeout?: number;
};

export async function POST(request: Request) {
  let body: HotelSearchPayload;

  try {
    body = (await request.json()) as HotelSearchPayload;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const validationError = validateHotelSearch(body);

  if (validationError) {
    return NextResponse.json({ error: validationError }, { status: 400 });
  }

  try {
    const hotels = await postHotelSearch({
      placeId: body.placeId,
      checkin: body.checkin,
      checkout: body.checkout,
      currency: body.currency ?? "USD",
      guestNationality: body.guestNationality ?? "IN",
      occupancies: body.occupancies?.length ? body.occupancies : [{ adults: 2 }],
      limit: body.limit ?? 8,
      maxRatesPerHotel: body.maxRatesPerHotel ?? 1,
      timeout: body.timeout ?? 3,
    });

    return NextResponse.json({ hotels });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Unable to search hotel rates.",
      },
      { status: 502 },
    );
  }
}

function validateHotelSearch(body: HotelSearchPayload) {
  if (!body.placeId) {
    return "Please select a destination from the suggestions.";
  }

  if (!isIsoDate(body.checkin)) {
    return "Please choose a valid check-in date.";
  }

  if (!isIsoDate(body.checkout)) {
    return "Please choose a valid check-out date.";
  }

  if (body.checkin && body.checkout && body.checkout <= body.checkin) {
    return "Check-out date must be after check-in date.";
  }

  const adults = body.occupancies?.[0]?.adults;

  if (typeof adults !== "number" || adults < 1) {
    return "At least one adult is required.";
  }

  return "";
}

function isIsoDate(value: unknown) {
  return typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value);
}
