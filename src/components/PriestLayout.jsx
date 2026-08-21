import { Outlet, Navigate, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../lib/auth";
import { FullScreenLoader } from "./CustomerLayout";
import { LayoutDashboard, Inbox, CalendarCheck2, User, LogOut } from "lucide-react";
import { Om } from "./Om";

export default function PriestLayout() {
  const { user, loading, logout } = useAuth();
  const navigate = useNavigate();
  if (loading) return <FullScreenLoader />;
  if (!user || user.role !== "priest") return <Navigate to="/login?role=priest" replace />;

  const items = [
    { to: "/priest", label: "Dashboard", icon: LayoutDashboard, testId: "priest-nav-dashboard", end: true },
    { to: "/priest/bookings", label: "Bookings", icon: Inbox, testId: "priest-nav-bookings" },
    { to: "/priest/availability", label: "Availability", icon: CalendarCheck2, testId: "priest-nav-availability" },
    { to: "/priest/profile", label: "Profile", icon: User, testId: "priest-nav-profile" },
  ];

  return (
    <div className="min-h-screen bg-cotton">
      <header className="bg-white border-b border-warmBorder sticky top-0 z-40">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-saffron flex items-center justify-center">
              <Om className="text-white text-2xl" />
            </div>
            <div>
              <div className="font-heading text-xl text-saffron">Purohith Connect</div>
              <div className="text-xs text-muted2 font-sanskrit" lang="sa">पुरोहित पोर्टल</div>
            </div>
          </div>
          <button data-testid="priest-logout" onClick={() => { logout(); navigate("/"); }}
            className="flex items-center gap-2 text-sm text-muted2 hover:text-saffron">
            <LogOut className="w-4 h-4" /> Sign out
          </button>
        </div>
        <nav className="max-w-5xl mx-auto px-4 flex gap-1 overflow-x-auto">
          {items.map(({ to, label, icon: Icon, testId, end }) => (
            <NavLink key={to} to={to} end={end} data-testid={testId}
              className={({ isActive }) =>
                `flex items-center gap-2 px-4 py-3 text-sm font-semibold border-b-2 whitespace-nowrap transition-colors
                 ${isActive ? "border-saffron text-saffron" : "border-transparent text-muted2 hover:text-ink"}`
              }>
              <Icon className="w-4 h-4" />{label}
            </NavLink>
          ))}
        </nav>
      </header>
      <main className="max-w-5xl mx-auto p-6"><Outlet /></main>
    </div>
  );
}
