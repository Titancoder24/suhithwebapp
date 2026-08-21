import { useEffect, useState } from "react";
import { toast } from "sonner";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Calendar, MapPin, Phone, Check, X, CheckCircle2 } from "lucide-react";

export default function PriestBookings() {
  const [bookings, setBookings] = useState([]);
  const [rejecting, setRejecting] = useState(null);
  const [reason, setReason] = useState("");

  const load = () => api.get("/bookings/priest").then(({ data }) => setBookings(data)).catch(() => {});
  useEffect(() => {
    // Keep the async request inside the effect; returning its Promise makes React
    // treat it as an effect cleanup function during StrictMode unmounts.
    load();
  }, []);

  const act = async (id, action, r = "") => {
    try {
      await api.post(`/bookings/${id}/action`, { action, reason: r });
      toast.success(action === "accept" ? "Accepted" : action === "reject" ? "Rejected" : "Marked complete");
      load();
      setRejecting(null); setReason("");
    } catch (e) {
      toast.error(e?.response?.data?.detail || "Action failed");
    }
  };

  const groups = {
    pending: bookings.filter(b => b.status === "pending"),
    confirmed: bookings.filter(b => b.status === "confirmed"),
    other: bookings.filter(b => !["pending","confirmed"].includes(b.status)),
  };

  return (
    <div>
      <h1 className="font-heading text-3xl text-ink mb-6">Bookings</h1>

      {["pending","confirmed","other"].map(g => (
        <section key={g} className="mb-6">
          <h2 className="font-heading text-xl text-ink mb-3 capitalize">{g === "other" ? "Past bookings" : g}</h2>
          <div className="space-y-3">
            {groups[g].length === 0 && <div className="text-sm text-muted2">No {g === "other" ? "past" : g} bookings.</div>}
            {groups[g].map(b => (
              <div key={b.id} data-testid={`priest-booking-${b.id}`} className="bg-white border border-warmBorder rounded-xl p-5">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="font-heading text-lg text-ink">{b.pooja_name}</div>
                    <div className="text-sm text-muted2">for {b.customer_name}</div>
                  </div>
                  <div className="text-saffron font-semibold text-lg">₹{b.price.toLocaleString("en-IN")}</div>
                </div>
                <div className="grid sm:grid-cols-2 gap-2 text-sm text-muted2 mb-4">
                  <div className="flex items-center gap-2"><Calendar className="w-3.5 h-3.5" />{b.booking_date} at {b.booking_time}</div>
                  <div className="flex items-center gap-2"><Phone className="w-3.5 h-3.5" />+91 {b.customer_phone}</div>
                  <div className="flex items-start gap-2 sm:col-span-2"><MapPin className="w-3.5 h-3.5 mt-0.5 shrink-0" /><span>{b.address}{b.landmark && `, near ${b.landmark}`}</span></div>
                </div>
                {b.notes && <div className="bg-cotton rounded-lg p-3 text-sm text-ink mb-3">Notes: {b.notes}</div>}
                {g === "pending" && (
                  <div className="flex gap-2">
                    <Button data-testid={`priest-accept-${b.id}`} onClick={()=>act(b.id, "accept")}
                      className="flex-1 h-11 rounded-full bg-saffron hover:bg-saffron-dark text-white font-semibold">
                      <Check className="w-4 h-4 mr-2" />Accept
                    </Button>
                    <Button data-testid={`priest-reject-${b.id}`} variant="outline" onClick={()=>setRejecting(b)}
                      className="flex-1 h-11 rounded-full border-red-300 text-red-700 hover:bg-red-50 font-semibold">
                      <X className="w-4 h-4 mr-2" />Decline
                    </Button>
                  </div>
                )}
                {g === "confirmed" && (
                  <Button data-testid={`priest-complete-${b.id}`} onClick={()=>act(b.id, "complete")}
                    className="w-full h-11 rounded-full bg-green-700 hover:bg-green-800 text-white font-semibold">
                    <CheckCircle2 className="w-4 h-4 mr-2" /> Mark completed
                  </Button>
                )}
                {g === "other" && (
                  <div className="text-xs uppercase tracking-widest text-muted2 pt-2 border-t border-warmBorder">
                    Status: <span className="text-ink font-semibold">{b.status}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      ))}

      <Dialog open={!!rejecting} onOpenChange={(o)=>!o && setRejecting(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>Decline booking</DialogTitle></DialogHeader>
          <Textarea data-testid="reject-reason" value={reason} onChange={(e)=>setReason(e.target.value)}
            placeholder="Reason (e.g., unavailable, distance too far)…" />
          <Button data-testid="reject-confirm" onClick={()=>act(rejecting.id, "reject", reason)}
            className="w-full rounded-full bg-red-700 hover:bg-red-800 text-white">
            Confirm decline
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
}
