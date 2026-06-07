import { Link } from "react-router-dom";

export default function PostCard({ post }) {
  const { slug, title, excerpt, coverImage, publishedAt, readTimeMinutes, tags } = post;

  return (
    <article className="group border-b border-ink p-4 md:p-6 hard-shadow-hover bg-bg">
      {coverImage && (
        <Link to={`/post/${slug}`} className="block overflow-hidden mb-4">
          <img
            src={coverImage}
            alt={title}
            className="w-full aspect-[16/10] object-cover grayscale group-hover:sepia-[50%] group-hover:scale-[1.03] transition-all duration-500"
          />
        </Link>
      )}
      <div className="flex flex-wrap gap-x-3 gap-y-1 mb-2">
        {tags?.map((tag) => (
          <span
            key={tag.slug}
            className="font-mono text-[10px] uppercase tracking-widest text-accent font-semibold"
          >
            {tag.name}
          </span>
        ))}
        <span className="font-mono text-[10px] uppercase tracking-widest text-neutral-500">
          {readTimeMinutes} min read
        </span>
      </div>
      <Link to={`/post/${slug}`} className="block group-hover:text-accent transition-colors duration-200">
        <h2 className="font-serif text-xl lg:text-2xl font-bold leading-tight mb-2">
          {title}
        </h2>
      </Link>
      <p className="font-body text-sm text-neutral-600 leading-relaxed line-clamp-2 text-justify">
        {excerpt}
      </p>
      <div className="mt-3 font-mono text-[10px] uppercase tracking-widest text-neutral-500">
        {publishedAt}
      </div>
    </article>
  );
}
