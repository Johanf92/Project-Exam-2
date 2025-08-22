import { jfetch, authHeaders } from "../lib/apiClients";

export function getVenues({
  accessToken,
  apiKey,
  page = 1,
  limit = 20,
  q,
} = {}) {
  const params = new URLSearchParams({
    page: String(page),
    limit: String(limit),
  });
  if (q) params.set("q", q);
  return jfetch(`/holidaze/venues?${params.toString()}`, {
    headers: authHeaders({ accessToken, apiKey }),
  });
}

export function getVenueById({ id, accessToken, apiKey }) {
  return jfetch(`/holidaze/venues/${id}`, {
    headers: authHeaders({ accessToken, apiKey }),
  });
}
