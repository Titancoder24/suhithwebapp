import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "@/lib/api";
import { useAuth } from "@/lib/auth";
import { Input } from "@/components/ui/input";
import { Search, Sparkles, ArrowRight, Clock } from "lucide-react";
import { Om, DEITIES } from "@/components/Om";

const LOCAL_DEMO_POOJAS = [
  { id: "demo-satyanarayan", slug: "satyanarayan", name: "Satyanarayan Pooja", category: "Festival", duration_hours: 2, base_price: 2100, image_url: "" },
  { id: "demo-griha", slug: "griha-pravesh", name: "Griha Pravesh", category: "Home", duration_hours: 3, base_price: 5100, image_url: "" },
  { id: "demo-rudra", slug: "rudrabhishek", name: "Rudrabhishek", category: "Shanti", duration_hours: 2, base_price: 2500, image_url: "" },
  { id: "demo-ganesh", slug: "ganesh", name: "Ganesh Pooja", category: "Festival", duration_hours: 1, base_price: 1500, image_url: "" },
];

export default function CustomerHome() {
  const { user } = useAuth();
  const [poojas, setPoojas] = useState([]);
  const [q, setQ] = useState("");
  const navigate = useNavigate();
  const [dailyDeity] = useState(() => DEITIES[new Date().getDate() % DEITIES.length]);

  useEffect(() => {
    api.get("/poojas").then(({ data }) => setPoojas(data)).catch(() => {
      if (sessionStorage.getItem("purohith-demo-session") === "true") setPoojas(LOCAL_DEMO_POOJAS);
    });
  }, []);

  const filtered = poojas.filter(p =>
    p.name.toLowerCase().includes(q.toLowerCase()) ||
    p.category.toLowerCase().includes(q.toLowerCase())
  );

  return (
    <div className="pb-6">
      {/* Header */}
      <header className="px-6 pt-6 pb-4">
        <div className="flex items-center gap-2 mb-2">
          <Om className="text-saffron text-2xl" />
          <span className="font-kannada text-saffron text-base" lang="kn">ನಮಸ್ಕಾರ</span>
          <span className="text-xs uppercase tracking-[0.2em] text-muted2 ml-1">
            {user?.name ? `· ${user.name}` : ""}
          </span>
        </div>
        <h1 className="font-heading text-3xl text-ink">Book a Shubh Karya</h1>
      </header>

      {/* Blessing of the day */}
      <div className="px-6 mb-4">
        <div data-testid="blessing-of-day" className="bg-[#fff4e8] border border-saffron/15 rounded-lg p-4 flex items-center gap-3">
          <div className="w-11 h-11 rounded-full bg-white flex items-center justify-center shrink-0">
            <Om className="text-saffron text-2xl" />
          </div>
          <div className="min-w-0">
            <div className="text-[10px] uppercase tracking-widest text-muted2">Blessing of the day · <span className="font-kannada text-saffron-dark" lang="kn">{dailyDeity.kannada}</span></div>
            <div className="font-kannada text-ink text-base truncate" lang="kn">{dailyDeity.mantra}</div>
            <div className="text-xs text-muted2 truncate">{dailyDeity.english} — {dailyDeity.meaning}</div>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="px-6 mb-6">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted2" />
          <Input
            data-testid="home-search"
            value={q}
            onChange={(e)=>setQ(e.target.value)}
            placeholder="Search poojas — Satyanarayan, Griha Pravesh..."
            className="pl-11 h-12 bg-white border-warmBorder rounded-full"
          />
        </div>
      </div>

      {/* AI CTA */}
      <div className="px-6 mb-6">
        <button
          data-testid="home-ai-cta"
          onClick={() => navigate("/app/ai")}
          className="w-full rounded-lg bg-[#171713] text-white p-5 flex items-center gap-4 shadow-[0_16px_36px_-24px_rgba(0,0,0,.7)] hover:-translate-y-0.5 text-left"
        >
          <div className="w-11 h-11 rounded-full bg-white/20 flex items-center justify-center">
            <Sparkles className="w-5 h-5" />
          </div>
          <div className="flex-1">
            <div className="font-heading text-lg leading-tight">Ask PuroMitra AI</div>
            <div className="text-xs opacity-90 mt-0.5">Not sure which pooja? Get a personal recommendation.</div>
          </div>
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>

      {/* Bento grid of poojas */}
      <section className="px-6">
        <h2 className="font-heading text-xl text-ink mb-3">Popular poojas</h2>
        <div className="grid grid-cols-2 gap-3">
          {filtered.map((p, i) => (
            <Link
              key={p.id}
              to={`/app/priests?pooja=${p.slug}`}
              data-testid={`pooja-card-${p.slug}`}
              className={`bg-white border border-black/10 rounded-lg overflow-hidden shadow-[0_12px_30px_-26px_rgba(0,0,0,.55)] hover:-translate-y-0.5
                ${i % 5 === 0 ? "col-span-2" : ""}`}
            >
              <div className={`${i % 5 === 0 ? "h-40" : "h-28"} overflow-hidden`}>
                <img src={p.image_url} alt={p.name} className="w-full h-full object-cover" />
              </div>
              <div className="p-3">
                <div className="font-heading text-base text-ink leading-tight">{p.name}</div>
                <div className="flex items-center gap-3 text-xs text-muted2 mt-2">
                  <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{p.duration_hours}h</span>
                  <span className="text-saffron font-semibold">₹{p.base_price.toLocaleString("en-IN")}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
        {filtered.length === 0 && (
          <div className="text-center text-muted2 py-12">No poojas match your search.</div>
        )}
      </section>
    </div>
  );
}
