import { useState } from "react";
import { Link } from "react-router-dom";
import { Edit3, Trash2 } from "lucide-react";
import ConfirmModal from "./ConfirmModal";

export default function PostTable({ posts, onDelete }) {
  const [deleteSlug, setDeleteSlug] = useState(null);
  const deletePost = posts.find((p) => p.slug === deleteSlug);

  if (posts.length === 0) {
    return (
      <div className="border-2 border-ink p-10 text-center">
        <p className="font-body text-sm text-neutral-500 mb-1">No posts found.</p>
        <Link
          to="/dashboard/new"
          className="font-sans text-xs uppercase tracking-widest font-semibold text-accent hover:underline underline-offset-4 decoration-2 decoration-accent"
        >
          Write your first essay &rarr;
        </Link>
      </div>
    );
  }

  return (
    <>
      <div className="border-2 border-ink overflow-hidden">
        {/* Table Header */}
        <div className="hidden md:grid grid-cols-12 border-b-2 border-ink bg-neutral-100">
          <div className="col-span-5 px-4 py-3 font-sans text-[10px] uppercase tracking-widest font-semibold text-neutral-500">
            Title
          </div>
          <div className="col-span-2 px-4 py-3 font-sans text-[10px] uppercase tracking-widest font-semibold text-neutral-500">
            Status
          </div>
          <div className="col-span-2 px-4 py-3 font-sans text-[10px] uppercase tracking-widest font-semibold text-neutral-500">
            Date
          </div>
          <div className="col-span-3 px-4 py-3 font-sans text-[10px] uppercase tracking-widest font-semibold text-neutral-500 text-right">
            Actions
          </div>
        </div>

        {/* Table Rows */}
        {posts.map((post, i) => (
          <div
            key={post.slug}
            className={`grid grid-cols-1 md:grid-cols-12 border-b border-ink last:border-b-0 hover:bg-neutral-100 transition-colors duration-200 ${
              i % 2 === 0 ? "bg-bg" : "bg-neutral-100/50"
            }`}
          >
            {/* Title — mobile: full row, desktop: col-span-5 */}
            <div className="md:col-span-5 px-4 py-3 md:py-4">
              <div className="md:hidden font-sans text-[10px] uppercase tracking-widest text-neutral-500 mb-1">
                Title
              </div>
              <Link
                to={`/dashboard/edit/${post.slug}`}
                className="font-serif text-base font-semibold text-ink hover:text-accent transition-colors duration-200"
              >
                {post.title}
              </Link>
              <div className="font-mono text-[10px] uppercase tracking-widest text-neutral-400 mt-0.5">
                {post.tags.map((t) => t.name).join(", ")}
              </div>
            </div>

            {/* Status */}
            <div className="md:col-span-2 px-4 pb-2 md:py-4">
              <div className="md:hidden font-sans text-[10px] uppercase tracking-widest text-neutral-500 mb-1">
                Status
              </div>
              <span
                className={`inline-block font-mono text-[10px] uppercase tracking-widest font-semibold px-2 py-0.5 border ${
                  post.status === "published" || (!post.status && post.publishedAt !== "Draft")
                    ? "border-ink text-ink"
                    : "border-neutral-400 text-neutral-500"
                }`}
              >
                {post.status === "published" || (!post.status && post.publishedAt !== "Draft") ? "Published" : "Draft"}
              </span>
            </div>

            {/* Date */}
            <div className="md:col-span-2 px-4 pb-2 md:py-4">
              <div className="md:hidden font-sans text-[10px] uppercase tracking-widest text-neutral-500 mb-1">
                Date
              </div>
              <span className="font-mono text-[10px] uppercase tracking-widest text-neutral-500">
                {post.publishedAt}
              </span>
            </div>

            {/* Actions */}
            <div className="md:col-span-3 px-4 pb-3 md:py-3 flex gap-2 justify-start md:justify-end">
              <Link
                to={`/dashboard/edit/${post.slug}`}
                aria-label="Edit"
                className="h-9 w-9 border border-ink flex items-center justify-center hover:bg-ink hover:text-bg transition-all duration-200"
              >
                <Edit3 size={14} strokeWidth={1.5} />
              </Link>
              <button
                onClick={() => setDeleteSlug(post.slug)}
                aria-label="Delete"
                className="h-9 w-9 border border-ink flex items-center justify-center hover:bg-accent hover:text-bg hover:border-accent transition-all duration-200"
              >
                <Trash2 size={14} strokeWidth={1.5} />
              </button>
            </div>
          </div>
        ))}
      </div>

      <ConfirmModal
        open={!!deleteSlug}
        title={`Delete "${deletePost?.title}"`} 
        message="Are you sure you want to delete this essay? This action cannot be undone."
        onConfirm={() => {
          if (deleteSlug) onDelete(deleteSlug);
          setDeleteSlug(null);
        }}
        onCancel={() => setDeleteSlug(null)}
      />
    </>
  );
}
