import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "@/lib/api";
import { Inbox, CheckCircle2, IndianRupee, Star, ShieldCheck, Clock } from "lucide-react";

export default function PriestDashboard() {
  const [priest, setPriest] = useState(null);
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    api.get("/priest/me").then(({ data }) => setPriest(data)).catch(() => {});
    api.get("/bookings/priest").then(({ data }) => setBookings(data)).catch(() => {});
  }, []);

  const pending = bookings.filter(b => b.status === "pending").length;
  const completed = bookings.filter(b => b.status === "completed").length;
  const revenue = bookings.filter(b => b.status === "completed" && b.payment_status === "paid").reduce((s,b) => s + b.price, 0);

  return (
    <div>
      {priest?.verification_status === "pending" && (
        <div className="mb-6 bg-marigold/20 border border-marigold/40 rounded-xl p-4 flex items-center gap-3">
          <Clock className="w-5 h-5 text-saffron-dark shrink-0" />
          <div>
            <div className="font-semibold text-ink">Verification pending</div>
            <div className="text-xs text-muted2">You'll appear to customers once admin verifies your profile.</div>
          </div>
        </div>
      )}
      {priest?.verification_status === "verified" && (
        <div className="mb-6 bg-green-50 border border-green-200 rounded-xl p-4 flex items-center gap-3">
          <ShieldCheck className="w-5 h-5 text-green-700" />
          <div className="font-semibold text-green-800">Verified priest — receiving bookings</div>
        </div>
      )}

      <h1 className="font-heading text-3xl text-ink mb-6">Namaste, {priest?.name || "Purohit-ji"}</h1>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        <Stat icon={Inbox} label="Pending requests" value={pending} testId="stat-pending" />
        <Stat icon={CheckCircle2} label="Completed poojas" value={completed} testId="stat-completed" />
        <Stat icon={IndianRupee} label="Total earned" value={`₹${revenue.toLocaleString("en-IN")}`} testId="stat-revenue" />
        <Stat icon={Star} label="Rating" value={priest?.rating_avg?.toFixed(1) || "—"} testId="stat-rating" />
      </div>

      <div className="bg-white border border-warmBorder rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-heading text-xl text-ink">Recent bookings</h2>
          <Link to="/priest/bookings" className="text-sm text-saffron hover:underline">See all</Link>
        </div>
        <div className="space-y-2">
          {bookings.slice(0, 5).map(b => (
            <div key={b.id} data-testid={`recent-booking-${b.id}`} className="flex items-center justify-between p-3 bg-cotton rounded-lg">
              <div>
                <div className="font-semibold text-ink text-sm">{b.pooja_name}</div>
                <div className="text-xs text-muted2">{b.customer_name} · {b.booking_date} {b.booking_time}</div>
              </div>
              <span className="text-xs font-semibold text-saffron uppercase">{b.status}</span>
            </div>
          ))}
          {bookings.length === 0 && (<div className="text-sm text-muted2 text-center py-6">No bookings yet.</div>)}
        </div>
      </div>
    </div>
  );
}

function Stat({ icon: Icon, label, value, testId }) {
  return (
    <div data-testid={testId} className="bg-white border border-warmBorder rounded-xl p-4">
      <Icon className="w-4 h-4 text-saffron mb-2" />
      <div className="text-xs uppercase tracking-widest text-muted2">{label}</div>
      <div className="font-heading text-2xl text-ink mt-1">{value}</div>
    </div>
  );
}
