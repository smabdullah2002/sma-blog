import client from "./client";

export async function subscribe(email) {
  const { data } = await client.post("/newsletter/subscribe", { email });
  return data;
}
