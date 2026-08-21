import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import api from "@/lib/api";
import { useAuth } from "@/lib/auth";
import { FullScreenLoader } from "@/components/CustomerLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Flame, CheckCircle2, ChevronRight, ChevronLeft, User2, Sparkles, MapPin, ShieldCheck } from "lucide-react";
import FileUpload from "@/components/FileUpload";

const LANGUAGES = ["Kannada", "Sanskrit", "Hindi", "Telugu", "Tamil", "English", "Marathi", "Malayalam"];
const AREAS = ["Jayanagar", "Indiranagar", "Whitefield", "HSR Layout", "Malleshwaram", "Koramangala", "JP Nagar", "Basavanagudi", "Electronic City", "Yelahanka", "RT Nagar", "Rajajinagar"];

const STEPS = [
  { key: "personal", label: "Personal", icon: User2 },
  { key: "expertise", label: "Expertise", icon: Sparkles },
  { key: "areas", label: "Service", icon: MapPin },
  { key: "documents", label: "Documents", icon: ShieldCheck },
];

const emptyForm = {
  name: "",
  photo_url: "",
  photo_file_id: "",
  bio: "",
  languages: [],
  poojas_offered: [],
  service_areas: [],
  experience_years: 0,
  id_proof_url: "",
  id_proof_file_id: "",
  certificate_file_ids: [],
  pan_last4: "",
  aadhaar_last4: "",
  onboarding_step: 0,
};

