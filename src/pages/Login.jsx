import { useState } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { toast } from "sonner";
import api from "@/lib/api";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, BadgeCheck, CalendarDays, ChevronRight, Sparkles, UserRoundCheck } from "lucide-react";
import { Om } from "@/components/Om";

export default function Login() {
  const [params] = useSearchParams();
  const initialRole = params.get("role") === "priest" ? "priest" : "customer";
  const [role, setRole] = useState(initialRole);
  const [phone, setPhone] = useState("");
  const [name, setName] = useState("");
  const [otp, setOtp] = useState("");
  const [devOtp, setDevOtp] = useState("");
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const { login, demoLogin } = useAuth();
  const navigate = useNavigate();

  const requestOtp = async () => {
    if (phone.length < 10) return toast.error("Enter a valid 10-digit phone number");
    const isDemoPhone = process.env.REACT_APP_ENABLE_DEMO_ACCESS === "true" &&
      ["9000000001", "9000000002"].includes(phone);
    if (isDemoPhone) {
      demoLogin(role);
      toast.success(`Local demo ${role} session started`);
      navigate(role === "customer" ? "/app" : "/priest");
      return;
    }
    setLoading(true);
    try {
      const { data } = await api.post("/auth/otp/request", { phone, role });
      setDevOtp(data.dev_otp || "");
      setStep(2);
      toast.success("OTP sent (dev mode — see below)");
    } catch (e) {
      const status = e?.response?.status;
      toast.error(status === 404
        ? "The preview API is unavailable. Use a demo access button or configure the local backend."
        : e?.response?.data?.detail || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async () => {
    if (otp.length !== 6) return toast.error("Enter the 6-digit OTP");
    setLoading(true);
    try {
      const { data } = await api.post("/auth/otp/verify", { phone, otp, role, name });
      login(data.token, data.user);
      toast.success("Welcome!");
      if (role === "customer") navigate("/app");
      else {
        // Route priest depending on onboarding state
        const { data: profile } = await api.get("/priest/me");
        if (!profile) navigate("/priest/onboarding");
        else navigate("/priest");
      }
    } catch (e) {
      toast.error(e?.response?.data?.detail || "Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  const startDemo = async (demoRole) => {
    const demoPhone = demoRole === "priest" ? "9000000002" : "9000000001";
    setRole(demoRole);
    setPhone(demoPhone);
    setName(demoRole === "priest" ? "Demo Purohit" : "Demo Customer");
    if (process.env.REACT_APP_ENABLE_DEMO_ACCESS !== "true") {
      toast.error("Demo access is disabled in this environment");
      return;
    }
    demoLogin(demoRole);
    toast.success(`Local demo ${demoRole} session started`);
    navigate(demoRole === "customer" ? "/app" : "/priest");
  };

  return (
    <div className="min-h-screen bg-[#f4f4ef] flex flex-col">
      <div className="w-full max-w-6xl mx-auto p-4 md:p-8 flex-1 grid lg:grid-cols-[1.05fr_.95fr] gap-6 items-stretch">
        <section className="hidden lg:flex relative overflow-hidden rounded-[2rem] bg-[#111111] text-white p-10 flex-col justify-between">
          <div className="absolute inset-0 premium-admin-hero opacity-60" />
          <div className="relative">
            <Link to="/" className="inline-flex items-center gap-2 text-sm text-white/60 hover:text-white" data-testid="login-back">
              <ArrowLeft className="w-4 h-4" /> Back to Purohith Connect
            </Link>
            <div className="mt-20">
              <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-white/75">
                <Sparkles className="w-3.5 h-3.5" />
                Shubh Karyas only
              </div>
              <h1 className="font-heading text-6xl mt-6 tracking-normal leading-[0.95]">
                Sacred bookings, modern operations.
              </h1>
              <p className="text-white/60 mt-5 max-w-md">
                Book verified purohits, manage priest onboarding, and keep every ritual date, payment, and verification flow accountable.
              </p>
            </div>
          </div>
          <div className="relative grid grid-cols-3 gap-3">
            <AuthProof icon={BadgeCheck} label="KYC verified" />
            <AuthProof icon={CalendarDays} label="Date first" />
            <AuthProof icon={UserRoundCheck} label="Priest-owned" />
          </div>
        </section>

        <section className="bg-white/92 backdrop-blur border border-black/10 rounded-[2rem] p-5 md:p-8 flex flex-col shadow-[0_24px_80px_-48px_rgba(0,0,0,.45)]">
          <Link to="/" className="lg:hidden flex items-center gap-2 text-sm text-muted2 hover:text-saffron mb-8" data-testid="login-back-mobile">
            <ArrowLeft className="w-4 h-4" /> Back
          </Link>

          <div className="mb-7">
            <div className="w-14 h-14 rounded-2xl bg-black flex items-center justify-center mb-4">
              <Om className="text-white text-4xl" />
            </div>
            <div className="font-sanskrit text-saffron text-sm mb-1" lang="sa">स्वागतम्</div>
            <h1 className="font-heading text-4xl text-ink tracking-normal">Continue</h1>
            <p className="text-sm text-muted2 mt-1">Choose your role and sign in with a secure OTP.</p>
          </div>

        {/* Role toggle */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8" data-testid="role-toggle">
          <button
            data-testid="role-customer"
            onClick={() => setRole("customer")}
            className={`group text-left rounded-3xl border p-4 transition
              ${role === "customer" ? "border-black bg-black text-white shadow-xl" : "border-black/10 bg-[#fbfaf7] text-ink hover:border-black/25"}`}
          >
            <div className="flex items-center justify-between gap-3">
              <CalendarDays className="w-5 h-5" />
              <ChevronRight className={`w-4 h-4 transition ${role === "customer" ? "translate-x-0" : "-translate-x-1 opacity-40"}`} />
            </div>
            <div className="mt-4 font-semibold">I need a Pooja</div>
            <div className={`text-xs mt-1 ${role === "customer" ? "text-white/55" : "text-muted2"}`}>Book a verified purohit</div>
          </button>
          <button
            data-testid="role-priest"
            onClick={() => setRole("priest")}
            className={`group text-left rounded-3xl border p-4 transition
              ${role === "priest" ? "border-black bg-black text-white shadow-xl" : "border-black/10 bg-[#fbfaf7] text-ink hover:border-black/25"}`}
          >
            <div className="flex items-center justify-between gap-3">
              <UserRoundCheck className="w-5 h-5" />
              <ChevronRight className={`w-4 h-4 transition ${role === "priest" ? "translate-x-0" : "-translate-x-1 opacity-40"}`} />
            </div>
            <div className="mt-4 font-semibold">I'm a Priest</div>
            <div className={`text-xs mt-1 ${role === "priest" ? "text-white/55" : "text-muted2"}`}>Join and manage bookings</div>
          </button>
        </div>

        {step === 1 && (
          <div className="space-y-4">
            <div>
              <Label htmlFor="phone">Phone number</Label>
              <Input
                id="phone"
                data-testid="login-phone"
                type="tel"
                placeholder="9876543210"
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
                className="mt-2 h-12 text-base"
              />
            </div>
            {role === "priest" && (
              <div>
                <Label htmlFor="name">Your name (optional)</Label>
                <Input id="name" data-testid="login-name" value={name} onChange={(e)=>setName(e.target.value)}
                  placeholder="Sri Ramesh Sharma" className="mt-2 h-12 text-base" />
              </div>
            )}
            <Button data-testid="login-send-otp" disabled={loading} onClick={requestOtp}
              className="w-full h-[52px] rounded-2xl bg-black hover:bg-black/90 text-white font-semibold shadow-[0_16px_40px_-24px_rgba(0,0,0,.8)]">
              {loading ? "Sending..." : "Send OTP"}
            </Button>
            <div className="grid grid-cols-2 gap-2 pt-1">
              <button type="button" data-testid="demo-customer-access" disabled={loading} onClick={() => startDemo("customer")}
                className="rounded-xl border border-black/10 bg-[#fbfaf7] px-3 py-2.5 text-xs font-semibold text-ink hover:border-black/30">
                Try customer demo
              </button>
              <button type="button" data-testid="demo-priest-access" disabled={loading} onClick={() => startDemo("priest")}
                className="rounded-xl border border-black/10 bg-[#fbfaf7] px-3 py-2.5 text-xs font-semibold text-ink hover:border-black/30">
                Try priest demo
              </button>
            </div>
            <p className="text-[11px] text-muted2 text-center">Local demo access uses seeded data and never creates a production account.</p>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <div>
              <Label htmlFor="otp">Enter OTP sent to +91 {phone}</Label>
              <Input id="otp" data-testid="login-otp" type="tel"
                value={otp} onChange={(e)=>setOtp(e.target.value.replace(/\D/g,"").slice(0,6))}
                placeholder="6-digit code" className="mt-2 h-12 text-base tracking-widest text-center" />
            </div>
            {devOtp && (
              <div data-testid="dev-otp-hint" className="bg-marigold/15 border border-marigold/40 rounded-lg p-3 text-sm text-ink">
                <div className="text-xs uppercase tracking-widest text-saffron-dark font-semibold">Dev mode OTP</div>
                <div className="font-mono text-lg tracking-widest">{devOtp}</div>
              </div>
            )}
            <Button data-testid="login-verify-otp" disabled={loading} onClick={verifyOtp}
              className="w-full h-[52px] rounded-2xl bg-black hover:bg-black/90 text-white font-semibold shadow-[0_16px_40px_-24px_rgba(0,0,0,.8)]">
              {loading ? "Verifying..." : "Verify & Continue"}
            </Button>
            <button data-testid="login-change-phone" className="w-full text-sm text-muted2 hover:text-saffron" onClick={() => setStep(1)}>
              Change phone number
            </button>
          </div>
        )}

        <div className="mt-auto pt-8 text-xs text-muted2 text-center">
          By continuing, you agree to our Terms & Privacy Policy.
        </div>
        </section>
      </div>
    </div>
  );
}

function AuthProof({ icon: Icon, label }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/10 p-4">
      <Icon className="w-4 h-4 text-white/80" />
      <div className="text-xs font-semibold mt-3 text-white/75">{label}</div>
    </div>
  );
}
