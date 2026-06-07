import { useNavigate } from "react-router-dom";
import { useDashboard } from "../context/DashboardContext";
import DashboardLayout from "../components/dashboard/DashboardLayout";
import PostEditor from "../components/dashboard/PostEditor";

export default function NewPost() {
  const { addPost } = useDashboard();
  const navigate = useNavigate();

  const handleSave = (data) => {
    const slug = addPost(data);
    navigate(`/dashboard/edit/${slug}`);
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col h-full">
        <div className="p-6 pb-0">
          <div className="font-mono text-xs uppercase tracking-widest text-neutral-500 mb-2">
            Create
          </div>
          <div className="w-12 h-1 bg-accent mb-4" />
          <h1 className="font-serif text-3xl md:text-4xl font-black tracking-tighter">
            New Essay<span className="text-accent">.</span>
          </h1>
        </div>
        <PostEditor onSave={handleSave} />
      </div>
    </DashboardLayout>
  );
}
