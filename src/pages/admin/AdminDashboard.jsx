import { useEffect, useMemo, useState } from "react";
import api, { API, tokenStore } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  CalendarCheck2, CheckCircle2, IndianRupee, Users, UserCheck, Clock,
  TrendingUp, ShieldAlert, Download, Percent,
} from "lucide-react";

export default function AdminDashboard() {
  const [days, setDays] = useState("30");
  const [data, setData] = useState(null);

  const load = () => {
    api.get(`/admin/analytics?days=${days}`).then(({ data }) => setData(data)).catch(() => {});
  };
  useEffect(() => { load(); }, [days]);

  const kpi = data?.kpi;
  const series = useMemo(() => data?.revenue_series || [], [data?.revenue_series]);
  const maxNet = useMemo(() => Math.max(1, ...series.map(s => s.net)), [series]);

  const downloadCsv = (kind) => {
    const token = tokenStore.access;
    if (!token) return;
    window.open(`${API}/admin/export/${kind}.csv?auth=${encodeURIComponent(token)}`, "_blank");
  };

  return (
    <div>
      <div className="mb-6 flex items-end justify-between gap-4">
        <div>
          <div className="text-xs font-semibold uppercase tracking-wider text-[#f4511e]">Operations overview</div>
          <h1 className="text-3xl font-semibold tracking-tight text-ink mt-1">Analytics</h1>
          <p className="text-sm text-muted2 mt-1">Bookings, revenue, and marketplace health for the last {days} days</p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={days} onValueChange={setDays}>
            <SelectTrigger data-testid="analytics-range" className="w-32"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="7">Last 7 days</SelectItem>
              <SelectItem value="30">Last 30 days</SelectItem>
              <SelectItem value="90">Last 90 days</SelectItem>
              <SelectItem value="365">Last 365 days</SelectItem>
            </SelectContent>
          </Select>
          <Button data-testid="export-bookings-btn" onClick={() => downloadCsv("bookings")}
            variant="outline" className="rounded-full border-warmBorder"><Download className="w-3 h-3 mr-1" />Bookings CSV</Button>
          <Button data-testid="export-disputes-btn" onClick={() => downloadCsv("disputes")}
            variant="outline" className="rounded-full border-warmBorder"><Download className="w-3 h-3 mr-1" />Disputes CSV</Button>
          <Button data-testid="export-priests-btn" onClick={() => downloadCsv("priests")}
            variant="outline" className="rounded-full border-warmBorder"><Download className="w-3 h-3 mr-1" />Priests CSV</Button>
        </div>
      </div>

      {kpi && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <Stat icon={CalendarCheck2} label="Total bookings" value={kpi.total_bookings} testId="stat-total-bookings" />
          <Stat icon={IndianRupee} label="Revenue" value={`₹${kpi.total_revenue.toLocaleString("en-IN")}`} testId="stat-revenue" />
          <Stat icon={Percent} label="Conversion" value={`${kpi.conversion_rate_pct}%`} testId="stat-conversion" />
          <Stat icon={TrendingUp} label="Avg order" value={`₹${kpi.avg_order_value.toLocaleString("en-IN")}`} testId="stat-aov" />
          <Stat icon={CheckCircle2} label="Completed" value={kpi.completed} testId="stat-completed" />
          <Stat icon={Clock} label="Cancelled" value={kpi.cancelled} testId="stat-cancelled" />
          <Stat icon={UserCheck} label="Verified priests" value={`${kpi.verified_priests}/${kpi.total_priests}`} testId="stat-verified" />
          <Stat icon={Users} label="Customers" value={kpi.total_users} testId="stat-customers" />
        </div>
      )}

      {/* Revenue mini-chart (pure CSS, no chart library dep) */}
      <div className="bg-white border-y border-warmBorder py-7 mb-8" data-testid="revenue-chart">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-ink">Net revenue trend</h2>
          <span className="text-xs text-muted2">₹ per day (paid − refunds)</span>
        </div>
        {series.length === 0 ? (
          <div className="text-muted2 text-sm text-center py-8">No revenue yet in this window.</div>
        ) : (
          <div className="flex items-end gap-1 h-40">
            {series.slice(-30).map(s => (
              <div key={s.date} className="flex-1 flex flex-col items-center gap-1" title={`${s.date}: ₹${s.net}`}>
                <div className="flex-1 flex items-end w-full">
                  <div
                    className="w-full bg-[#f4511e] rounded-t-sm"
                    style={{ height: `${Math.max(4, (s.net / maxNet) * 100)}%` }}
                  />
                </div>
                <div className="text-[9px] text-muted2 rotate-45 origin-top-left mt-1">{s.date.slice(5)}</div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-6">
        <ListCard title="Top poojas" testId="top-poojas"
          rows={(data?.top_poojas || []).map(p => ({ label: p.name, sub: `${p.bookings} bookings`, right: `₹${p.revenue.toLocaleString("en-IN")}` }))} />
        <ListCard title="Top priests" testId="top-priests"
          rows={(data?.top_priests || []).map(p => ({ label: p.name, sub: `${p.bookings} bookings`, right: `₹${p.revenue.toLocaleString("en-IN")}` }))} />
      </div>

      {data?.disputes && (
        <div className="bg-white border-t border-warmBorder py-6" data-testid="disputes-summary">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-heading text-xl text-ink flex items-center gap-2"><ShieldAlert className="w-5 h-5 text-saffron" />Disputes</h2>
            <div className="text-xs text-muted2">Open: {data.disputes.open} · In review: {data.disputes.in_review} · Resolved: {data.disputes.resolved}</div>
          </div>
          <div className="flex flex-wrap gap-2">
            {Object.entries(data.disputes.by_category || {}).map(([cat, count]) => (
              <span key={cat} className="text-xs bg-cotton px-3 py-1 rounded-full border border-warmBorder">
                {cat.replace(/_/g, " ")}: <b>{count}</b>
              </span>
            ))}
            {Object.keys(data.disputes.by_category || {}).length === 0 && <span className="text-xs text-muted2">No disputes.</span>}
          </div>
        </div>
      )}
    </div>
  );
}

function Stat({ icon: Icon, label, value, testId, highlight }) {
  return (
    <div data-testid={testId} className={`p-5 border-t border-warmBorder ${highlight ? "bg-[#fff7f3]" : "bg-white"}`}>
      <Icon className={`w-4 h-4 mb-2 ${highlight ? "text-saffron-dark" : "text-saffron"}`} />
      <div className="text-xs text-muted2">{label}</div>
      <div className="text-2xl font-semibold tracking-tight text-ink mt-1">{value}</div>
    </div>
  );
}

function ListCard({ title, rows, testId }) {
  return (
    <div className="bg-white border-t border-warmBorder py-6" data-testid={testId}>
      <h3 className="text-base font-semibold text-ink mb-3">{title}</h3>
      {rows.length === 0 && <div className="text-sm text-muted2">No data yet.</div>}
      <div className="space-y-2">
        {rows.map((r, i) => (
          <div key={i} className="flex items-center justify-between py-3 border-b border-[#efefec]">
            <div>
              <div className="font-semibold text-ink text-sm">{r.label}</div>
              <div className="text-xs text-muted2">{r.sub}</div>
            </div>
            <div className="text-saffron font-semibold text-sm">{r.right}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
