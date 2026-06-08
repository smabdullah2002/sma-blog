import { useState, useEffect, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Container from "./Container";
import SubscribeModal from "../newsletter/SubscribeModal";

const TODAY = new Date().toLocaleDateString("en-US", {
  weekday: "long",
  year: "numeric",
  month: "long",
  day: "numeric",
});

export default function Header() {
  const [modalOpen, setModalOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  const handleNav = useCallback((path) => {
    setMobileOpen(false);
    navigate(path);
  }, [navigate]);

  const handleLogout = useCallback(() => {
    setMobileOpen(false);
    logout();
  }, [logout]);

  return (
    <>
      <header className="sticky top-0 z-40 bg-bg border-b border-ink">
        {/* Edition Bar */}
        <div className="border-b border-ink bg-ink text-bg">
          <Container className="flex items-center justify-between py-1">
            <span className="font-mono text-[10px] uppercase tracking-widest text-neutral-400">
              Vol. 1 | {TODAY} | FROM BANGLADESH
            </span>
          </Container>
        </div>

        {/* Main Header */}
        <Container className="py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="font-serif text-4xl lg:text-5xl font-black tracking-tighter leading-none text-ink no-underline hover:text-accent transition-colors duration-200">
              SMA Blog
            </Link>
            <nav className="hidden md:flex items-center gap-8">
              <Link to="/" className="font-sans text-xs uppercase tracking-widest font-semibold text-ink hover:text-accent transition-colors duration-200">
                Home
              </Link>
              <Link to="/archive" className="font-sans text-xs uppercase tracking-widest font-semibold text-ink hover:text-accent transition-colors duration-200">
                Archive
              </Link>
              {isAuthenticated ? (
                <>
                  <Link
                    to="/dashboard"
                    className="font-sans text-xs uppercase tracking-widest font-semibold text-neutral-500 hover:text-ink transition-colors duration-200"
                  >
                    Desk
                  </Link>
                  <button
                    onClick={logout}
                    className="font-sans text-xs uppercase tracking-widest font-semibold text-neutral-500 hover:text-accent transition-colors duration-200 cursor-pointer"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <Link
                  to="/login"
                  className="font-sans text-xs uppercase tracking-widest font-semibold text-ink hover:text-accent transition-colors duration-200"
                >
                  Sign In
                </Link>
              )}
              <button
                onClick={() => setModalOpen(true)}
                className="font-sans text-xs uppercase tracking-widest font-semibold bg-ink text-bg px-5 py-2 hover:bg-white hover:text-ink hover:border hover:border-ink transition-all duration-200 cursor-pointer"
              >
                Subscribe
              </button>
            </nav>
            {/* Mobile hamburger */}
            <button
              aria-label="Open menu"
              onClick={() => setMobileOpen(true)}
              className="md:hidden h-11 w-11 border border-ink flex items-center justify-center hover:bg-ink hover:text-bg transition-colors duration-200 cursor-pointer"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            </button>
          </div>
        </Container>
      </header>

      {/* Mobile drawer backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-50 bg-ink/30 transition-opacity duration-300 md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile drawer */}
      <div
        className={`fixed top-0 right-0 z-50 h-full w-72 bg-bg border-l-2 border-ink transform transition-transform duration-300 ease-in-out md:hidden ${
          mobileOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Close button */}
          <div className="flex items-center justify-between p-4 border-b border-ink">
            <span className="font-serif text-lg font-black tracking-tighter">Menu</span>
            <button
              aria-label="Close menu"
              onClick={() => setMobileOpen(false)}
              className="h-10 w-10 border border-ink flex items-center justify-center hover:bg-ink hover:text-bg transition-colors duration-200 cursor-pointer"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>

          {/* Navigation links */}
          <nav className="flex-1 p-4 space-y-1">
            <button
              onClick={() => handleNav("/")}
              className="w-full text-left px-4 py-3 font-sans text-xs uppercase tracking-widest font-semibold text-ink hover:bg-neutral-100 transition-colors duration-200"
            >
              Home
            </button>
            <button
              onClick={() => handleNav("/archive")}
              className="w-full text-left px-4 py-3 font-sans text-xs uppercase tracking-widest font-semibold text-ink hover:bg-neutral-100 transition-colors duration-200"
            >
              Archive
            </button>

            <div className="border-t border-ink my-3" />

            {isAuthenticated ? (
              <>
                <button
                  onClick={() => handleNav("/dashboard")}
                  className="w-full text-left px-4 py-3 font-sans text-xs uppercase tracking-widest font-semibold text-neutral-500 hover:bg-neutral-100 transition-colors duration-200"
                >
                  Writer&rsquo;s Desk
                </button>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-3 font-sans text-xs uppercase tracking-widest font-semibold text-neutral-500 hover:bg-neutral-100 transition-colors duration-200"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <button
                onClick={() => handleNav("/login")}
                className="w-full text-left px-4 py-3 font-sans text-xs uppercase tracking-widest font-semibold text-ink hover:bg-neutral-100 transition-colors duration-200"
              >
                Sign In
              </button>
            )}
          </nav>

          {/* Subscribe button at bottom */}
          <div className="p-4 border-t border-ink">
            <button
              onClick={() => { setMobileOpen(false); setModalOpen(true); }}
              className="w-full py-3 font-sans text-xs uppercase tracking-widest font-semibold bg-ink text-bg hover:bg-white hover:text-ink hover:border hover:border-ink transition-all duration-200 cursor-pointer"
            >
              Subscribe
            </button>
          </div>
        </div>
      </div>

      <SubscribeModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </>
  );
}
