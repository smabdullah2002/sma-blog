import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useAuth } from "./AuthContext";
import * as postsApi from "../api/posts";

function apiToFrontend(p) {
  return {
    slug: p.slug,
    title: p.title,
    subtitle: p.subtitle || "",
    excerpt: p.excerpt || "",
    content: p.content || "",
    coverImage: p.cover_image || "",
    coverImageFull: p.cover_image || "",
    coverCaption: p.cover_caption || "",
    publishedAt: p.published_at || "Draft",
    readTimeMinutes: p.read_time_minutes || 1,
    tags: p.tags || [],
    author: p.author || { name: "Admin" },
    status: p.status || "draft",
  };
}

function frontendToApi(data) {
  return {
    title: data.title,
    subtitle: data.subtitle,
    excerpt: data.excerpt,
    content: data.content,
    cover_image: data.coverImage,
    cover_caption: data.coverCaption,
    tags: data.tags && data.tags.length
      ? (typeof data.tags[0] === "string"
          ? data.tags.map((t) => ({ slug: t.toLowerCase().replace(/[^a-z0-9]+/g, "-"), name: t }))
          : data.tags)
      : [],
    status: data.status || "draft",
  };
}

const DashboardContext = createContext(null);

export function DashboardProvider({ children }) {
  const { isAuthenticated } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadPosts = useCallback(async () => {
    if (!isAuthenticated) return;
    setLoading(true);
    setError(null);
    try {
      const data = await postsApi.fetchPosts({ limit: 100 });
      setPosts((data.items || []).map(apiToFrontend));
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to load posts");
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    loadPosts();
  }, [loadPosts]);

  const addPost = async (data) => {
    const created = await postsApi.createPost(frontendToApi(data));
    const frontend = apiToFrontend(created);
    setPosts((prev) => [frontend, ...prev]);
    return frontend.slug;
  };

  const updatePost = async (slug, data) => {
    const updated = await postsApi.updatePost(slug, frontendToApi(data));
    const frontend = apiToFrontend(updated);
    setPosts((prev) =>
      prev.map((p) => (p.slug === slug ? frontend : p))
    );
  };

  const deletePost = async (slug) => {
    await postsApi.deletePost(slug);
    setPosts((prev) => prev.filter((p) => p.slug !== slug));
  };

  const getPost = (slug) => posts.find((p) => p.slug === slug);

  const publishedPosts = posts.filter((p) => p.status !== "draft");
  const draftPosts = posts.filter((p) => p.status === "draft");

  return (
    <DashboardContext.Provider
      value={{
        posts,
        loading,
        error,
        addPost,
        updatePost,
        deletePost,
        getPost,
        publishedPosts,
        draftPosts,
        reload: loadPosts,
      }}
    >
      {children}
    </DashboardContext.Provider>
  );
}

export function useDashboard() {
  const ctx = useContext(DashboardContext);
  if (!ctx) throw new Error("useDashboard must be used within DashboardProvider");
  return ctx;
}
