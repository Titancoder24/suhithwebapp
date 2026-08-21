import { NavLink, useLocation } from "react-router-dom";
import { Home, CalendarDays, Sparkles, User } from "lucide-react";

const items = [
  { to: "/app", label: "Home", icon: Home, testId: "nav-home", end: true },
  { to: "/app/bookings", label: "Bookings", icon: CalendarDays, testId: "nav-bookings" },
  { to: "/app/ai", label: "Ask AI", icon: Sparkles, testId: "nav-ai" },
  { to: "/app/profile", label: "Profile", icon: User, testId: "nav-profile" },
];

export default function BottomNav() {
  const location = useLocation();
  // Hide on booking flow deep pages if desired
  if (location.pathname.startsWith("/priest") || location.pathname.startsWith("/admin")) return null;

  return (
    <nav
      data-testid="bottom-nav"
      className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[480px] z-50
                 bg-white/95 backdrop-blur-xl border-t border-warmBorder"
    >
      <ul className="grid grid-cols-4">
        {items.map(({ to, label, icon: Icon, testId, end }) => (
          <li key={to}>
            <NavLink
              to={to}
              end={end}
              data-testid={testId}
              className={({ isActive }) =>
                `flex flex-col items-center gap-1 py-3 text-xs font-medium transition-colors
                 ${isActive ? "text-saffron" : "text-muted2 hover:text-saffron-dark"}`
              }
            >
              <Icon className="w-5 h-5" strokeWidth={2} />
              <span>{label}</span>
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}
