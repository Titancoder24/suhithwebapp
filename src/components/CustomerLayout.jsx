import { Outlet, Navigate } from "react-router-dom";
import { useAuth } from "../lib/auth";
import BottomNav from "./BottomNav";

export default function CustomerLayout() {
  const { user, loading } = useAuth();
  if (loading) return <FullScreenLoader />;
  if (!user || user.role !== "customer") return <Navigate to="/login" replace />;

  return (
    <div className="app-shell bg-[#f4f4ef]">
      <Outlet />
      <BottomNav />
    </div>
  );
}

export function FullScreenLoader() {
  return (
    <div data-testid="loader" className="min-h-screen flex flex-col items-center justify-center bg-cotton gap-3">
      <div className="font-sanskrit text-6xl text-saffron animate-pulse" lang="sa">ॐ</div>
      <div className="text-saffron font-heading text-xl">Purohith Connect</div>
      <div className="text-xs text-muted2 font-sanskrit" lang="sa">श्री गुरुभ्यो नमः</div>
    </div>
  );
}
