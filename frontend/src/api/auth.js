import client from "./client";

export async function login(email, password) {
  const { data } = await client.post("/auth/login", { email, password });
  return data;
}

export async function refreshToken(refresh_token) {
  const { data } = await client.post("/auth/refresh", { refresh_token });
  return data;
}
