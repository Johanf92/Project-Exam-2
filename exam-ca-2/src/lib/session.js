/**
 * @file Session helpers — manage auth tokens in localStorage and provide auth state utilities.
 */

/**
 * Get the stored access token from localStorage.
 *
 * @function getAccessToken
 * @returns {string|null} The access token, or `null` if not set.
 */
export function getAccessToken() {
  return localStorage.getItem("accessToken");
}

/**
 * Get the stored API key from localStorage.
 *
 * @function getApiKey
 * @returns {string|null} The API key, or `null` if not set.
 */
export function getApiKey() {
  return localStorage.getItem("apiKey");
}

/**
 * Check if the user is authenticated.
 * Requires both an access token and an API key to be present.
 *
 * @function isAuthed
 * @returns {boolean} `true` if both tokens exist, otherwise `false`.
 */
export function isAuthed() {
  return !!getAccessToken() && !!getApiKey();
}

/**
 * Log out the current user.
 * Removes stored tokens and dispatches an `auth:changed` event to notify listeners.
 */
export function logout() {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("apiKey");
  window.dispatchEvent(new Event("auth:changed"));
}
