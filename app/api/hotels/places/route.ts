import { getHotelPlaces } from "@/controllers/hotelController";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("query")?.trim();

  if (!query || query.length < 2) {
    return NextResponse.json({ places: [] });
  }

  try {
    const places = await getHotelPlaces(query);
    return NextResponse.json({ places });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Unable to search hotel destinations.",
      },
      { status: 502 },
    );
  }
}
