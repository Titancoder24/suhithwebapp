import axios from "axios";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
export const API = `${BACKEND_URL}/api`;

const TOKEN_KEY = "pc_token";                  // legacy — access token
const ACCESS_KEY = "pc_access_token";
const REFRESH_KEY = "pc_refresh_token";
const SESSION_KEY = "pc_session_id";

export const tokenStore = {
  get access() {
    return localStorage.getItem(ACCESS_KEY) || localStorage.getItem(TOKEN_KEY) || "";
  },
  get refresh() {
    return localStorage.getItem(REFRESH_KEY) || "";
  },
  get sessionId() {
    return localStorage.getItem(SESSION_KEY) || "";
  },
  set({ token, access_token, refresh_token, session_id }) {
    if (access_token) localStorage.setItem(ACCESS_KEY, access_token);
    if (refresh_token) localStorage.setItem(REFRESH_KEY, refresh_token);
    if (session_id) localStorage.setItem(SESSION_KEY, session_id);
    if (token) localStorage.setItem(TOKEN_KEY, token);
  },
  clear() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(ACCESS_KEY);
    localStorage.removeItem(REFRESH_KEY);
    localStorage.removeItem(SESSION_KEY);
  },
};

const api = axios.create({ baseURL: API });

api.interceptors.request.use((config) => {
  const token = tokenStore.access;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

let refreshInFlight = null;

async function performRefresh() {
  const refresh = tokenStore.refresh;
  if (!refresh) throw new Error("no-refresh-token");
  const { data } = await axios.post(`${API}/auth/refresh`, { refresh_token: refresh });
  tokenStore.set(data);
  return data.access_token;
}

api.interceptors.response.use(
  (r) => r,
  async (err) => {
    const original = err?.config || {};
    const status = err?.response?.status;
    // Only retry once, only on 401, and only if we have a refresh token
    if (
      status === 401 &&
      !original._retry &&
      tokenStore.refresh &&
      !original.url?.includes("/auth/refresh")
    ) {
      original._retry = true;
      try {
        refreshInFlight = refreshInFlight || performRefresh();
        const newAccess = await refreshInFlight;
        refreshInFlight = null;
        original.headers = { ...(original.headers || {}), Authorization: `Bearer ${newAccess}` };
        return api(original);
      } catch (refreshErr) {
        refreshInFlight = null;
        tokenStore.clear();
        // Let the caller handle the redirect
      }
    }
    return Promise.reject(err);
  }
);

/** Fetch a private file as an object URL (for <img> or download). */
export async function fetchAuthedBlobUrl(fileId) {
  const { data } = await api.get(`/files/${fileId}`, { responseType: "blob" });
  return URL.createObjectURL(data);
}

export default api;
