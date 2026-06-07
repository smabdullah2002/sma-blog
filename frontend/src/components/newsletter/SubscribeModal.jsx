import { useState } from "react";
import { X } from "lucide-react";
import { subscribe } from "../../api/newsletter";

export default function SubscribeModal({ open, onClose }) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle"); // idle | loading | success | error

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("loading");
    try {
      await subscribe(email);
      setStatus("success");
    } catch {
      setStatus("error");
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/60">
      <div className="relative w-full max-w-lg mx-4 bg-bg border-4 border-ink">
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute top-4 right-4 h-11 w-11 border border-ink flex items-center justify-center hover:bg-ink hover:text-bg transition-all duration-200"
        >
          <X size={18} strokeWidth={1.5} />
        </button>

        <div className="p-8 md:p-12">
          {status === "success" ? (
            <div className="text-center py-6">
              <div className="font-serif text-6xl mb-4 text-accent">&#x2713;</div>
              <h2 className="font-serif text-2xl font-bold mb-2">
                You're subscribed<span className="text-accent">.</span>
              </h2>
              <p className="font-body text-sm text-neutral-600">
                Thanks, <span className="font-semibold">{email}</span>. Check your inbox for a confirmation.
              </p>
            </div>
          ) : (
            <>
              <div className="font-mono text-xs uppercase tracking-widest text-neutral-500 mb-2">
                Never Miss an Edition
              </div>
              <h2 className="font-serif text-3xl md:text-4xl font-black tracking-tighter mb-3">
                Subscribe to the Newsletter<span className="text-accent">.</span>
              </h2>
              <p className="font-body text-sm text-neutral-600 leading-relaxed mb-6">
                All models are wrong, but some are useful. Delivered to your inbox every week.
              </p>
              <form onSubmit={handleSubmit}>
                <div className="flex border-2 border-ink mb-4">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    required
                    disabled={status === "loading"}
                    className="flex-1 bg-transparent px-4 py-3 font-mono text-sm text-ink placeholder:text-neutral-500 focus-visible:bg-neutral-100 focus-visible:outline-none disabled:opacity-40"
                  />
                  <button
                    type="submit"
                    disabled={status === "loading"}
                    className="bg-ink text-bg px-6 py-3 font-sans text-xs uppercase tracking-widest font-semibold hover:bg-white hover:text-ink transition-all duration-200 disabled:opacity-40"
                  >
                    {status === "loading" ? "Sending..." : "Subscribe"}
                  </button>
                </div>
              </form>
              {status === "error" && (
                <p className="font-sans text-[10px] uppercase tracking-widest text-accent mb-2">
                  Something went wrong. Please try again.
                </p>
              )}
              <p className="font-mono text-[10px] uppercase tracking-widest text-neutral-400">
                No spam. Unsubscribe anytime.
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
