import { jfetch, authHeaders } from "./apiClients.js"; // or ./apiClient.js if you renamed
import { API_BASE } from "./config.js";

// Create booking
export function createBooking({ payload, accessToken, apiKey }) {
  return jfetch(`/holidaze/bookings`, {
    method: "POST",
    headers: authHeaders({ accessToken, apiKey }),
    body: JSON.stringify(payload),
  });
}

// Cancel booking
export function cancelBooking({ id, accessToken, apiKey }) {
  return jfetch(`/holidaze/bookings/${id}`, {
    method: "DELETE",
    headers: authHeaders({ accessToken, apiKey }),
  });
}
