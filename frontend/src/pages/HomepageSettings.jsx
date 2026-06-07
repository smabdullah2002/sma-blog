import { useState, useEffect } from "react";
import DashboardLayout from "../components/dashboard/DashboardLayout";
import * as settingsApi from "../api/settings";
import * as postsApi from "../api/posts";

export default function HomepageSettings() {
  const [settings, setSettings] = useState(null);
  const [allPosts, setAllPosts] = useState([]);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    Promise.all([
      settingsApi.fetchSettings(),
      postsApi.fetchPosts({ limit: 100 }),
    ])
      .then(([s, p]) => {
        setSettings(s);
        setAllPosts(p.items || []);
      })
      .catch(() => setError("Failed to load settings"));
  }, []);

  const handleChange = (field, value) => {
    setSettings((prev) => ({ ...prev, [field]: value }));
    setSaved(false);
  };

  const handleSave = async () => {
    setSaving(true);
    setError("");
    setSaved(false);
    try {
      await settingsApi.updateSettings({
        featured_post_slug: settings.featured_post_slug,
        quote_text: settings.quote_text,
        quote_attribution: settings.quote_attribution,
        edition_label: settings.edition_label,
        edition_date: settings.edition_date,
      });
      setSaved(true);
    } catch (err) {
      if (err.response?.status === 401) {
        setError("Session expired. Please log in again.");
      } else {
        setError(err.response?.data?.detail || "Failed to save settings");
      }
    } finally {
      setSaving(false);
    }
  };

  if (!settings) {
    return (
      <DashboardLayout>
        <div className="p-8 text-center font-body text-sm text-neutral-500">
          Loading settings...
        </div>
      </DashboardLayout>
    );
  }

  const selectedPost = allPosts.find((p) => p.slug === settings.featured_post_slug);

  return (
    <DashboardLayout>
      <div className="p-6 md:p-8 max-w-3xl">
        <div className="font-mono text-xs uppercase tracking-widest text-neutral-500 mb-2">
          Customize
        </div>
        <div className="w-12 h-1 bg-accent mb-6" />
        <h1 className="font-serif text-3xl md:text-4xl font-black tracking-tighter mb-8">
          Homepage Settings<span className="text-accent">.</span>
        </h1>

        {error && (
          <div className="mb-6 border-2 border-accent p-4 bg-accent/5">
            <p className="font-sans text-xs uppercase tracking-widest font-semibold text-accent">{error}</p>
          </div>
        )}

        {saved && (
          <div className="mb-6 border-2 border-ink p-4 bg-neutral-100">
            <p className="font-sans text-xs uppercase tracking-widest font-semibold text-ink">
              Settings saved successfully.
            </p>
          </div>
        )}

        <div className="space-y-8">
          {/* Featured Post */}
          <div className="border-2 border-ink p-6">
            <label className="block font-sans text-xs uppercase tracking-widest font-semibold text-neutral-500 mb-3">
              Featured Story
            </label>
            <p className="font-body text-xs text-neutral-500 mb-3">
              Select which post appears in the hero section of the homepage.
            </p>
            <select
              value={settings.featured_post_slug}
              onChange={(e) => handleChange("featured_post_slug", e.target.value)}
              className="w-full border-b-2 border-ink bg-transparent px-2 py-3 font-serif text-base text-ink focus-visible:outline-none focus-visible:bg-neutral-100"
            >
              <option value="">-- Select a post --</option>
              {allPosts
                .filter((p) => p.status !== "draft")
                .map((p) => (
                  <option key={p.slug} value={p.slug}>
                    {p.title}
                  </option>
                ))}
            </select>

            {selectedPost && (
              <div className="mt-4 flex gap-4 items-start border border-ink p-4 bg-neutral-100/50">
                {selectedPost.cover_image && (
                  <img
                    src={selectedPost.cover_image}
                    alt=""
                    className="w-24 aspect-[16/9] object-cover grayscale shrink-0"
                  />
                )}
                <div className="min-w-0">
                  <div className="font-serif text-base font-bold">{selectedPost.title}</div>
                  <p className="font-body text-xs text-neutral-500 mt-1 line-clamp-2">
                    {selectedPost.excerpt}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Quote */}
          <div className="border-2 border-ink p-6">
            <label className="block font-sans text-xs uppercase tracking-widest font-semibold text-neutral-500 mb-3">
              Featured Quote
            </label>
            <p className="font-body text-xs text-neutral-500 mb-3">
              The quote displayed below the edition header on the homepage.
            </p>
            <textarea
              value={settings.quote_text}
              onChange={(e) => handleChange("quote_text", e.target.value)}
              rows={2}
              className="w-full border-b-2 border-ink bg-transparent px-2 py-3 font-serif text-lg italic text-ink placeholder:text-neutral-400 focus-visible:outline-none focus-visible:bg-neutral-100 resize-none"
            />
            <div className="mt-4">
              <label className="block font-sans text-[10px] uppercase tracking-widest text-neutral-500 mb-1.5">
                Attribution
              </label>
              <input
                value={settings.quote_attribution}
                onChange={(e) => handleChange("quote_attribution", e.target.value)}
                placeholder="George Box, Statistician"
                className="w-full border-b-2 border-ink bg-transparent px-2 py-2 font-mono text-xs text-ink placeholder:text-neutral-400 focus-visible:outline-none focus-visible:bg-neutral-100"
              />
            </div>
          </div>

          {/* Edition */}
          <div className="border-2 border-ink p-6">
            <label className="block font-sans text-xs uppercase tracking-widest font-semibold text-neutral-500 mb-3">
              Edition Info
            </label>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block font-sans text-[10px] uppercase tracking-widest text-neutral-500 mb-1.5">
                  Label
                </label>
                <input
                  value={settings.edition_label}
                  onChange={(e) => handleChange("edition_label", e.target.value)}
                  placeholder="Vol. I No. 12"
                  className="w-full border-b-2 border-ink bg-transparent px-2 py-2 font-mono text-xs text-ink placeholder:text-neutral-400 focus-visible:outline-none focus-visible:bg-neutral-100"
                />
              </div>
              <div>
                <label className="block font-sans text-[10px] uppercase tracking-widest text-neutral-500 mb-1.5">
                  Date Override
                </label>
                <input
                  value={settings.edition_date}
                  onChange={(e) => handleChange("edition_date", e.target.value)}
                  placeholder='Leave blank for today'
                  className="w-full border-b-2 border-ink bg-transparent px-2 py-2 font-mono text-xs text-ink placeholder:text-neutral-400 focus-visible:outline-none focus-visible:bg-neutral-100"
                />
              </div>
            </div>
          </div>

          {/* Save */}
          <button
            onClick={handleSave}
            disabled={saving}
            className="w-full py-4 font-sans text-xs uppercase tracking-widest font-semibold bg-ink text-bg hover:bg-white hover:text-ink hover:border-2 hover:border-ink transition-all duration-200 disabled:opacity-40 disabled:pointer-events-none"
          >
            {saving ? "Saving..." : "Save Homepage Settings"}
          </button>
        </div>
      </div>
    </DashboardLayout>
  );
}
