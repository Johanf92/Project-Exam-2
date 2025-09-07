import { jfetch, authHeaders } from "../lib/apiClients";

/**
 * Get a paginated list of venues.
 * @param {Object} opts
 * @param {string} [opts.accessToken]
 * @param {string} [opts.apiKey]
 * @param {number} [opts.page=1]
 * @param {number} [opts.limit=20]
 * @param {string} [opts.q] - optional search term
 * @param {string} [opts.sort="created"] - e.g. "created", "updated", "price"
 * @param {string} [opts.sortOrder="desc"] - "asc" | "desc"
 * @returns {Promise<{data: any[], meta: object}>}
 */
export function getVenues({
  accessToken,
  apiKey,
  page = 1,
  limit = 20,
  q,
  sort = "created",
  sortOrder = "desc",
} = {}) {
  const params = new URLSearchParams({
    page: String(page),
    limit: String(limit),
    sort,
    sortOrder,
  });
  if (q) params.set("q", q);

  return jfetch(`/holidaze/venues?${params.toString()}`, {
    headers: authHeaders({ accessToken, apiKey }),
  });
}

/**
 * Get a single venue by id.
 * Set includeBookings=true to append ?_bookings=true
 * so you can validate booking date conflicts client-side.
 * @param {Object} opts
 * @param {string} opts.id - venue id
 * @param {string} [opts.accessToken]
 * @param {string} [opts.apiKey]
 * @param {boolean} [opts.includeBookings=false]
 * @returns {Promise<{data: any, meta?: object}>}
 */
export function getVenueById({
  id,
  accessToken,
  apiKey,
  includeBookings = false,
}) {
  const qs = includeBookings ? "?_bookings=true" : "";
  return jfetch(`/holidaze/venues/${id}${qs}`, {
    headers: authHeaders({ accessToken, apiKey }),
  });
}

// Create a new venue
// payload: {
//   name, description, media:[{url,alt}], price, maxGuests,
//   meta:{wifi,parking,breakfast,pets},
//   location:{address, city, zip, country}
// }
export function createVenue({ payload, accessToken, apiKey }) {
  return jfetch(`/holidaze/venues`, {
    method: "POST",
    headers: authHeaders({ accessToken, apiKey }),
    body: JSON.stringify(payload),
  });
}

export function updateVenue({ id, payload, accessToken, apiKey }) {
  return jfetch(`/holidaze/venues/${id}`, {
    method: "PUT",
    headers: authHeaders({ accessToken, apiKey }),
    body: JSON.stringify(payload),
  });
}

export function deleteVenue({ id, accessToken, apiKey }) {
  return jfetch(`/holidaze/venues/${id}`, {
    method: "DELETE",
    headers: authHeaders({ accessToken, apiKey }),
  });
}
