import client from "./client";

export async function fetchPosts(params = {}) {
  const { data } = await client.get("/posts", { params });
  return data;
}

export async function fetchPost(slug) {
  const { data } = await client.get(`/posts/${slug}`);
  return data;
}

export async function createPost(post) {
  const { data } = await client.post("/posts", post);
  return data;
}

export async function updatePost(slug, post) {
  const { data } = await client.put(`/posts/${slug}`, post);
  return data;
}

export async function deletePost(slug) {
  await client.delete(`/posts/${slug}`);
}

export async function fetchTags() {
  const { data } = await client.get("/tags");
  return data;
}
