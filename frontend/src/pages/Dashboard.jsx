import { useDashboard } from "../context/DashboardContext";
import DashboardLayout from "../components/dashboard/DashboardLayout";
import StatCard from "../components/dashboard/StatCard";
import { DashboardSkeleton } from "../components/ui/Skeleton";
import { Link } from "react-router-dom";

export default function Dashboard() {
  const { posts, publishedPosts, draftPosts, loading } = useDashboard();

  if (loading) {
    return (
      <DashboardLayout>
        <DashboardSkeleton />
      </DashboardLayout>
    );
  }
  const topicsCount = new Set(posts.flatMap((p) => p.tags.map((t) => t.slug))).size;

  const recentPosts = [...publishedPosts, ...draftPosts].slice(0, 5);

  return (
    <DashboardLayout>
      <div className="p-6 md:p-8">
        {/* Header */}
        <div className="font-mono text-xs uppercase tracking-widest text-neutral-500 mb-2">
          Overview
        </div>
        <div className="w-12 h-1 bg-accent mb-6" />
        <h1 className="font-serif text-3xl md:text-4xl font-black tracking-tighter mb-8">
          Writer&rsquo;s Dashboard<span className="text-accent">.</span>
        </h1>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          <StatCard value={publishedPosts.length} label="Published" />
          <StatCard value={draftPosts.length} label="Drafts" />
          <StatCard value={posts.length} label="Total Essays" />
          <StatCard value={topicsCount} label="Topics" />
        </div>

        {/* Recent Posts */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-sans text-xs uppercase tracking-widest font-semibold text-neutral-500">
              Recent Posts
            </h2>
            <Link
              to="/dashboard/posts"
              className="font-sans text-[10px] uppercase tracking-widest font-semibold text-accent hover:underline underline-offset-4 decoration-2 decoration-accent"
            >
              View All &rarr;
            </Link>
          </div>

          <div className="border-2 border-ink">
            {recentPosts.map((post, i) => (
              <Link
                key={post.slug}
                to={`/dashboard/edit/${post.slug}`}
                className={`flex items-center justify-between px-4 py-3 border-b border-ink last:border-b-0 hover:bg-neutral-100 transition-colors duration-200 ${
                  i % 2 === 0 ? "bg-bg" : "bg-neutral-100/50"
                }`}
              >
                <div className="min-w-0 flex-1">
                  <span className="font-serif text-sm font-semibold text-ink">
                    {post.title}
                  </span>
                  <span className="font-mono text-[10px] uppercase tracking-widest text-neutral-400 ml-3">
                    {post.readTimeMinutes} min
                  </span>
                </div>
                <span
                  className={`shrink-0 font-mono text-[10px] uppercase tracking-widest font-semibold px-2 py-0.5 border ${
                    post.status === "published" || (!post.status && post.publishedAt !== "Draft")
                      ? "border-ink text-ink"
                      : "border-neutral-400 text-neutral-500"
                  }`}
                >
                  {post.status === "published" || (!post.status && post.publishedAt !== "Draft") ? "Published" : "Draft"}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
