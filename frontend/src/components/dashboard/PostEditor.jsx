import { useState, useEffect, useRef } from "react";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { uploadImage } from "../../api/uploads";

function makeSlug(title) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "") || "";
}

export default function PostEditor({ initial, onSave }) {
  const [title, setTitle] = useState(initial?.title || "");
  const [slug, setSlug] = useState(initial?.slug || "");
  const [subtitle, setSubtitle] = useState(initial?.subtitle || "");
  const [excerpt, setExcerpt] = useState(initial?.excerpt || "");
  const [content, setContent] = useState(initial?.content || "");
  const [coverImage, setCoverImage] = useState(initial?.coverImage || "");
  const [coverCaption, setCoverCaption] = useState(initial?.coverCaption || "");
  const [tagsInput, setTagsInput] = useState(
    initial?.tags?.map((t) => t.name).join(", ") || ""
  );
  const [status, setStatus] = useState(initial?.status || "draft");
  const [tab, setTab] = useState("write");
  const [uploading, setUploading] = useState(false);
  const [uploadingInline, setUploadingInline] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [saving, setSaving] = useState(false);
  const fileInputRef = useRef(null);
  const inlineInputRef = useRef(null);
  const textareaRef = useRef(null);

  // Auto-generate slug from title (only on new posts)
  useEffect(() => {
    if (!initial && title) {
      setSlug(makeSlug(title));
    }
  }, [title, initial]);

  const insertAtCursor = (text) => {
    const ta = textareaRef.current;
    if (!ta) return;
    const start = ta.selectionStart;
    const end = ta.selectionEnd;
    const before = content.slice(0, start);
    const after = content.slice(end);
    setContent(before + text + after);
    requestAnimationFrame(() => {
      ta.focus();
      ta.selectionStart = ta.selectionEnd = start + text.length;
    });
  };

  const handleInlineUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingInline(true);
    try {
      const result = await uploadImage(file);
      insertAtCursor(`![](${result.url})`);
    } catch {
      alert("Upload failed. Check your Cloudinary configuration.");
    } finally {
      setUploadingInline(false);
    }
  };

  const handleUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const result = await uploadImage(file);
      setCoverImage(result.url);
    } catch {
      alert("Upload failed. Check your Cloudinary configuration.");
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async (publish) => {
    setSaving(true);
    try {
      await onSave({
        title,
        subtitle,
        slug: slug || makeSlug(title),
        excerpt,
        content,
        coverImage,
        coverCaption,
        tags: tagsInput.split(",").map((t) => t.trim()).filter(Boolean),
        status: publish ? "published" : "draft",
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 min-h-[600px]">
      {/* Metadata Panel — left sidebar */}
      <div className="lg:col-span-4 border-r border-ink p-6 space-y-5 bg-neutral-100/30">
        <h3 className="font-sans text-[10px] uppercase tracking-widest font-semibold text-neutral-500">
          Metadata
        </h3>

        <div>
          <label className="block font-sans text-[10px] uppercase tracking-widest text-neutral-500 mb-1.5">
            Title
          </label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Essay title"
            className="w-full border-b-2 border-ink bg-transparent px-2 py-2 font-serif text-base font-semibold text-ink placeholder:text-neutral-400 focus-visible:bg-neutral-100 focus-visible:outline-none"
          />
        </div>

        <div>
          <label className="block font-sans text-[10px] uppercase tracking-widest text-neutral-500 mb-1.5">
            Slug
          </label>
          <input
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            placeholder="essay-slug"
            className="w-full border-b-2 border-ink bg-transparent px-2 py-2 font-mono text-xs text-ink placeholder:text-neutral-400 focus-visible:bg-neutral-100 focus-visible:outline-none"
          />
        </div>

        <div>
          <label className="block font-sans text-[10px] uppercase tracking-widest text-neutral-500 mb-1.5">
            Subtitle
          </label>
          <input
            value={subtitle}
            onChange={(e) => setSubtitle(e.target.value)}
            placeholder="Optional subtitle"
            className="w-full border-b-2 border-ink bg-transparent px-2 py-2 font-body text-sm text-ink placeholder:text-neutral-400 focus-visible:bg-neutral-100 focus-visible:outline-none"
          />
        </div>

        <div>
          <label className="block font-sans text-[10px] uppercase tracking-widest text-neutral-500 mb-1.5">
            Excerpt
          </label>
          <textarea
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
            placeholder="Brief summary for cards"
            rows={2}
            className="w-full border-b-2 border-ink bg-transparent px-2 py-2 font-body text-sm text-ink placeholder:text-neutral-400 focus-visible:bg-neutral-100 focus-visible:outline-none resize-none"
          />
        </div>

        <div>
          <label className="block font-sans text-[10px] uppercase tracking-widest text-neutral-500 mb-1.5">
            Tags (comma separated)
          </label>
          <input
            value={tagsInput}
            onChange={(e) => setTagsInput(e.target.value)}
            placeholder="Philosophy, Reasoning"
            className="w-full border-b-2 border-ink bg-transparent px-2 py-2 font-mono text-xs text-ink placeholder:text-neutral-400 focus-visible:bg-neutral-100 focus-visible:outline-none"
          />
        </div>

        <div>
          <label className="block font-sans text-[10px] uppercase tracking-widest text-neutral-500 mb-1.5">
            Cover Image
          </label>
          <div className="flex gap-2">
            <input
              value={coverImage}
              onChange={(e) => setCoverImage(e.target.value)}
              placeholder="https://..."
              className="flex-1 border-b-2 border-ink bg-transparent px-2 py-2 font-mono text-xs text-ink placeholder:text-neutral-400 focus-visible:bg-neutral-100 focus-visible:outline-none"
            />
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleUpload}
              className="hidden"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="shrink-0 px-3 py-2 font-sans text-[10px] uppercase tracking-widest font-semibold border border-ink bg-bg text-ink hover:bg-ink hover:text-bg transition-all duration-200 disabled:opacity-40"
            >
              {uploading ? "..." : "Upload"}
            </button>
          </div>
          {coverImage && (
            <img
              src={coverImage}
              alt="Cover preview"
              className="mt-2 w-full aspect-[16/9] object-cover grayscale"
            />
          )}
        </div>

        <div>
          <label className="block font-sans text-[10px] uppercase tracking-widest text-neutral-500 mb-1.5">
            Cover Caption
          </label>
          <input
            value={coverCaption}
            onChange={(e) => setCoverCaption(e.target.value)}
            placeholder='Fig. 1.0 — Description'
            className="w-full border-b-2 border-ink bg-transparent px-2 py-2 font-mono text-xs text-ink placeholder:text-neutral-400 focus-visible:bg-neutral-100 focus-visible:outline-none"
          />
        </div>

        {/* Actions */}
        <div className="pt-4 border-t border-ink space-y-3">
          <button
            onClick={() => handleSave(false)}
            disabled={!title || saving}
            className="w-full py-3 font-sans text-xs uppercase tracking-widest font-semibold border border-ink bg-bg text-ink hover:bg-ink hover:text-bg transition-all duration-200 disabled:opacity-30 disabled:pointer-events-none"
          >
            {saving ? "Saving..." : "Save Draft"}
          </button>
          <button
            onClick={() => handleSave(true)}
            disabled={!title || saving}
            className="w-full py-3 font-sans text-xs uppercase tracking-widest font-semibold bg-ink text-bg hover:bg-white hover:text-ink hover:border hover:border-ink transition-all duration-200 disabled:opacity-30 disabled:pointer-events-none"
          >
            {saving ? "Publishing..." : "Publish"}
          </button>
        </div>
      </div>

      {/* Editor + Preview — right area */}
      <div className="lg:col-span-8 flex flex-col">
        {/* Tab switcher */}
        <div className="flex border-b border-ink">
          <button
            onClick={() => setTab("write")}
            className={`flex-1 py-3 font-sans text-xs uppercase tracking-widest font-semibold transition-all duration-200 ${
              tab === "write"
                ? "bg-ink text-bg"
                : "bg-bg text-neutral-500 hover:text-ink"
            }`}
          >
            Write
          </button>
          <button
            onClick={() => setTab("preview")}
            className={`flex-1 py-3 font-sans text-xs uppercase tracking-widest font-semibold transition-all duration-200 ${
              tab === "preview"
                ? "bg-ink text-bg"
                : "bg-bg text-neutral-500 hover:text-ink"
            }`}
          >
            Preview
          </button>
        </div>

        {tab === "write" ? (
          <>
            {/* Editor Toolbar */}
            <div className="flex items-center gap-1 px-4 py-2 border-b border-ink bg-neutral-100/50">
              <input
                ref={inlineInputRef}
                type="file"
                accept="image/*"
                onChange={handleInlineUpload}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => inlineInputRef.current?.click()}
                disabled={uploadingInline}
                className="flex items-center gap-1.5 px-3 py-1.5 font-sans text-[10px] uppercase tracking-widest font-semibold text-neutral-600 hover:bg-ink hover:text-bg transition-all duration-200 disabled:opacity-40"
                title="Insert image"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
                {uploadingInline ? "..." : "Image"}
              </button>
              <span className="mx-2 w-px h-4 bg-neutral-300" />
              <button
                type="button"
                onClick={() => setShowHelp(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 font-sans text-[10px] uppercase tracking-widest font-semibold text-neutral-600 hover:bg-ink hover:text-bg transition-all duration-200"
                title="Formatting guide"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><path d="M12 17h.01"/></svg>
                Formatting Guide
              </button>
            </div>
            <textarea
              ref={textareaRef}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write your essay in Markdown...&#10;&#10;## Heading&#10;&#10;Paragraph text here. Use **bold** and *italic* for emphasis.&#10;&#10;> Blockquote for pull quotes&#10;&#10;- List item&#10;- Another item&#10;&#10;1. Numbered item&#10;2. Another numbered item"
              className="flex-1 min-h-[500px] w-full bg-transparent p-6 font-mono text-sm text-ink leading-relaxed placeholder:text-neutral-400 focus-visible:outline-none resize-none"
            />
          </>
        ) : (
          <div className="flex-1 overflow-y-auto p-6">
            {content ? (
              <div className="font-body text-base leading-relaxed text-justify text-neutral-700 max-w-2xl mx-auto space-y-5">
                <Markdown
                  remarkPlugins={[remarkGfm]}
                  components={{
                    h2: ({ children, ...props }) => (
                      <h2 className="font-serif text-2xl font-bold mt-8 mb-4 leading-tight" {...props}>
                        {children}
                      </h2>
                    ),
                    h3: ({ children, ...props }) => (
                      <h3 className="font-serif text-xl font-bold mt-6 mb-3 leading-tight" {...props}>
                        {children}
                      </h3>
                    ),
                    p: ({ children, ...props }) => (
                      <p className="leading-relaxed text-justify" {...props}>
                        {children}
                      </p>
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
                        <div className="my-6 border border-neutral-300">
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
                      <figure className="my-6">
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
                  }}
                >
                  {content}
                </Markdown>
              </div>
            ) : (
              <p className="font-body text-sm text-neutral-400 text-center pt-12">
                Nothing to preview yet. Start writing in Markdown.
              </p>
            )}
          </div>
        )}
      </div>

      {/* Formatting Guide Modal */}
      {showHelp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={() => setShowHelp(false)}>
          <div className="bg-bg border border-ink max-w-lg w-full mx-4 max-h-[80vh] overflow-y-auto shadow-xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between px-5 py-3 border-b border-ink">
              <h2 className="font-sans text-[10px] uppercase tracking-widest font-semibold text-ink">
                Formatting Guide
              </h2>
              <button onClick={() => setShowHelp(false)} className="font-sans text-[10px] uppercase tracking-widest text-neutral-500 hover:text-ink transition-colors duration-200">
                Close
              </button>
            </div>
            <div className="p-5 space-y-5 font-mono text-xs text-ink">
              <Section label="Headings">
                <Code># Heading 1</Code>
                <Code>## Heading 2</Code>
                <Code>### Heading 3</Code>
              </Section>

              <Section label="Emphasis">
                <Code>*italic text*</Code>
                <Code>**bold text**</Code>
                <Code>~~strikethrough~~</Code>
              </Section>

              <Section label="Blockquotes">
                <Code>{"> "}Quote or pull quote</Code>
              </Section>

              <Section label="Lists">
                <Code>- Unordered item</Code>
                <Code>1. Ordered item</Code>
              </Section>

              <Section label="Code">
                <Code>Inline `code`</Code>
                <Code>{`\`\`\`python`}{"\n"}def hello():{"\n"}    pass{"\n"}{"```"}</Code>
              </Section>

              <Section label="Images">
                <Code>![alt caption](url)</Code>
              </Section>

              <Section label="Links">
                <Code>[link text](url)</Code>
              </Section>

              <Section label="Horizontal Rule">
                <Code>---</Code>
              </Section>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Section({ label, children }) {
  return (
    <div>
      <p className="font-sans text-[10px] uppercase tracking-widest font-semibold text-neutral-500 mb-2">{label}</p>
      <div className="space-y-1">{children}</div>
    </div>
  );
}

function Code({ children }) {
  return (
    <pre className="bg-neutral-100 border border-neutral-300 px-3 py-1.5 text-xs font-mono text-ink leading-relaxed whitespace-pre-wrap m-0">{children}</pre>
  );
}
