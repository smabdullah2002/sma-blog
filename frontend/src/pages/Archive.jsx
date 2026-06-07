import { useState, useEffect } from "react";
import Container from "../components/layout/Container";
import PostCard from "../components/post/PostCard";
import { fetchPosts } from "../api/posts";
import { POSTS_PER_PAGE } from "../data/posts";
import { mapPostFromApi } from "../utils/mapPost";
import { PostGridSkeleton } from "../components/ui/Skeleton";

export default function Archive() {
  const [posts, setPosts] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const totalPages = Math.ceil(total / POSTS_PER_PAGE);
  const start = (page - 1) * POSTS_PER_PAGE;
  const paginatedPosts = posts.slice(start, start + POSTS_PER_PAGE);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const data = await fetchPosts({ page, limit: POSTS_PER_PAGE });
        setPosts((data.items || []).map(mapPostFromApi));
        setTotal(data.total || data.items?.length || 0);
      } catch {
        setPosts([]);
        setTotal(0);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [page]);

  return (
    <section className="py-12 md:py-16">
      <Container>
        {/* Header */}
        <div className="font-mono text-xs uppercase tracking-widest text-neutral-500 mb-2">
          Archive
        </div>
        <div className="w-16 h-1 bg-accent mb-6" />

        <div className="flex items-center justify-between mb-8 pb-6 border-b border-ink">
          <h1 className="font-serif text-4xl md:text-5xl font-black tracking-tighter">
            All Essays
          </h1>
          <div className="font-mono text-[10px] uppercase tracking-widest text-neutral-500 text-right">
            {loading ? (
              <div className="flex items-center gap-2 justify-end">
                <div className="h-3 w-16 animate-pulse bg-neutral-200" />
                <span>/</span>
                <div className="h-3 w-12 animate-pulse bg-neutral-200" />
              </div>
            ) : (
              <>
                <div>Page {page} of {totalPages}</div>
                <div>{total} Essays</div>
              </>
            )}
          </div>
        </div>

        {/* Grid */}
        {loading ? (
          <PostGridSkeleton count={4} />
        ) : paginatedPosts.length === 0 ? (
          <div className="border-2 border-ink p-12 text-center">
            <p className="font-body text-sm text-neutral-500">No essays published yet. Check back soon.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
            {paginatedPosts.map((post, i) => (
              <div
                key={post.slug}
                className={`border-r border-ink ${
                  i % 4 === 3 ? "border-r-0" : ""
                }`}
              >
                <PostCard post={post} />
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-12 flex items-center justify-center gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="font-sans text-xs uppercase tracking-widest font-semibold border border-ink px-4 py-2.5 hover:bg-ink hover:text-bg transition-all duration-200 disabled:opacity-30 disabled:pointer-events-none"
            >
              &larr; Prev
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                onClick={() => setPage(p)}
                className={`font-mono text-sm min-w-[44px] h-11 border border-ink transition-all duration-200 ${
                  p === page
                    ? "bg-ink text-bg"
                    : "bg-bg text-ink hover:bg-neutral-100"
                }`}
              >
                {p}
              </button>
            ))}
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="font-sans text-xs uppercase tracking-widest font-semibold border border-ink px-4 py-2.5 hover:bg-ink hover:text-bg transition-all duration-200 disabled:opacity-30 disabled:pointer-events-none"
            >
              Next &rarr;
            </button>
          </div>
        )}
      </Container>
    </section>
  );
}
