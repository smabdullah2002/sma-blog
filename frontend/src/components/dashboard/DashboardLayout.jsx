import { NavLink } from "react-router-dom";
import { LayoutDashboard, FileText, PlusCircle, Home, ArrowLeft } from "lucide-react";

const NAV_ITEMS = [
  { to: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { to: "/dashboard/posts", icon: FileText, label: "Posts" },
  { to: "/dashboard/new", icon: PlusCircle, label: "New Post" },
  { to: "/dashboard/homepage", icon: Home, label: "Homepage" },
];

export default function DashboardLayout({ children }) {
  return (
    <div className="flex min-h-[calc(100vh-200px)]">
      {/* Sidebar */}
      <aside className="w-56 md:w-64 shrink-0 bg-ink text-bg border-r-2 border-ink flex flex-col">
        <div className="p-6 border-b border-neutral-700">
          <NavLink to="/dashboard" className="font-serif text-xl font-black tracking-tighter">
            Writer&rsquo;s Desk
          </NavLink>
          <div className="font-mono text-[9px] uppercase tracking-widest text-neutral-400 mt-1">
            Edition: Vol 1.0
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {NAV_ITEMS.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              end={to === "/dashboard"}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 font-sans text-xs uppercase tracking-widest font-semibold transition-all duration-200 ${
                  isActive
                    ? "bg-bg text-ink"
                    : "text-bg hover:bg-neutral-700"
                }`
              }
            >
              <Icon size={14} strokeWidth={1.5} />
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-neutral-700">
          <NavLink
            to="/"
            className="flex items-center gap-3 px-4 py-3 font-sans text-xs uppercase tracking-widest font-semibold text-neutral-400 hover:text-bg transition-colors duration-200"
          >
            <ArrowLeft size={14} strokeWidth={1.5} />
            Back to Site
          </NavLink>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 bg-bg">
        {children}
      </main>
    </div>
  );
}
