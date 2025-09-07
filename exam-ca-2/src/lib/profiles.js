import { jfetch, authHeaders } from "../lib/apiClients";

/**
 * @file Profile API client — helpers for fetching and updating profiles.
 */

/**
 * Get a profile by name.
 * Optionally include related bookings and venues.
 *
 * @function getProfile
 * @param {Object} params
 * @param {string} params.name - Profile name (username).
 * @param {string} params.accessToken - Bearer access token.
 * @param {string} params.apiKey - Noroff API key.
 * @param {boolean} [params._bookings=false] - Include profile bookings in the response.
 * @param {boolean} [params._venues=false] - Include profile venues in the response.
 * @returns {Promise<Object>} Profile data, optionally including bookings and venues.
 */

export function getProfile({
  name,
  accessToken,
  apiKey,
  _bookings = false,
  _venues = false,
}) {
  const params = new URLSearchParams();
  if (_bookings) params.set("_bookings", "true");
  if (_venues) params.set("_venues", "true");
  const qs = params.toString() ? `?${params.toString()}` : "";

  return jfetch(`/holidaze/profiles/${encodeURIComponent(name)}${qs}`, {
    headers: authHeaders({ accessToken, apiKey }),
  });
}

/**
 * Update profile fields (e.g., bio, venueManager, avatar, banner).
 *
 * @function updateProfile
 * @param {Object} params
 * @param {string} params.name - Profile name (username).
 * @param {Object} params.payload - Profile fields to update.
 * @param {string} params.accessToken - Bearer access token.
 * @param {string} params.apiKey - Noroff API key.
 * @returns {Promise<Object>} Updated profile data.
 */

export function updateProfile({ name, payload, accessToken, apiKey }) {
  return jfetch(`/holidaze/profiles/${encodeURIComponent(name)}`, {
    method: "PUT",
    headers: authHeaders({ accessToken, apiKey }),
    body: JSON.stringify(payload),
  });
}

/**
 * Update only the avatar field of a profile.
 *
 * @function updateAvatar
 * @param {Object} params
 * @param {string} params.name - Profile name (username).
 * @param {{url: string, alt?: string}} params.avatar - Avatar object with image URL and optional alt text.
 * @param {string} params.accessToken - Bearer access token.
 * @param {string} params.apiKey - Noroff API key.
 * @returns {Promise<Object>} Updated profile data with new avatar.
 */
export function updateAvatar({ name, avatar, accessToken, apiKey }) {
  return updateProfile({ name, payload: { avatar }, accessToken, apiKey });
}
