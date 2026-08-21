import { useEffect, useMemo, useState } from "react";
import {
  Activity, BarChart3, Bot, CalendarCheck2, FileSearch, Globe2,
  Search, ShieldCheck, Sparkles, Users,
} from "lucide-react";
import { getSuperAdminMetrics, isSupabaseConfigured, listProgrammaticPages } from "@/lib/supabase";
import { Button } from "@/components/ui/button";

const demoMetrics = Array.from({ length: 14 }, (_, index) => {
  const day = new Date();
  day.setDate(day.getDate() - (13 - index));
  return {
    day: day.toISOString().slice(0, 10),
    active_users: 42 + index * 7 + (index % 3) * 11,
    sessions: 72 + index * 9,
    bookings_created: 3 + (index % 6),
    poojas_completed: 1 + (index % 4),
    priests_joined: index % 5 === 0 ? 2 : index % 4 === 0 ? 1 : 0,
  };
});

const demoPages = [
  {
    id: "demo-1",
    slug: "book-satyanarayan-pooja-bengaluru",
    page_type: "city-pooja",
    title: "Book Satyanarayan Pooja in Bengaluru",
    status: "draft",
    target_keywords: ["satyanarayan pooja bengaluru", "book purohit online"],
  },
  {
    id: "demo-2",
    slug: "griha-pravesh-pooja-cost-guide",
    page_type: "aeo",
    title: "Griha Pravesh Pooja Cost Guide",
    status: "draft",
    target_keywords: ["griha pravesh pooja cost", "housewarming pooja price"],
  },
];

