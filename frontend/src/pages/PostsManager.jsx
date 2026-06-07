import { useDashboard } from "../context/DashboardContext";
import { useState } from "react";
import DashboardLayout from "../components/dashboard/DashboardLayout";
import StatCard from "../components/dashboard/StatCard";
import PostTable from "../components/dashboard/PostTable";
import { TableSkeleton } from "../components/ui/Skeleton";

export default function PostsManager() {
  const { posts, publishedPosts, draftPosts, deletePost, loading } = useDashboard();
  const [filter, setFilter] = useState("all");

  const filteredPosts =
    filter === "published"
      ? publishedPosts
      : filter === "draft"
      ? draftPosts
      : posts;

  return (
    <DashboardLayout>
      <div className="p-6 md:p-8">
        <div className="font-mono text-xs uppercase tracking-widest text-neutral-500 mb-2">
          Content
        </div>
        <div className="w-12 h-1 bg-accent mb-6" />
        <h1 className="font-serif text-3xl md:text-4xl font-black tracking-tighter mb-8">
          Posts<span className="text-accent">.</span>
        </h1>

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <button
            onClick={() => setFilter("all")}
            className={`text-left border-2 p-4 transition-all duration-200 ${
              filter === "all" ? "border-ink bg-ink text-bg" : "border-ink bg-bg text-ink hover:bg-neutral-100"
            }`}
          >
            <div className="font-mono text-xl font-bold">{posts.length}</div>
            <div className="font-sans text-[10px] uppercase tracking-widest">Total</div>
          </button>
          <button
            onClick={() => setFilter("published")}
            className={`text-left border-2 p-4 transition-all duration-200 ${
              filter === "published" ? "border-ink bg-ink text-bg" : "border-ink bg-bg text-ink hover:bg-neutral-100"
            }`}
          >
            <div className="font-mono text-xl font-bold">{publishedPosts.length}</div>
            <div className="font-sans text-[10px] uppercase tracking-widest">Published</div>
          </button>
          <button
            onClick={() => setFilter("draft")}
            className={`text-left border-2 p-4 transition-all duration-200 ${
              filter === "draft" ? "border-ink bg-ink text-bg" : "border-ink bg-bg text-ink hover:bg-neutral-100"
            }`}
          >
            <div className="font-mono text-xl font-bold">{draftPosts.length}</div>
            <div className="font-sans text-[10px] uppercase tracking-widest">Drafts</div>
          </button>
        </div>

        {/* Table */}
        {loading ? <TableSkeleton rows={8} /> : <PostTable posts={filteredPosts} onDelete={deletePost} />}
      </div>
    </DashboardLayout>
  );
}
