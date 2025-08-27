import { jfetch } from "./apiClients";
import { API_BASE } from "./config.js";

export function login({ email, password }) {
  return jfetch("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

export function createApiKey({ accessToken, name = "Holidaze FE" }) {
  return jfetch("/auth/create-api-key", {
    method: "POST",
    headers: { Authorization: `Bearer ${accessToken}` },
    body: JSON.stringify({ name }),
  });
}

/**
 * Register a new user
 * payload: { name, email, password, venueManager?: boolean }
 * Noroff v2: POST /auth/register
 */
export function register({ name, email, password, venueManager = false }) {
  return fetch(`${API_BASE}/auth/register`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify({ name, email, password, venueManager }),
  }).then(async (r) => {
    const data = await r.json().catch(() => ({}));
    if (!r.ok) {
      const message =
        data?.errors?.[0]?.message || data?.message || r.statusText;
      throw new Error(message);
    }
    return { data };
  });
}
