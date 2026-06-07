import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import Container from "../components/layout/Container";
import PostCard from "../components/post/PostCard";
import { fetchPosts, fetchTags } from "../api/posts";
import { POSTS_PER_PAGE } from "../data/posts";
import { mapPostFromApi } from "../utils/mapPost";
import { PostGridSkeleton } from "../components/ui/Skeleton";

export default function Tag() {
  const { slug } = useParams();
  const [tag, setTag] = useState(null);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  const totalPages = Math.ceil(total / POSTS_PER_PAGE);
  const start = (page - 1) * POSTS_PER_PAGE;
  const paginatedPosts = filteredPosts.slice(start, start + POSTS_PER_PAGE);

  useEffect(() => {
    async function load() {
      setLoading(true);
      setPage(1);
      try {
        const [tagsData, postsData] = await Promise.all([
          fetchTags(),
          fetchPosts({ page: 1, limit: 100, tag: slug }),
        ]);
        const found = tagsData.find((t) => t.slug === slug);
        setTag(found || null);
        const mapped = (postsData.items || []).map(mapPostFromApi);
        setFilteredPosts(mapped);
        setTotal(postsData.total || mapped.length);
      } catch {
        setTag(null);
        setFilteredPosts([]);
        setTotal(0);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [slug]);

  if (!loading && !tag) {
    return (
      <section className="py-20">
        <Container>
          <div className="max-w-xl mx-auto text-center">
            <div className="font-mono text-xs uppercase tracking-widest text-neutral-500 mb-2">
              Error 404
            </div>
            <h1 className="font-serif text-4xl font-bold mb-4">
              Topic not found<span className="text-accent">.</span>
            </h1>
            <p className="font-body text-sm text-neutral-600 mb-6">
              This topic doesn't exist in our archives.
            </p>
            <Link
              to="/archive"
              className="inline-flex bg-ink text-bg px-6 py-3 font-sans text-xs uppercase tracking-widest font-semibold hover:bg-white hover:text-ink hover:border hover:border-ink transition-all duration-200"
            >
              Browse Archive
            </Link>
          </div>
        </Container>
      </section>
    );
  }

  return (
    <section className="py-12 md:py-16">
      <Container>
        {/* Header */}
        <div className="font-mono text-xs uppercase tracking-widest text-neutral-500 mb-2">
          Topic
        </div>
        <div className="w-16 h-1 bg-accent mb-6" />

        <div className="flex items-center justify-between mb-8 pb-6 border-b border-ink">
          <div>
            <h1 className="font-serif text-4xl md:text-5xl font-black tracking-tighter">
              {loading ? (
                <span className="inline-block h-10 w-48 animate-pulse bg-neutral-200 align-middle" />
              ) : (
                tag?.name
              )}
            </h1>
            {!loading && (
              <div className="font-mono text-[10px] uppercase tracking-widest text-neutral-500 mt-1">
                {total} {total === 1 ? "Essay" : "Essays"}
              </div>
            )}
          </div>
          {loading ? (
            <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-neutral-500">
              <div className="h-3 w-16 animate-pulse bg-neutral-200" />
              <span>/</span>
              <div className="h-3 w-12 animate-pulse bg-neutral-200" />
            </div>
          ) : totalPages > 0 && (
            <div className="font-mono text-[10px] uppercase tracking-widest text-neutral-500 text-right">
              Page {page} of {totalPages}
            </div>
          )}
        </div>

        {/* Grid */}
        {loading ? (
          <PostGridSkeleton count={4} />
        ) : paginatedPosts.length > 0 ? (
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
        ) : (
          <div className="border-2 border-ink p-12 text-center">
            <p className="font-body text-sm text-neutral-500">
              No essays found for this topic.
            </p>
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