export default function PriestOnboarding() {
  const { user, loading, logout } = useAuth();
  const navigate = useNavigate();
  const [poojas, setPoojas] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [step, setStep] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [status, setStatus] = useState("");

  useEffect(() => {
    api.get("/poojas").then(({ data }) => setPoojas(data)).catch(() => {});
  }, []);

  useEffect(() => {
    if (!user) return;
    let cancelled = false;
    api.get("/priest/me").then(({ data }) => {
      if (cancelled) return;
      if (data && Object.keys(data).length) {
        setForm((f) => ({ ...f, ...data, name: data.name || user.name || f.name }));
        const target = Math.max(0, Math.min(Number(data.onboarding_step) || 0, STEPS.length - 1));
        setStep(target);
        setStatus(data.verification_status || "");
      } else {
        setForm((f) => ({ ...f, name: user.name || f.name }));
      }
    }).catch(() => {
      setForm((f) => ({ ...f, name: user.name || f.name }));
    });
    return () => { cancelled = true; };
  }, [user]);

  if (loading) return <FullScreenLoader />;
  if (!user || user.role !== "priest") { navigate("/login?role=priest"); return null; }

  const toggle = (key, val) => {
    setForm((f) => {
      const arr = f[key] || [];
      return { ...f, [key]: arr.includes(val) ? arr.filter((x) => x !== val) : [...arr, val] };
    });
  };

  const patch = (patchObj) => setForm((f) => ({ ...f, ...patchObj }));

  const canProceed = () => {
    if (step === 0) return !!form.name && form.experience_years >= 0;
    if (step === 1) return form.languages.length > 0 && form.poojas_offered.length > 0;
    if (step === 2) return form.service_areas.length > 0;
    if (step === 3) return true; // documents are optional; recommended
    return true;
  };

  const saveDraft = async (payload) => {
    try {
      await api.post("/priest/onboarding", payload);
    } catch { /* silent — user can retry */ }
  };

  const next = async () => {
    if (!canProceed()) return toast.error("Please complete this step first");
    const nextStep = Math.min(step + 1, STEPS.length - 1);
    const payload = { ...form, onboarding_step: nextStep };
    setForm(payload);
    setStep(nextStep);
    await saveDraft(payload);
  };

  const prev = () => setStep((s) => Math.max(0, s - 1));

  const submit = async () => {
    if (!form.name || form.languages.length === 0 || form.poojas_offered.length === 0 || form.service_areas.length === 0) {
      return toast.error("Please fill all mandatory sections");
    }
    setSubmitting(true);
    try {
      await api.post("/priest/onboarding", { ...form, onboarding_step: STEPS.length - 1 });
      setDone(true);
      toast.success("Profile submitted for verification");
    } catch (e) {
      toast.error(e?.response?.data?.detail || "Submission failed");
    } finally { setSubmitting(false); }
  };

  if (done) {
    return (
      <div className="min-h-screen bg-cotton grain-bg p-6 max-w-md mx-auto text-center pt-20">
        <div className="w-20 h-20 rounded-full bg-saffron/10 flex items-center justify-center mx-auto mb-4">
          <CheckCircle2 className="w-10 h-10 text-saffron" />
        </div>
        <h1 className="font-heading text-3xl text-ink">Submitted for verification</h1>
        <p className="text-sm text-muted2 mt-3">Our team will review your profile within 24–48 hours. You'll be notified once verified.</p>
        <div className="mt-8 space-y-2">
          <Button data-testid="onboarding-goto-dashboard" onClick={() => navigate("/priest")}
            className="w-full h-12 rounded-full bg-saffron hover:bg-saffron-dark text-white font-semibold">
            Go to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  const StepIcon = STEPS[step].icon;

  return (
    <div className="min-h-screen bg-cotton grain-bg">
      <div className="max-w-2xl mx-auto p-6">
        <header className="mb-6">
          <div className="w-12 h-12 rounded-full bg-saffron/10 flex items-center justify-center mb-4">
            <Flame className="w-6 h-6 text-saffron" />
          </div>
          <h1 className="font-heading text-3xl text-ink">Priest onboarding</h1>
          <p className="text-sm text-muted2 mt-1">
            Complete all 4 steps. We auto-save your progress so you can come back anytime.
          </p>
          {status === "rejected" && (
            <div className="mt-3 p-3 rounded-lg bg-red-50 border border-red-200 text-sm text-red-700" data-testid="onboarding-rejected-banner">
              Your previous submission was declined. Update the details and resubmit for review.
            </div>
          )}
          {status === "verified" && (
            <div className="mt-3 p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-sm text-emerald-700" data-testid="onboarding-verified-banner">
              You are verified. Editing sends this back for review.
            </div>
          )}
        </header>

        {/* Stepper */}
        <div className="mb-8 flex items-center gap-2" data-testid="onboarding-stepper">
          {STEPS.map((s, i) => {
            const Icon = s.icon;
            const active = i === step;
            const complete = i < step;
            return (
              <div key={s.key} className="flex items-center gap-2 flex-1">
                <button
                  type="button"
                  data-testid={`onboarding-step-${s.key}`}
                  onClick={() => setStep(i)}
                  className={`w-9 h-9 rounded-full flex items-center justify-center border transition
                    ${active ? "bg-saffron border-saffron text-white" :
                     complete ? "bg-emerald-500 border-emerald-500 text-white" :
                     "bg-white border-warmBorder text-muted2"}`}
                >
                  {complete ? <CheckCircle2 className="w-4 h-4" /> : <Icon className="w-4 h-4" />}
                </button>
                {i < STEPS.length - 1 && (
                  <div className={`h-0.5 flex-1 ${i < step ? "bg-emerald-500" : "bg-warmBorder"}`} />
                )}
              </div>
            );
          })}
        </div>

        <div className="bg-white border border-warmBorder rounded-2xl p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-5">
            <StepIcon className="w-5 h-5 text-saffron" />
            <h2 className="font-heading text-2xl text-ink">{STEPS[step].label}</h2>
            <span className="ml-auto text-xs text-muted2">Step {step + 1} of {STEPS.length}</span>
          </div>

          {/* Step 0: Personal */}
          {step === 0 && (
            <div className="space-y-5">
              <div>
                <Label>Full name</Label>
                <Input data-testid="onboarding-name" value={form.name}
                  onChange={(e) => patch({ name: e.target.value })}
                  className="mt-2 h-12" placeholder="Sri Ramesh Sharma" />
              </div>
              <FileUpload
                value={form.photo_file_id}
                onChange={(id) => patch({ photo_file_id: id })}
                purpose="profile"
                label="Profile photo (publicly visible)"
                accept="image/jpeg,image/png,image/webp"
                testId="onboarding-photo-upload"
              />
              <div>
                <Label>Short bio</Label>
                <Textarea data-testid="onboarding-bio" value={form.bio}
                  onChange={(e) => patch({ bio: e.target.value })}
                  placeholder="Trained in Vedic traditions since 1995. Specialising in Griha Pravesh and Satyanarayan poojas…"
                  className="mt-2 min-h-[90px]" />
              </div>
              <div>
                <Label>Years of experience</Label>
                <Input data-testid="onboarding-experience" type="number" value={form.experience_years}
                  onChange={(e) => patch({ experience_years: parseInt(e.target.value) || 0 })}
                  className="mt-2 h-11 w-32" />
              </div>
            </div>
          )}

          {/* Step 1: Expertise */}
          {step === 1 && (
            <div className="space-y-5">
              <div>
                <Label>Languages spoken</Label>
                <div className="mt-3 flex flex-wrap gap-2">
                  {LANGUAGES.map((l) => (
                    <label key={l} data-testid={`onboarding-lang-${l}`}
                      className={`text-sm rounded-full px-4 py-2 cursor-pointer border transition
                        ${form.languages.includes(l) ? "bg-saffron border-saffron text-white" : "bg-white border-warmBorder text-ink"}`}>
                      <input type="checkbox" className="hidden" checked={form.languages.includes(l)} onChange={() => toggle("languages", l)} />
                      {l}
                    </label>
                  ))}
                </div>
              </div>
              <div>
                <Label>Poojas you offer</Label>
                <div className="mt-3 grid grid-cols-2 gap-2">
                  {poojas.map((p) => (
                    <label key={p.slug} data-testid={`onboarding-pooja-${p.slug}`}
                      className={`text-sm rounded-lg px-3 py-2.5 cursor-pointer border transition flex items-center gap-2
                        ${form.poojas_offered.includes(p.slug) ? "bg-saffron/10 border-saffron text-saffron-dark" : "bg-white border-warmBorder text-ink"}`}>
                      <Checkbox checked={form.poojas_offered.includes(p.slug)} onCheckedChange={() => toggle("poojas_offered", p.slug)} />
                      <span className="text-xs">{p.name}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Service areas */}
          {step === 2 && (
            <div className="space-y-5">
              <div>
                <Label>Service areas in Bengaluru</Label>
                <div className="mt-3 flex flex-wrap gap-2">
                  {AREAS.map((a) => (
                    <label key={a} data-testid={`onboarding-area-${a.replace(/\s+/g, "-").toLowerCase()}`}
                      className={`text-sm rounded-full px-4 py-2 cursor-pointer border transition
                        ${form.service_areas.includes(a) ? "bg-marigold text-ink border-marigold" : "bg-white border-warmBorder text-ink"}`}>
                      <input type="checkbox" className="hidden" checked={form.service_areas.includes(a)} onChange={() => toggle("service_areas", a)} />
                      {a}
                    </label>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Documents */}
          {step === 3 && (
            <div className="space-y-5">
              <p className="text-sm text-muted2">
                Uploads are private and only reviewed by our verification team. All documents are encrypted at rest.
              </p>
              <FileUpload
                value={form.id_proof_file_id}
                onChange={(id) => patch({ id_proof_file_id: id })}
                purpose="kyc"
                label="Government ID (Aadhaar / PAN / Voter ID)"
                testId="onboarding-idproof-upload"
              />
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-xs">PAN last 4 digits (optional)</Label>
                  <Input data-testid="onboarding-pan"
                    value={form.pan_last4}
                    maxLength={4}
                    onChange={(e) => patch({ pan_last4: e.target.value.replace(/\D/g, "").slice(0, 4) })}
                    className="mt-2 h-11" placeholder="1234" />
                </div>
                <div>
                  <Label className="text-xs">Aadhaar last 4 digits (optional)</Label>
                  <Input data-testid="onboarding-aadhaar"
                    value={form.aadhaar_last4}
                    maxLength={4}
                    onChange={(e) => patch({ aadhaar_last4: e.target.value.replace(/\D/g, "").slice(0, 4) })}
                    className="mt-2 h-11" placeholder="5678" />
                </div>
              </div>
              <FileUpload
                value={form.certificate_file_ids?.[0] || ""}
                onChange={(id) => patch({ certificate_file_ids: id ? [id, ...(form.certificate_file_ids || []).slice(1)] : (form.certificate_file_ids || []).slice(1) })}
                purpose="certificate"
                label="Priest certificate / Veda paatashaala credential (optional)"
                testId="onboarding-cert-upload"
                preview="file"
              />
            </div>
          )}

          {/* Nav */}
          <div className="pt-6 mt-6 border-t border-warmBorder flex gap-3">
            {step > 0 ? (
              <Button variant="outline" data-testid="onboarding-back"
                onClick={prev} className="rounded-full h-11 px-5">
                <ChevronLeft className="w-4 h-4 mr-1" /> Back
              </Button>
            ) : (
              <Button variant="outline" data-testid="onboarding-cancel"
                onClick={() => { logout(); navigate("/"); }} className="rounded-full h-11 px-5">
                Cancel
              </Button>
            )}
            {step < STEPS.length - 1 ? (
              <Button data-testid="onboarding-next" onClick={next}
                className="flex-1 rounded-full h-11 bg-saffron hover:bg-saffron-dark text-white font-semibold">
                Save & continue <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            ) : (
              <Button data-testid="onboarding-submit" onClick={submit} disabled={submitting}
                className="flex-1 rounded-full h-11 bg-saffron hover:bg-saffron-dark text-white font-semibold">
                {submitting ? "Submitting…" : "Submit for verification"}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
