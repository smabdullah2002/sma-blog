import { useState } from "react";
import { Link, useNavigate, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Container from "../components/layout/Container";

export default function Login() {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(email, password);
      navigate("/dashboard");
    } catch (err) {
      setError(
        err.response?.data?.detail || "Invalid email or password."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-200px)] flex items-center justify-center bg-bg newsprint-texture relative">
      <Container>
        <div className="max-w-md mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="font-mono text-xs uppercase tracking-widest text-neutral-500 mb-2">
              Author Access
            </div>
            <div className="w-12 h-1 bg-accent mx-auto mb-4" />
            <h1 className="font-serif text-4xl md:text-5xl font-black tracking-tighter">
              Writer&rsquo;s Desk<span className="text-accent">.</span>
            </h1>
            <p className="font-body text-sm text-neutral-500 mt-3">
              Sign in to manage the publication.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="border-2 border-ink p-8 bg-bg">
            {error && (
              <div className="mb-6 border-2 border-accent p-4 bg-accent/5">
                <p className="font-sans text-xs uppercase tracking-widest font-semibold text-accent">
                  {error}
                </p>
              </div>
            )}

            <div className="mb-6">
              <label className="block font-sans text-[10px] uppercase tracking-widest font-semibold text-neutral-500 mb-2">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@sma.blog"
                required
                className="w-full border-b-2 border-ink bg-transparent px-2 py-3 font-body text-base text-ink placeholder:text-neutral-400 focus-visible:outline-none focus-visible:bg-neutral-100"
              />
            </div>

            <div className="mb-8">
              <label className="block font-sans text-[10px] uppercase tracking-widest font-semibold text-neutral-500 mb-2">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;"
                required
                className="w-full border-b-2 border-ink bg-transparent px-2 py-3 font-mono text-base text-ink placeholder:text-neutral-400 focus-visible:outline-none focus-visible:bg-neutral-100"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 font-sans text-xs uppercase tracking-widest font-semibold bg-ink text-bg hover:bg-white hover:text-ink hover:border-2 hover:border-ink transition-all duration-200 disabled:opacity-40 disabled:pointer-events-none"
            >
              {loading ? "Signing In..." : "Sign In"}
            </button>
          </form>

          {/* Footer */}
          <div className="text-center mt-6">
            <Link
              to="/"
              className="font-sans text-[10px] uppercase tracking-widest font-semibold text-neutral-500 hover:text-accent transition-colors duration-200"
            >
              &larr; Back to Site
            </Link>
          </div>
        </div>
      </Container>
    </div>
  );
}
