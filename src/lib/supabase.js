import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || "";
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY || "";

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
      global: {
        headers: { "x-application-name": "purohith-connect-web" },
      },
    })
  : null;

export async function trackPlatformEvent(eventName, properties = {}) {
  if (!supabase) return { skipped: true };
  const sessionId = window.localStorage.getItem("pc_platform_session_id");
  const { data: authData } = await supabase.auth.getUser();
  const userId = authData?.user?.id || null;
  return supabase.from("analytics_events").insert({
    session_id: sessionId || null,
    user_id: userId,
    event_name: eventName,
    route: window.location.pathname,
    platform: "web",
    properties,
  });
}

export async function ensurePlatformSession() {
  if (!supabase) return null;
  const existing = window.localStorage.getItem("pc_platform_session_id");
  if (existing) {
    await supabase
      .from("platform_sessions")
      .update({ last_seen_at: new Date().toISOString() })
      .eq("id", existing);
    return existing;
  }

  const anonymousId =
    window.localStorage.getItem("pc_anonymous_id") ||
    crypto.randomUUID();
  window.localStorage.setItem("pc_anonymous_id", anonymousId);

  const { data: authData } = await supabase.auth.getUser();
  const { data, error } = await supabase
    .from("platform_sessions")
    .insert({
      user_id: authData?.user?.id || null,
      anonymous_id: anonymousId,
      platform: "web",
      user_agent: navigator.userAgent,
    })
    .select("id")
    .single();

  if (error) return null;
  window.localStorage.setItem("pc_platform_session_id", data.id);
  return data.id;
}

export async function getSuperAdminMetrics() {
  if (!supabase) return null;
  const { data, error } = await supabase
    .from("super_admin_daily_metrics")
    .select("*")
    .order("day", { ascending: true });
  if (error) throw error;
  return data || [];
}

export async function listProgrammaticPages() {
  if (!supabase) return [];
  const { data, error } = await supabase
    .from("programmatic_pages")
    .select("id, slug, page_type, title, status, target_keywords, published_at, updated_at")
    .order("updated_at", { ascending: false })
    .limit(50);
  if (error) throw error;
  return data || [];
}
