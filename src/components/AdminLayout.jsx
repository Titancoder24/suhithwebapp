import { Outlet, Navigate, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../lib/auth";
import { FullScreenLoader } from "./CustomerLayout";
import { LayoutDashboard, Users, CalendarClock, BookOpen, LogOut, ShieldAlert, Crown } from "lucide-react";
import { Om } from "./Om";

export default function AdminLayout() {
  const { user, loading, logout } = useAuth();
  const navigate = useNavigate();
  if (loading) return <FullScreenLoader />;
  if (!user || !["admin", "super_admin"].includes(user.role)) return <Navigate to="/admin/login" replace />;

  const items = [
    { to: "/admin", label: "Dashboard", icon: LayoutDashboard, testId: "admin-nav-dashboard", end: true },
    { to: "/admin/super", label: "Super Admin", icon: Crown, testId: "admin-nav-super" },
    { to: "/admin/priests", label: "Priests", icon: Users, testId: "admin-nav-priests" },
    { to: "/admin/bookings", label: "Bookings", icon: CalendarClock, testId: "admin-nav-bookings" },
    { to: "/admin/poojas", label: "Poojas", icon: BookOpen, testId: "admin-nav-poojas" },
    { to: "/admin/disputes", label: "Disputes", icon: ShieldAlert, testId: "admin-nav-disputes" },
  ];

  return (
    <div className="min-h-screen flex bg-white">
      <aside className="w-64 bg-white text-[#171717] px-5 py-6 hidden md:flex flex-col border-r border-[#e8e8e5]">
        <div className="mb-8 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#f4511e] text-white flex items-center justify-center">
            <Om className="text-white text-xl" />
          </div>
          <div>
            <div className="font-heading text-2xl leading-none">Purohith</div>
            <div className="text-xs text-[#73736f] mt-1">Operations</div>
          </div>
        </div>
        <nav className="flex-1 space-y-1">
          {items.map(({ to, label, icon: Icon, testId, end }) => (
            <NavLink
              key={to} to={to} end={end}
              data-testid={testId}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-2xl font-medium text-sm transition-colors
                 ${isActive ? "bg-[#f2f2f0] text-black" : "text-[#666662] hover:bg-[#f7f7f5] hover:text-black"}`
              }
            >
              <Icon className="w-4 h-4" />{label}
            </NavLink>
          ))}
        </nav>
        <button
          data-testid="admin-logout"
          onClick={() => { logout(); navigate("/admin/login"); }}
          className="flex items-center gap-2 text-sm text-[#777772] hover:text-black mt-6 px-4 py-3"
        >
          <LogOut className="w-4 h-4" /> Sign out
        </button>
      </aside>
      <main className="flex-1 p-6 md:p-10 max-w-[1440px] bg-white">
        <Outlet />
      </main>
    </div>
  );
}
