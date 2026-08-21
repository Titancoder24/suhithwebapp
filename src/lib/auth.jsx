import { createContext, useContext, useEffect, useState, useCallback } from "react";
import api, { tokenStore } from "./api";

const AuthCtx = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const refreshMe = useCallback(async () => {
    const token = tokenStore.access;
    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }
    try {
      const { data } = await api.get("/auth/me");
      setUser(data);
    } catch {
      tokenStore.clear();
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshMe();
  }, [refreshMe]);

  // Accepts full auth response { token, access_token, refresh_token, session_id, user }
  const login = (payload, userDoc) => {
    if (payload && typeof payload === "object" && payload.access_token) {
      tokenStore.set(payload);
      setUser(payload.user || userDoc || null);
    } else {
      // Backward-compat: (token, userDoc)
      tokenStore.set({ token: payload, access_token: payload });
      setUser(userDoc);
    }
  };

  const logout = async () => {
    try {
      await api.post("/auth/logout");
    } catch {
      /* ignore */
    }
    tokenStore.clear();
    setUser(null);
  };

  const logoutAll = async () => {
    try {
      await api.post("/auth/logout-all");
    } catch {
      /* ignore */
    }
    tokenStore.clear();
    setUser(null);
  };

  const demoLogin = (role) => {
    const demoUser = {
      id: `demo-${role}`,
      role,
      name: role === "customer" ? "Demo Customer" : role === "priest" ? "Demo Purohit" : "Demo Super Admin",
      email: role === "super_admin" ? "demo-admin@purohithconnect.local" : undefined,
      demo: true,
    };
    sessionStorage.setItem("purohith-demo-session", "true");
    setUser(demoUser);
  };

  return (
    <AuthCtx.Provider value={{ user, loading, login, logout, logoutAll, demoLogin, refreshMe }}>
      {children}
    </AuthCtx.Provider>
  );
}

export const useAuth = () => useContext(AuthCtx);
