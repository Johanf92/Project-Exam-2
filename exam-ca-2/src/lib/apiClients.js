import { API_BASE } from "./config";

export async function jfetch(path, { headers, ...opts } = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { "Content-Type": "application/json", ...(headers || {}) },
    ...opts,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const msg =
      data?.errors?.[0]?.message || res.statusText || "Request failed";
    throw new Error(msg);
  }
  return data; // { data, meta } shape in Noroff v2
}

export function authHeaders({ accessToken, apiKey }) {
  return {
    Authorization: `Bearer ${accessToken}`,
    "X-Noroff-API-Key": apiKey,
  };
}
