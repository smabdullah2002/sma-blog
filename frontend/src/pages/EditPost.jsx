import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useDashboard } from "../context/DashboardContext";
import DashboardLayout from "../components/dashboard/DashboardLayout";
import PostEditor from "../components/dashboard/PostEditor";
import { EditorSkeleton } from "../components/ui/Skeleton";
import Toast from "../components/ui/Toast";

export default function EditPost() {
  const { slug } = useParams();
  const { getPost, updatePost, loading } = useDashboard();
  const post = getPost(slug);
  const [toast, setToast] = useState(null);

  if (loading) {
    return (
      <DashboardLayout>
        <EditorSkeleton />
      </DashboardLayout>
    );
  }

  if (!post) {
    return (
      <DashboardLayout>
        <div className="p-8 text-center">
          <h2 className="font-serif text-2xl font-bold mb-2">Post not found</h2>
          <Link
            to="/dashboard/posts"
            className="font-sans text-xs uppercase tracking-widest font-semibold text-accent hover:underline"
          >
            &larr; Back to Posts
          </Link>
        </div>
      </DashboardLayout>
    );
  }

  const handleSave = async (data) => {
    await updatePost(slug, data);
    setToast("Changes saved");
  };

  return (
    <DashboardLayout>
      {toast && <Toast message={toast} onClose={() => setToast(null)} />}
      <div className="flex flex-col h-full">
        <div className="p-6 pb-0">
          <div className="font-mono text-xs uppercase tracking-widest text-neutral-500 mb-2">
            Editing
          </div>
          <div className="w-12 h-1 bg-accent mb-4" />
          <h1 className="font-serif text-3xl md:text-4xl font-black tracking-tighter leading-tight">
            {post.title}<span className="text-accent">.</span>
          </h1>
        </div>
        <PostEditor initial={post} onSave={handleSave} />
      </div>
    </DashboardLayout>
  );
}