export default function SuperAdminDashboard() {
  const [metrics, setMetrics] = useState(demoMetrics);
  const [pages, setPages] = useState(demoPages);
  const [source, setSource] = useState(isSupabaseConfigured ? "supabase" : "demo");

  useEffect(() => {
    if (!isSupabaseConfigured) return;
    Promise.all([getSuperAdminMetrics(), listProgrammaticPages()])
      .then(([metricRows, pageRows]) => {
        setMetrics(metricRows?.length ? metricRows.slice(-30) : demoMetrics);
        setPages(pageRows?.length ? pageRows : demoPages);
        setSource("supabase");
      })
      .catch(() => setSource("demo-fallback"));
  }, []);

  const totals = useMemo(() => {
    const sum = (key) => metrics.reduce((acc, item) => acc + Number(item[key] || 0), 0);
    const latest = metrics[metrics.length - 1] || {};
    const last7 = metrics.slice(-7);
    const prev7 = metrics.slice(-14, -7);
    const active7 = last7.reduce((acc, item) => acc + Number(item.active_users || 0), 0);
    const prevActive = prev7.reduce((acc, item) => acc + Number(item.active_users || 0), 0) || 1;
    return {
      dau: latest.active_users || 0,
      wau: active7,
      mau: sum("active_users"),
      growth: Math.round(((active7 - prevActive) / prevActive) * 100),
      bookings: sum("bookings_created"),
      completed: sum("poojas_completed"),
      priests: sum("priests_joined"),
      sessions: sum("sessions"),
    };
  }, [metrics]);

  const maxSessions = Math.max(1, ...metrics.map((item) => Number(item.sessions || 0)));

  return (
    <div className="space-y-6">
      <section className="relative overflow-hidden rounded-[2rem] bg-[#111111] text-white p-6 md:p-8">
        <div className="absolute inset-0 opacity-40 bg-white/[0.02]" />
        <div className="relative flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-white/80">
              <ShieldCheck className="w-3.5 h-3.5" />
              Super admin command center
            </div>
            <h1 className="font-heading text-4xl md:text-6xl mt-5 tracking-normal">Growth, trust, and rituals in one console.</h1>
            <p className="text-white/65 max-w-2xl mt-4 text-sm md:text-base">
              Monitor daily, weekly, and monthly usage across mobile and web, verify priests,
              track pooja demand, and manage SEO/AEO/LLM-ready growth pages.
            </p>
          </div>
          <div className="rounded-2xl bg-white/10 border border-white/15 p-4 min-w-56">
            <div className="text-xs uppercase tracking-widest text-white/45">Data source</div>
            <div className="mt-2 font-semibold">{source === "supabase" ? "Supabase live" : "Demo fallback"}</div>
            <div className="text-xs text-white/50 mt-1">
              {isSupabaseConfigured ? "Reads platform metrics view" : "Add Supabase env keys to go live"}
            </div>
          </div>
        </div>
      </section>

      <div className="grid md:grid-cols-4 gap-4">
        <Metric icon={Activity} label="DAU" value={totals.dau} hint="Active today" />
        <Metric icon={Users} label="WAU" value={totals.wau} hint={`${totals.growth >= 0 ? "+" : ""}${totals.growth}% vs prior week`} />
        <Metric icon={BarChart3} label="MAU sample" value={totals.mau} hint={`${totals.sessions} total sessions`} />
        <Metric icon={CalendarCheck2} label="Poojas" value={totals.completed} hint={`${totals.bookings} bookings created`} />
      </div>

      <section className="grid lg:grid-cols-[1.3fr_.7fr] gap-6">
        <div className="rounded-3xl border border-black/10 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="font-heading text-2xl text-ink">Usage by day</h2>
              <p className="text-sm text-muted2">Sessions, active users, bookings, and completed poojas.</p>
            </div>
            <Button className="rounded-full bg-black hover:bg-black/90 text-white">
              <Sparkles className="w-4 h-4 mr-2" />
              Generate insight
            </Button>
          </div>
          <div className="h-72 flex items-end gap-2">
            {metrics.map((item) => (
              <div key={item.day} className="flex-1 min-w-0 flex flex-col justify-end gap-1">
                <div
                  className="rounded-t-xl bg-black"
                  style={{ height: `${Math.max(8, (Number(item.sessions || 0) / maxSessions) * 100)}%` }}
                  title={`${item.day}: ${item.sessions} sessions`}
                />
                <div className="h-1 rounded-full bg-saffron" style={{ opacity: item.bookings_created ? 1 : 0.2 }} />
              </div>
            ))}
          </div>
          <div className="mt-3 flex items-center gap-4 text-xs text-muted2">
            <span className="inline-flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-black" />Sessions</span>
            <span className="inline-flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-saffron" />Bookings</span>
          </div>
        </div>

        <div className="rounded-3xl border border-black/10 bg-white p-6 shadow-sm">
          <h2 className="font-heading text-2xl text-ink">Priest ops</h2>
          <div className="mt-5 space-y-3">
            <OpsRow label="Priests joined" value={totals.priests} icon={Users} />
            <OpsRow label="Reject/verify queue" value="Ready" icon={ShieldCheck} />
            <OpsRow label="Mobile sessions" value="Tracked" icon={Activity} />
          </div>
          <div className="mt-6 rounded-2xl bg-[#f5f0e8] p-4 text-sm text-muted2">
            Super admins should use this area for sensitive approval controls. Never expose service-role keys to the client.
          </div>
        </div>
      </section>

      <section className="rounded-3xl border border-black/10 bg-white p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-5">
          <div>
            <h2 className="font-heading text-2xl text-ink">Programmatic SEO, AEO, and LLMGO</h2>
            <p className="text-sm text-muted2">Create city, festival, pooja, and answer-engine pages from the admin console.</p>
          </div>
          <Button className="rounded-full bg-black hover:bg-black/90 text-white">
            <Globe2 className="w-4 h-4 mr-2" />
            New growth page
          </Button>
        </div>
        <div className="grid md:grid-cols-3 gap-4">
          {pages.map((page) => (
            <div key={page.id} className="rounded-2xl border border-black/10 p-4 bg-[#fbfaf7]">
              <div className="flex items-center justify-between gap-3">
                <span className="text-xs uppercase tracking-widest text-muted2">{page.page_type}</span>
                <span className="text-xs rounded-full bg-black text-white px-2 py-1">{page.status}</span>
              </div>
              <h3 className="font-semibold text-ink mt-3">{page.title}</h3>
              <p className="text-xs text-muted2 mt-2 break-all">/{page.slug}</p>
              <div className="mt-4 flex flex-wrap gap-1">
                {(page.target_keywords || []).slice(0, 3).map((keyword) => (
                  <span key={keyword} className="rounded-full bg-white border border-black/10 px-2 py-1 text-[11px] text-muted2">
                    {keyword}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="grid md:grid-cols-3 gap-4">
        <GrowthCard icon={Search} title="SEO" copy="Publish intent pages for each puja, city, and festival." />
        <GrowthCard icon={Bot} title="AEO" copy="Structure answers for Google AI Overviews and assistant snippets." />
        <GrowthCard icon={FileSearch} title="LLMGO" copy="Keep canonical ritual facts and JSON-LD ready for model retrieval." />
      </section>
    </div>
  );
}

function Metric({ icon: Icon, label, value, hint }) {
  return (
    <div className="rounded-3xl border border-black/10 bg-white p-5 shadow-sm">
      <Icon className="w-4 h-4 text-saffron mb-4" />
      <div className="text-xs uppercase tracking-widest text-muted2">{label}</div>
      <div className="font-heading text-4xl text-ink mt-1">{Number(value || 0).toLocaleString("en-IN")}</div>
      <div className="text-xs text-muted2 mt-1">{hint}</div>
    </div>
  );
}

function OpsRow({ icon: Icon, label, value }) {
  return (
    <div className="flex items-center justify-between rounded-2xl bg-[#fbfaf7] border border-black/10 p-3">
      <div className="flex items-center gap-3">
        <Icon className="w-4 h-4 text-saffron" />
        <span className="text-sm text-ink font-medium">{label}</span>
      </div>
      <span className="text-sm font-semibold">{value}</span>
    </div>
  );
}

function GrowthCard({ icon: Icon, title, copy }) {
  return (
    <div className="rounded-3xl border border-black/10 bg-white p-5 shadow-sm">
      <Icon className="w-5 h-5 text-saffron" />
      <h3 className="font-heading text-xl mt-4 text-ink">{title}</h3>
      <p className="text-sm text-muted2 mt-2">{copy}</p>
    </div>
  );
}
