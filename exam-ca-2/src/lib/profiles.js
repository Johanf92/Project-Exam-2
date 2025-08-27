import { jfetch, authHeaders } from "../lib/apiClients";

/**
 * Get a profile by name.
 * Flags: _bookings=true, _venues=true to include related data.
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

/** v2: Update profile fields (bio, venueManager, avatar, banner) */
export function updateProfile({ name, payload, accessToken, apiKey }) {
  return jfetch(`/holidaze/profiles/${encodeURIComponent(name)}`, {
    method: "PUT",
    headers: authHeaders({ accessToken, apiKey }),
    body: JSON.stringify(payload), // e.g. { avatar: { url, alt } }
  });
}

/** Convenience wrapper for avatar only */
export function updateAvatar({ name, avatar, accessToken, apiKey }) {
  return updateProfile({ name, payload: { avatar }, accessToken, apiKey });
}
