import { Link } from "react-router-dom";
import Container from "../components/layout/Container";

export default function NotFound() {
  return (
    <section className="py-20 md:py-32">
      <Container>
        <div className="max-w-xl mx-auto text-center">
          {/* Notice Box */}
          <div className="border-4 border-ink p-8 md:p-12 mb-8 bg-bg hard-shadow-hover">
            <div className="font-mono text-xs uppercase tracking-widest text-neutral-500 mb-1">
              Error 404
            </div>
            <div className="w-12 h-1 bg-accent mx-auto mb-8" />

            <div className="font-serif text-8xl md:text-9xl font-black tracking-tighter leading-none text-ink mb-6">
              404
            </div>

            <div className="font-mono text-[10px] uppercase tracking-widest text-accent font-semibold mb-4">
              Notice
            </div>

            <h1 className="font-serif text-3xl md:text-4xl font-bold leading-tight mb-4">
              This page has not been printed<span className="text-accent">.</span>
            </h1>

            <p className="font-body text-base text-neutral-600 leading-relaxed mb-8 max-w-md mx-auto">
              The article you're looking for may have been moved, renamed, or never existed.
              Our archives are deep, but even the best editorial teams make mistakes.
            </p>

            <Link
              to="/"
              className="inline-flex items-center gap-2 bg-ink text-bg px-8 py-3.5 font-sans text-xs uppercase tracking-widest font-semibold hover:bg-white hover:text-ink hover:border hover:border-ink transition-all duration-200"
            >
              Return to Homepage
            </Link>
          </div>

          {/* Edition info */}
          <div className="font-mono text-[10px] uppercase tracking-widest text-neutral-500">
            Edition: Vol 1.0 | Error 404 | Page Not Found
          </div>
        </div>
      </Container>
    </section>
  );
}
