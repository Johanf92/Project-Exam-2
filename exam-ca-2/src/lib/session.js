// Simple session helpers for auth state
export function getAccessToken() {
  return localStorage.getItem("accessToken");
}

export function getApiKey() {
  return localStorage.getItem("apiKey");
}

export function isAuthed() {
  return !!getAccessToken() && !!getApiKey();
}

export function logout() {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("apiKey");
  // let the app know auth changed (optional, used by Navbar below)
  window.dispatchEvent(new Event("auth:changed"));
}
