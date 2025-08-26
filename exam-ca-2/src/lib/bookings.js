import { jfetch, authHeaders } from "./apiClients.js"; // or ./apiClient.js if you renamed

// Create a booking for a venue
// payload: { dateFrom, dateTo, guests, venueId }
export function createBooking({ payload, accessToken, apiKey }) {
  return jfetch(`/holidaze/bookings`, {
    method: "POST",
    headers: authHeaders({ accessToken, apiKey }),
    body: JSON.stringify(payload),
  });
}
