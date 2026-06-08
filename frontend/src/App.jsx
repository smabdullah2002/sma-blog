import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { DashboardProvider } from "./context/DashboardContext";

import ProtectedRoute from "./components/auth/ProtectedRoute";
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
import Home from "./pages/Home";
import Post from "./pages/Post";
import Archive from "./pages/Archive";
import Tag from "./pages/Tag";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import Dashboard from "./pages/Dashboard";
import PostsManager from "./pages/PostsManager";
import NewPost from "./pages/NewPost";
import EditPost from "./pages/EditPost";
import HomepageSettings from "./pages/HomepageSettings";

function PublicLayout({ children }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}

function ProtectedLayout({ children }) {
  return (
    <ProtectedRoute>
      {children}
    </ProtectedRoute>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public routes */}
          <Route
            path="/*"
            element={
              <PublicLayout>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/post/:slug" element={<Post />} />
                  <Route path="/archive" element={<Archive />} />
                  <Route path="/tag/:slug" element={<Tag />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </PublicLayout>
            }
          />
          {/* Dashboard routes — protected */}
          <Route
            path="/dashboard"
            element={
              <ProtectedLayout>
                <DashboardProvider>
                  <Dashboard />
                </DashboardProvider>
              </ProtectedLayout>
            }
          />
          <Route
            path="/dashboard/posts"
            element={
              <ProtectedLayout>
                <DashboardProvider>
                  <PostsManager />
                </DashboardProvider>
              </ProtectedLayout>
            }
          />
          <Route
            path="/dashboard/new"
            element={
              <ProtectedLayout>
                <DashboardProvider>
                  <NewPost />
                </DashboardProvider>
              </ProtectedLayout>
            }
          />
          <Route
            path="/dashboard/edit/:slug"
            element={
              <ProtectedLayout>
                <DashboardProvider>
                  <EditPost />
                </DashboardProvider>
              </ProtectedLayout>
            }
          />
          <Route
            path="/dashboard/homepage"
            element={
              <ProtectedLayout>
                <DashboardProvider>
                  <HomepageSettings />
                </DashboardProvider>
              </ProtectedLayout>
            }
          />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
