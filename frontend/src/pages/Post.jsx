import { useState, useEffect, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import Container from "../components/layout/Container";
import { fetchPost } from "../api/posts";
import { mapPostFromApi } from "../utils/mapPost";
import { ArticleSkeleton } from "../components/ui/Skeleton";

export default function Post() {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const firstPRef = useRef(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const p = await fetchPost(slug);
        setPost(mapPostFromApi(p));
      } catch {
        setPost(null);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [slug]);

  if (loading) {
    return (
      <section className="py-12 md:py-16">
        <Container>
          <ArticleSkeleton />
        </Container>
      </section>
    );
  }

  if (!post) {
    return (
      <section className="py-20">
        <Container>
          <div className="max-w-xl mx-auto text-center">
            <div className="font-mono text-xs uppercase tracking-widest text-neutral-500 mb-2">
              Error 404
            </div>
            <h1 className="font-serif text-4xl font-bold mb-4">
              Essay not found<span className="text-accent">.</span>
            </h1>
            <p className="font-body text-sm text-neutral-600 mb-6">
              This essay may have been moved or never existed.
            </p>
            <Link
              to="/"
              className="inline-flex bg-ink text-bg px-6 py-3 font-sans text-xs uppercase tracking-widest font-semibold hover:bg-white hover:text-ink hover:border hover:border-ink transition-all duration-200"
            >
              Return Home
            </Link>
          </div>
        </Container>
      </section>
    );
  }

  return (
    <article className="py-12 md:py-16">
      <Container>
        <div className="max-w-3xl mx-auto">
          {/* Metadata Bar */}
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mb-2 font-mono text-[10px] uppercase tracking-widest">
            {post.tags.map((tag) => (
              <Link
                key={tag.slug}
                to={`/tag/${tag.slug}`}
                className="text-accent font-semibold hover:underline underline-offset-2"
              >
                {tag.name}
              </Link>
            ))}
            <span className="text-neutral-500">{post.readTimeMinutes} min read</span>
            <span className="text-neutral-500">{post.publishedAt}</span>
          </div>

          {/* Title */}
          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-black tracking-tighter leading-[0.95] mb-2">
            {post.title}
          </h1>
          {post.subtitle && (
            <p className="font-body text-lg text-neutral-600 leading-snug mb-4">
              {post.subtitle}
            </p>
          )}

          {/* Author */}
          <div className="font-sans text-xs uppercase tracking-widest font-semibold text-neutral-500 mb-1">
            By {post.author.name}
          </div>

          {/* Divider */}
          <div className="w-16 h-1 bg-accent mb-8" />

          {/* Cover Image */}
          {post.coverImageFull && (
            <figure className="mb-8">
              <div className="overflow-hidden mb-2">
                <img
                  src={post.coverImageFull}
                  alt={post.title}
                  className="w-full aspect-[16/9] object-cover grayscale hover:sepia-[50%] transition-all duration-500"
                />
              </div>
              {post.coverCaption && (
                <figcaption className="font-mono text-[10px] uppercase tracking-widest text-neutral-500">
                  {post.coverCaption}
                </figcaption>
              )}
            </figure>
          )}

          {/* Separator before content */}
          <div className="w-full h-1 bg-accent my-8" />

          {/* Article Body */}
          <div className="font-body text-base leading-relaxed text-justify text-neutral-700 space-y-5">
            <Markdown
              remarkPlugins={[remarkGfm]}
              components={{
                p: ({ children, ...props }) => {
                  if (firstPRef.current) {
                    firstPRef.current = false;
                    const text = children?.toString() || "";
                    return (
                      <p className="leading-relaxed" {...props}>
                        <span className="float-left text-6xl sm:text-7xl leading-none mr-3 mt-1 text-accent font-serif">
                          {text.charAt(0)}
                        </span>
                        {text.slice(1)}
                      </p>
                    );
                  }
                  return (
                    <p className="leading-relaxed text-justify" {...props}>
                      {children}
                    </p>
                  );
                },
                h2: ({ children, ...props }) => (
                  <h2 className="font-serif text-2xl sm:text-3xl font-bold mt-10 mb-4 leading-tight" {...props}>
                    {children}
                  </h2>
                ),
                h3: ({ children, ...props }) => (
                  <h3 className="font-serif text-xl font-bold mt-8 mb-3 leading-tight" {...props}>
                    {children}
                  </h3>
                ),
                blockquote: ({ children, ...props }) => (
                  <blockquote className="border-l-4 border-ink pl-4 my-6 font-serif text-base italic text-neutral-600" {...props}>
                    {children}
                  </blockquote>
                ),
                ul: ({ children, ...props }) => (
                  <ul className="list-disc pl-6 space-y-2 my-4" {...props}>
                    {children}
                  </ul>
                ),
                ol: ({ children, ...props }) => (
                  <ol className="list-decimal pl-6 space-y-2 my-4" {...props}>
                    {children}
                  </ol>
                ),
                li: ({ children, ...props }) => (
                  <li className="leading-relaxed" {...props}>
                    {children}
                  </li>
                ),
                strong: ({ children, ...props }) => (
                  <strong className="font-semibold text-ink" {...props}>
                    {children}
                  </strong>
                ),
                code: ({ children, className, ...props }) => {
                  const isBlock = className?.startsWith("language-");
                  if (isBlock) {
                    return <code {...props}>{children}</code>;
                  }
                  return (
                    <code className="font-mono text-sm bg-neutral-100 px-1.5 py-0.5 text-accent" {...props}>
                      {children}
                    </code>
                  );
                },
                pre: ({ children, ...props }) => {
                  const lang = children?.props?.className?.replace("language-", "") || "";
                  return (
                    <div className="my-8 border border-neutral-300">
                      {lang && (
                        <div className="flex items-center px-4 py-1.5 bg-neutral-800 text-neutral-400 font-mono text-[10px] uppercase tracking-widest">
                          {lang}
                        </div>
                      )}
                      <pre className="bg-neutral-900 text-neutral-100 p-4 overflow-x-auto text-sm leading-relaxed m-0" {...props}>
                        {children}
                      </pre>
                    </div>
                  );
                },
                img: ({ src, alt, ...props }) => (
                  <figure className="my-8">
                    <img
                      src={src}
                      alt={alt}
                      className="w-full max-w-full object-cover grayscale"
                      {...props}
                    />
                    {alt && (
                      <figcaption className="font-mono text-[10px] uppercase tracking-widest text-neutral-500 mt-2 text-center">
                        {alt}
                      </figcaption>
                    )}
                  </figure>
                ),
                em: ({ children, ...props }) => (
                  <em className="italic" {...props}>
                    {children}
                  </em>
                ),
                hr: () => (
                  <hr className="border-t border-muted my-8" />
                ),
                a: ({ children, href, ...props }) => (
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-accent underline underline-offset-4 decoration-2 hover:text-ink transition-colors duration-200"
                    {...props}
                  >
                    {children}
                  </a>
                ),
                del: ({ children, ...props }) => (
                  <del className="line-through text-neutral-500" {...props}>
                    {children}
                  </del>
                ),
              }}
            >
              {post.content}
            </Markdown>
          </div>

          {/* Tags Footer */}
          <div className="border-t border-ink mt-12 pt-8">
            <div className="font-sans text-xs uppercase tracking-widest font-semibold text-neutral-500 mb-3">
              Topics
            </div>
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <Link
                  key={tag.slug}
                  to={`/tag/${tag.slug}`}
                  className="font-sans text-xs uppercase tracking-widest font-semibold border border-ink px-3 py-1.5 hover:bg-ink hover:text-bg transition-colors duration-200"
                >
                  {tag.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Ornamental Divider */}
          <div className="py-12 text-center font-serif text-2xl text-neutral-400 tracking-[1em] select-none">
            &#x2727; &#x2727; &#x2727;
          </div>

          {/* Comments Placeholder */}
          <section>
            <h3 className="font-sans text-xs uppercase tracking-widest font-semibold text-neutral-500 mb-4">
              Discussion
            </h3>
            <div className="border-2 border-ink p-8 text-center">
              <p className="font-body text-sm text-neutral-500 mb-2">
                Comments are currently being typeset.
              </p>
              <p className="font-mono text-[10px] uppercase tracking-widest text-neutral-400">
                Letters to the editor will be accepted in our next edition.
              </p>
            </div>
          </section>
        </div>
      </Container>
    </article>
  );
}
