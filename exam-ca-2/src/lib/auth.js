import { jfetch } from "./apiClients";

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
