import { useState } from "react";
import { subscribe } from "../../api/newsletter";

export default function SubscribeForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle"); // idle | loading | success | error

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("loading");
    try {
      await subscribe(email);
      setStatus("success");
      setEmail("");
    } catch {
      setStatus("error");
    }
  };

  if (status === "success") {
    return (
      <div className="border-2 border-ink p-4 bg-neutral-100 text-center">
        <p className="font-sans text-xs uppercase tracking-widest font-semibold text-ink">
          Thanks for subscribing!
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="flex border-2 border-ink">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="your@email.com"
          required
          disabled={status === "loading"}
          className="flex-1 bg-transparent px-3 py-2.5 font-mono text-sm text-ink placeholder:text-neutral-500 focus-visible:bg-neutral-100 focus-visible:outline-none disabled:opacity-40"
        />
        <button
          type="submit"
          disabled={status === "loading"}
          className="bg-ink text-bg px-5 py-2.5 font-sans text-xs uppercase tracking-widest font-semibold hover:bg-white hover:text-ink transition-all duration-200 disabled:opacity-40"
        >
          {status === "loading" ? "Sending..." : "Subscribe"}
        </button>
      </div>
      {status === "error" && (
        <p className="font-sans text-[10px] uppercase tracking-widest text-accent mt-1">
          Something went wrong. Try again.
        </p>
      )}
    </form>
  );
}
