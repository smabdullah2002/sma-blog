export function mapPostFromApi(p) {
  return {
    slug: p.slug,
    title: p.title,
    subtitle: p.subtitle || "",
    excerpt: p.excerpt || "",
    content: p.content || "",
    coverImage: p.cover_image || "",
    coverImageFull: p.cover_image || "",
    coverCaption: p.cover_caption || "",
    publishedAt: p.published_at || "",
    readTimeMinutes: p.read_time_minutes || 1,
    tags: p.tags || [],
    author: p.author || { name: "Admin" },
  };
}
