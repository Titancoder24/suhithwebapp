import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "sonner";
import api from "@/lib/api";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, LockKeyhole, ShieldCheck } from "lucide-react";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { login, demoLogin } = useAuth();
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.post("/auth/admin/login", { email, password });
      login(data.token, data.user);
      toast.success("Welcome Admin");
      navigate("/admin");
    } catch (err) {
      toast.error(err?.response?.data?.detail || "Login failed");
    } finally { setLoading(false); }
  };

  const startDemo = () => {
    if (process.env.REACT_APP_ENABLE_DEMO_ACCESS !== "true") {
      toast.error("Demo access is disabled in this environment");
      return;
    }
    demoLogin("super_admin");
    toast.success("Demo super-admin session started");
    navigate("/admin/super");
  };

  return (
    <div className="min-h-screen premium-auth-bg flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-[2rem] border border-black/10 p-6 md:p-8 shadow-[0_24px_80px_-48px_rgba(0,0,0,.45)]">
        <Link to="/" className="flex items-center gap-2 text-sm text-muted2 hover:text-saffron mb-8" data-testid="admin-login-back">
          <ArrowLeft className="w-4 h-4" /> Back
        </Link>
        <div className="w-14 h-14 rounded-2xl bg-black flex items-center justify-center mb-4">
          <ShieldCheck className="w-7 h-7 text-white" />
        </div>
        <div className="font-sanskrit text-saffron text-sm mb-1" lang="sa">प्रबन्धकः</div>
        <h1 className="font-heading text-4xl text-ink tracking-normal">Admin Console</h1>
        <p className="text-sm text-muted2 mt-1 mb-8">Secure operations for priests, bookings, content, analytics, and growth pages.</p>

        <form onSubmit={submit} className="space-y-4">
          <div>
            <Label>Email</Label>
            <Input data-testid="admin-email" type="email" value={email} onChange={(e)=>setEmail(e.target.value)}
              placeholder="admin@purohithconnect.in" className="mt-2 h-12" />
          </div>
          <div>
            <Label>Password</Label>
            <Input data-testid="admin-password" type="password" value={password} onChange={(e)=>setPassword(e.target.value)}
              placeholder="••••••••" className="mt-2 h-12" />
          </div>
          <Button data-testid="admin-login-submit" type="submit" disabled={loading}
            className="w-full h-[52px] rounded-2xl bg-black hover:bg-black/90 text-white font-semibold">
            <LockKeyhole className="w-4 h-4 mr-2" />
            {loading ? "Signing in..." : "Sign in"}
          </Button>
          <button type="button" data-testid="demo-admin-access" onClick={startDemo}
            className="w-full rounded-xl border border-black/10 bg-[#fbfaf7] px-4 py-3 text-sm font-semibold text-ink hover:border-black/30">
            Enter super-admin demo
          </button>
        </form>

        <div className="mt-6 bg-[#fbfaf7] border border-black/10 rounded-2xl p-4 text-xs text-muted2">
          <div className="font-semibold text-ink mb-1">Production credential policy</div>
          <div>Demo access is local-only and uses seeded analytics. Production admins and super admins must be created in Supabase Auth and assigned roles in the `app_users` table.</div>
        </div>
      </div>
    </div>
  );
}
