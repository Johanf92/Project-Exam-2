import { jfetch, authHeaders } from "./apiClients.js"; // or ./apiClient.js if you renamed
import { API_BASE } from "./config.js";

/**
 * @file Booking API client — helpers for creating and cancelling bookings.
 */

/**
 * Create a booking.
 *
 * @function createBooking
 * @param {Object} params
 * @param {Object} params.payload - Booking data payload.
 * @param {string} params.accessToken - Bearer token for authentication.
 * @param {string} params.apiKey - Noroff API key.
 * @returns {Promise<Object>} Response object from the API (usually `{ data, meta }`).
 *
 *  */

export function createBooking({ payload, accessToken, apiKey }) {
  return jfetch(`/holidaze/bookings`, {
    method: "POST",
    headers: authHeaders({ accessToken, apiKey }),
    body: JSON.stringify(payload),
  });
}

/**
 * Cancel a booking by ID.
 *
 * @function cancelBooking
 * @param {Object} params
 * @param {string} params.id - Booking ID to cancel.
 * @param {string} params.accessToken - Bearer token for authentication.
 * @param {string} params.apiKey - Noroff API key.
 * @returns {Promise<Object>} Response object from the API (usually `{ data, meta }`).
 *
 */

export function cancelBooking({ id, accessToken, apiKey }) {
  return jfetch(`/holidaze/bookings/${id}`, {
    method: "DELETE",
    headers: authHeaders({ accessToken, apiKey }),
  });
}
