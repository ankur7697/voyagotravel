import {
  isLiteApiConfigured,
  searchHotelRates,
  searchPlaces,
} from "@/services/liteApiService";

export async function getHotelPlaces(query) {
  return searchPlaces(query);
}

export async function postHotelSearch(payload) {
  return searchHotelRates(payload);
}

export function hasHotelApiKey() {
  return isLiteApiConfigured();
}
