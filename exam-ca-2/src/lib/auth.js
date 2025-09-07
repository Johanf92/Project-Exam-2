import { jfetch } from "./apiClients";
import { API_BASE } from "./config.js";

/**
 * @file Auth API client — helpers for login, API key creation, and registration.
 */

/**
 * Authenticate a user.
 *
 * @function login
 * @param {Object} params
 * @param {string} params.email - User email.
 * @param {string} params.password - User password.
 * @returns {Promise<Object>} Response object from the API (usually `{ data, meta }`).
 */

export function login({ email, password }) {
  return jfetch("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

/**
 * Create a new Noroff API key for the logged-in user.
 *
 * @function createApiKey
 * @param {Object} params
 * @param {string} params.accessToken - Bearer access token.
 * @param {string} [params.name="Holidaze FE"] - Name of the API key.
 * @returns {Promise<Object>} Response object from the API (usually `{ data, meta }`).
 */

export function createApiKey({ accessToken, name = "Holidaze FE" }) {
  return jfetch("/auth/create-api-key", {
    method: "POST",
    headers: { Authorization: `Bearer ${accessToken}` },
    body: JSON.stringify({ name }),
  });
}

/**
 * Register a new user.
 *
 * @function register
 * @param {Object} params
 * @param {string} params.name - Display name.
 * @param {string} params.email - User email.
 * @param {string} params.password - User password.
 * @param {boolean} [params.venueManager=false] - Whether the user should be registered as a venue manager.
 * @returns {Promise<{data: Object}>} Response containing the created user data.
 * @throws {Error} If the response is not OK, throws with API error message.
 *
 * @example
 * ```js
 * await register({
 *   name: "Jane Doe",
 *   email: "jane@example.com",
 *   password: "supersecret",
 *   venueManager: true
 * });
 * ```
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
