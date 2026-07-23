import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Container from "../components/layout/Container";
import PostCard from "../components/post/PostCard";
import SubscribeForm from "../components/newsletter/SubscribeForm";
import * as settingsApi from "../api/settings";
import * as postsApi from "../api/posts";
import { mapPostFromApi } from "../utils/mapPost";
import { HeroSkeleton, PostGridSkeleton } from "../components/ui/Skeleton";

const FALLBACK_SETTINGS = {
  featured_post_slug: "",
  quote_text: "All models are wrong, but some are useful.",
  quote_attribution: "George Box, Statistician",
  edition_label: "Vol. I No. 12",
  edition_date: "",
};

export default function Home() {
  const [settings, setSettings] = useState(FALLBACK_SETTINGS);
  const [featuredPost, setFeaturedPost] = useState(null);
  const [recentPosts, setRecentPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const s = await settingsApi.fetchSettings();
        setSettings(s);
        if (s.featured_post_slug) {
          try {
            const p = await postsApi.fetchPost(s.featured_post_slug);
            setFeaturedPost(mapPostFromApi(p));
          } catch {
            setFeaturedPost(null);
          }
        } else {
          setFeaturedPost(null);
        }
        try {
          const all = await postsApi.fetchPosts({ limit: 50 });
          setRecentPosts((all.items || []).map(mapPostFromApi));
        } catch {
          setRecentPosts([]);
        }
      } catch {
        setFeaturedPost(null);
        setRecentPosts([]);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const editionDate = settings.edition_date ||
    new Date().toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });

  return (
    <>
      {/* Front Page Header */}
      <div className="border-b-4 border-ink bg-bg">
        <Container className="py-6 md:py-8">
          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 mb-5 font-mono text-[10px] uppercase tracking-widest text-neutral-500">
            <span>{editionDate}</span>
            <span className="hidden sm:inline text-neutral-400">|</span>
            <span className="hidden sm:inline">{settings.edition_label}</span>
            <span className="hidden sm:inline text-neutral-400">|</span>
            <span>from Bangladesh</span>
          </div>

          <div className="border-t border-ink mb-5" />

          <div className="text-center max-w-2xl mx-auto">
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-black italic tracking-tighter leading-[1.1] text-ink mb-3">
              &ldquo;{settings.quote_text}&rdquo;
            </h2>
            <p className="font-sans text-xs uppercase tracking-widest text-neutral-500">
              &mdash; {settings.quote_attribution}
            </p>
          </div>

          <div className="border-t border-ink mt-5 mb-4" />

          {recentPosts.length > 0 && (
            <div className="text-center">
              <div className="font-sans text-[10px] uppercase tracking-widest font-semibold text-neutral-500 mb-2">
                Inside This Issue
              </div>
              <div className="flex flex-wrap justify-center gap-x-6 gap-y-1 font-mono text-[11px] uppercase tracking-widest text-ink">
                {recentPosts.slice(0, 6).map((post) => (
                  <span key={post.slug} className="hover:text-accent transition-colors duration-200">
                    {post.title}
                  </span>
                ))}
              </div>
            </div>
          )}
        </Container>
      </div>

      {/* Hero Section */}
      <section className="border-b-4 border-ink newsprint-texture">
        <Container className="py-8 md:py-12">
          {loading ? (
            <HeroSkeleton />
          ) : featuredPost ? (
            <div className="grid grid-cols-1 md:grid-cols-12 gap-0">
              <div className="md:col-span-8 md:border-r border-ink pr-0 md:pr-8 pb-8 md:pb-0">
                <div className="mb-2 font-mono text-[10px] uppercase tracking-widest text-neutral-500">
                  Featured Story
                </div>
                <div className="mb-4 overflow-hidden">
                  <img
                    src={featuredPost.coverImage}
                    alt={featuredPost.title}
                    className="w-full aspect-[16/9] object-cover grayscale hover:sepia-[50%] transition-all duration-500"
                  />
                </div>
                <div className="flex flex-wrap gap-x-3 gap-y-1 mb-3">
                  {featuredPost.tags?.map((tag) => (
                    <span
                      key={tag.slug}
                      className="font-mono text-[10px] uppercase tracking-widest text-accent font-semibold"
                    >
                      {tag.name}
                    </span>
                  ))}
                  <span className="font-mono text-[10px] uppercase tracking-widest text-neutral-500">
                    {featuredPost.readTimeMinutes} min read
                  </span>
                  <span className="font-mono text-[10px] uppercase tracking-widest text-neutral-500">
                    {featuredPost.publishedAt}
                  </span>
                </div>
                <h1 className="font-serif text-4xl sm:text-5xl lg:text-7xl font-black tracking-tighter leading-[0.95] mb-4">
                  <span className="float-left text-7xl sm:text-8xl lg:text-9xl leading-none mr-2 text-accent font-serif">
                    {featuredPost.title.charAt(0)}
                  </span>
                  {featuredPost.title.slice(1, 29)}
                  <span className="text-accent">.</span>
                </h1>
                <p className="font-body text-sm md:text-base text-neutral-600 leading-relaxed text-justify mb-4 max-w-2xl">
                  {featuredPost.excerpt}
                </p>
                <Link
                  to={`/post/${featuredPost.slug}`}
                  className="inline-block font-sans text-xs uppercase tracking-widest font-semibold text-ink hover:text-accent transition-colors duration-200 underline underline-offset-4 decoration-2 decoration-accent"
                >
                  Read Full Story &rarr;
                </Link>
              </div>

              <div className="md:col-span-4 pl-0 md:pl-8">
                <div className="mb-8">
                  <h3 className="font-sans text-xs uppercase tracking-widest font-semibold text-neutral-500 mb-3">
                    Get the Newsletter
                  </h3>
                  <p className="font-body text-xs text-neutral-600 mb-3 leading-relaxed">
                    All models are wrong, but some are useful. Delivered to your inbox.
                  </p>
                  <SubscribeForm />
                </div>

                <div className="border-t border-ink pt-6">
                  <h3 className="font-sans text-xs uppercase tracking-widest font-semibold text-neutral-500 mb-3">
                    Trending Topics
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {["Philosophy", "Mental Models", "Reasoning", "Psychology"].map((tag) => (
                      <Link
                        key={tag}
                        to={`/tag/${tag.toLowerCase().replace(/\s+/g, "-")}`}
                        className="font-sans text-xs uppercase tracking-widest font-semibold border border-ink px-3 py-1.5 hover:bg-ink hover:text-bg transition-colors duration-200"
                      >
                        {tag}
                      </Link>
                    ))}
                  </div>
                </div>


              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <h1 className="font-serif text-4xl md:text-5xl font-black tracking-tighter mb-4">
                Welcome to SMA Blog<span className="text-accent">.</span>
              </h1>
            </div>
          )}
        </Container>
      </section>

      {/* Latest Stories */}
      <Container>
        {loading || recentPosts.length > 0 ? (
          <>
            <div className="py-10 text-center font-serif text-2xl text-neutral-400 tracking-[1em] select-none">
              &#x2727; &#x2727; &#x2727;
            </div>
            <section>
              <div className="mb-6">
                <h2 className="font-sans text-xs uppercase tracking-widest font-semibold text-neutral-500 mb-1">
                  Latest from SMA Blog
                </h2>
                <div className="w-16 h-1 bg-accent" />
              </div>
              {loading ? (
                <PostGridSkeleton count={4} />
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
                  {recentPosts.map((post, i) => (
                    <div
                      key={post.slug}
                      className={`border-r border-ink ${i % 4 === 3 ? "border-r-0" : ""}`}
                    >
                      <PostCard post={post} />
                    </div>
                  ))}
                </div>
              )}
            </section>
            <div className="py-10 text-center font-serif text-2xl text-neutral-400 tracking-[1em] select-none">
              &#x2727; &#x2727; &#x2727;
            </div>
          </>
        ) : null}
      </Container>
    </>
  );
}
