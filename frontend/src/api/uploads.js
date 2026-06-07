import client from "./client";

export async function uploadImage(file) {
  const form = new FormData();
  form.append("file", file);
  const { data } = await client.post("/uploads/image", form, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
}
