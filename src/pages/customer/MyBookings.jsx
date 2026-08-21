import { useEffect, useState } from "react";
import { toast } from "sonner";
import api, { API, tokenStore } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Star, Calendar as CalIcon, MapPin, CheckCircle2, Clock, XCircle,
  FileDown, RefreshCcw, AlertTriangle, MessageCircleWarning } from "lucide-react";

const STATUS_STYLES = {
  pending: "bg-marigold/20 text-saffron-dark",
  confirmed: "bg-saffron/15 text-saffron",
  completed: "bg-green-100 text-green-700",
  rejected: "bg-red-100 text-red-700",
  cancelled: "bg-muted text-muted2",
  refunded: "bg-blue-100 text-blue-700",
};

const TIME_SLOTS = ["06:00", "07:30", "09:00", "10:30", "16:00", "17:30", "19:00"];

const DISPUTE_CATEGORIES = [
  { id: "no_show", label: "Priest didn't show up · ಪುರೋಹಿತರು ಬರಲಿಲ್ಲ" },
  { id: "late_arrival", label: "Late arrival · ತಡ" },
  { id: "incomplete_pooja", label: "Incomplete pooja · ಅಪೂರ್ಣ ಪೂಜೆ" },
  { id: "payment_issue", label: "Payment issue · ಪಾವತಿ ಸಮಸ್ಯೆ" },
  { id: "other", label: "Other · ಇನ್ನಿತರ" },
];

export default function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [reviewBooking, setReviewBooking] = useState(null);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

  // Cancel dialog
  const [cancelTarget, setCancelTarget] = useState(null);
  const [cancelPolicy, setCancelPolicy] = useState(null);
  const [cancelReason, setCancelReason] = useState("");

  // Reschedule dialog
  const [rescheduleTarget, setRescheduleTarget] = useState(null);
  const [reschedulePolicy, setReschedulePolicy] = useState(null);
  const [newDate, setNewDate] = useState();
  const [newTime, setNewTime] = useState("");

  // Dispute dialog
  const [disputeTarget, setDisputeTarget] = useState(null);
  const [disputeCategory, setDisputeCategory] = useState("no_show");
  const [disputeDesc, setDisputeDesc] = useState("");

  const load = () => {
    api.get("/bookings/customer").then(({ data }) => setBookings(data)).catch(() => {});
  };
  useEffect(() => { load(); }, []);

  const submitReview = async () => {
    try {
      await api.post("/reviews", { booking_id: reviewBooking.id, rating, comment });
      toast.success("Review submitted");
      setReviewBooking(null); setComment(""); setRating(5); load();
    } catch (e) {
      toast.error(e?.response?.data?.detail || "Failed to submit");
    }
  };

  const openCancel = async (b) => {
    setCancelTarget(b);
    setCancelReason("");
    try {
      const { data } = await api.get(`/bookings/${b.id}/policy-preview`);
      setCancelPolicy(data);
    } catch { setCancelPolicy(null); }
  };

  const confirmCancel = async () => {
    try {
      await api.post(`/bookings/${cancelTarget.id}/action`, {
        action: "cancel", reason: cancelReason,
      });
      toast.success("Booking cancelled");
      setCancelTarget(null); setCancelPolicy(null); load();
    } catch (e) {
      toast.error(e?.response?.data?.detail || "Cancel failed");
    }
  };

  const openReschedule = async (b) => {
    setRescheduleTarget(b);
    setNewDate(); setNewTime("");
    try {
      const { data } = await api.get(`/bookings/${b.id}/policy-preview`);
      setReschedulePolicy(data);
    } catch { setReschedulePolicy(null); }
  };

  const confirmReschedule = async () => {
    if (!newDate || !newTime) return toast.error("Select new date and time");
    try {
      await api.post(`/bookings/${rescheduleTarget.id}/reschedule`, {
        booking_date: newDate.toISOString().slice(0,10),
        booking_time: newTime,
      });
      toast.success("Booking rescheduled");
      setRescheduleTarget(null); setReschedulePolicy(null); load();
    } catch (e) {
      toast.error(e?.response?.data?.detail || "Reschedule failed");
    }
  };

  const downloadInvoice = (b) => {
    const token = tokenStore.access;
    if (!token) return toast.error("Please login again");
    // Open in new tab so browser handles the PDF download
    window.open(`${API}/bookings/${b.id}/invoice?auth=${encodeURIComponent(token)}`, "_blank");
  };

  const submitDispute = async () => {
    if (!disputeDesc.trim()) return toast.error("Please describe the issue");
    try {
      await api.post("/disputes", {
        booking_id: disputeTarget.id,
        category: disputeCategory,
        description: disputeDesc,
      });
      toast.success("Dispute raised — our team will review it");
      setDisputeTarget(null); setDisputeDesc(""); setDisputeCategory("no_show");
    } catch (e) {
      toast.error(e?.response?.data?.detail || "Failed to raise dispute");
    }
  };

  return (
    <div className="pb-6">
      <header className="px-6 pt-6 pb-4">
        <h1 className="font-heading text-3xl text-ink">My Bookings</h1>
        <p className="text-sm text-muted2 mt-1">{bookings.length} total</p>
      </header>

      <div className="px-6 space-y-3">
        {bookings.length === 0 && (
          <div className="bg-white border border-warmBorder rounded-xl p-8 text-center text-muted2" data-testid="no-bookings">
            No bookings yet. Explore poojas from the home tab.
          </div>
        )}
        {bookings.map(b => {
          const total = b.total_amount || b.price;
          const canReschedule = ["pending", "confirmed"].includes(b.status);
          const canCancel = ["pending", "confirmed"].includes(b.status);
          return (
            <div key={b.id} data-testid={`booking-${b.id}`} className="bg-white border border-warmBorder rounded-xl p-4 warm-shadow">
              <div className="flex items-start justify-between">
                <div>
                  <div className="font-heading text-lg text-ink">{b.pooja_name}</div>
                  <div className="text-sm text-muted2">with {b.priest_name}</div>
                </div>
                <span className={`text-xs font-semibold px-2 py-1 rounded-full ${STATUS_STYLES[b.payment_status === "refunded" ? "refunded" : b.status] || "bg-muted"}`}>
                  {b.payment_status === "refunded" ? "refunded" : b.status}
                </span>
              </div>
              <div className="mt-3 space-y-1 text-sm text-muted2">
                <div className="flex items-center gap-2"><CalIcon className="w-3.5 h-3.5" />{b.booking_date} · {b.booking_time}</div>
                <div className="flex items-center gap-2"><MapPin className="w-3.5 h-3.5" />{b.address.slice(0, 60)}{b.address.length > 60 && "…"}</div>
                {(b.add_ons || []).length > 0 && (
                  <div className="text-xs text-muted2">+ {(b.add_ons || []).map(a => `${a.name.split("·")[1]?.trim() || a.name} × ${a.qty}`).join(", ")}</div>
                )}
                {b.reschedule_count > 0 && (
                  <div className="text-xs text-blue-700 flex items-center gap-1"><RefreshCcw className="w-3 h-3" />Rescheduled {b.reschedule_count}×</div>
                )}
              </div>
              <div className="mt-3 flex items-center justify-between">
                <div className="text-saffron font-semibold">₹{total.toLocaleString("en-IN")}</div>
                <div className="text-xs text-muted2">
                  {b.payment_status === "paid" && <span className="text-green-700 flex items-center gap-1"><CheckCircle2 className="w-3 h-3" />Paid</span>}
                  {b.payment_status === "refunded" && <span className="text-blue-700">Refunded ₹{(b.refund_amount || 0).toLocaleString("en-IN")}</span>}
                  {b.payment_status === "pending" && "Pending"}
                </div>
              </div>

              {/* Action row */}
              <div className="mt-3 pt-3 border-t border-warmBorder flex flex-wrap gap-2">
                {b.status === "completed" && (
                  <Button size="sm" data-testid={`review-btn-${b.id}`} onClick={()=>setReviewBooking(b)}
                    className="rounded-full bg-marigold hover:bg-marigold/80 text-ink font-semibold h-9">
                    <Star className="w-3 h-3 mr-1 fill-ink" /> Review
                  </Button>
                )}
                {b.payment_status === "paid" && (
                  <Button size="sm" variant="outline" data-testid={`invoice-btn-${b.id}`} onClick={()=>downloadInvoice(b)}
                    className="rounded-full h-9 border-warmBorder">
                    <FileDown className="w-3 h-3 mr-1" /> Invoice
                  </Button>
                )}
                {canReschedule && (
                  <Button size="sm" variant="outline" data-testid={`reschedule-btn-${b.id}`} onClick={()=>openReschedule(b)}
                    className="rounded-full h-9 border-warmBorder">
                    <RefreshCcw className="w-3 h-3 mr-1" /> Reschedule
                  </Button>
                )}
                {canCancel && (
                  <Button size="sm" variant="outline" data-testid={`cancel-btn-${b.id}`} onClick={()=>openCancel(b)}
                    className="rounded-full h-9 border-red-200 text-red-700 hover:bg-red-50">
                    <XCircle className="w-3 h-3 mr-1" /> Cancel
                  </Button>
                )}
                {["completed", "cancelled"].includes(b.status) && (
                  <Button size="sm" variant="outline" data-testid={`dispute-btn-${b.id}`} onClick={()=>setDisputeTarget(b)}
                    className="rounded-full h-9 border-warmBorder">
                    <MessageCircleWarning className="w-3 h-3 mr-1" /> Raise dispute
                  </Button>
                )}
              </div>

              {b.status === "rejected" && b.reject_reason && (
                <div className="mt-2 text-xs text-red-700 flex items-center gap-1"><XCircle className="w-3 h-3" />Reason: {b.reject_reason}</div>
              )}
              {b.status === "pending" && (
                <div className="mt-2 text-xs text-muted2 flex items-center gap-1"><Clock className="w-3 h-3" />Waiting for priest confirmation</div>
              )}
            </div>
          );
        })}
      </div>

      {/* Review dialog */}
      <Dialog open={!!reviewBooking} onOpenChange={(o)=>!o && setReviewBooking(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>Review your experience</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div className="flex items-center gap-2 justify-center">
              {[1,2,3,4,5].map(n => (
                <button key={n} data-testid={`review-star-${n}`} onClick={()=>setRating(n)}>
                  <Star className={`w-8 h-8 transition-colors ${n <= rating ? "fill-marigold text-marigold" : "text-warmBorder"}`} />
                </button>
              ))}
            </div>
            <Textarea data-testid="review-comment" value={comment} onChange={(e)=>setComment(e.target.value)}
              placeholder="Share your experience — was the priest punctual, knowledgeable, warm?" />
            <Button data-testid="review-submit" onClick={submitReview}
              className="w-full rounded-full bg-saffron hover:bg-saffron-dark text-white font-semibold">Submit review</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Cancel dialog */}
      <Dialog open={!!cancelTarget} onOpenChange={(o)=>!o && (setCancelTarget(null), setCancelPolicy(null))}>
        <DialogContent>
          <DialogHeader><DialogTitle>Cancel booking</DialogTitle></DialogHeader>
          <div className="space-y-3">
            {cancelPolicy && (
              <div className={`rounded-xl p-3 text-sm ${cancelPolicy.refund_percent === 100 ? "bg-green-50 text-green-800" : cancelPolicy.refund_percent === 50 ? "bg-marigold/20 text-saffron-dark" : "bg-red-50 text-red-800"}`}>
                <div className="flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0" />
                  <div>
                    <div className="font-semibold" data-testid="cancel-refund-percent">Refund: {cancelPolicy.refund_percent}%
                      {cancelTarget?.payment_status === "paid" && <span className="ml-1">(₹{cancelPolicy.refund_amount.toLocaleString("en-IN")})</span>}
                    </div>
                    <div className="text-xs mt-1">Slot is {cancelPolicy.hours_until_slot > 0 ? `${Math.round(cancelPolicy.hours_until_slot)}h away` : "in the past"}. Policy: &gt;48h = 100%, 24-48h = 50%, &lt;24h = 0%.</div>
                  </div>
                </div>
              </div>
            )}
            <div>
              <Label>Reason (optional)</Label>
              <Textarea data-testid="cancel-reason" value={cancelReason} onChange={(e)=>setCancelReason(e.target.value)}
                placeholder="Priest fell ill, schedule change, ..." className="mt-1" />
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={()=>{ setCancelTarget(null); setCancelPolicy(null); }}
                className="flex-1 rounded-full">Keep booking</Button>
              <Button data-testid="confirm-cancel-btn" onClick={confirmCancel}
                className="flex-1 rounded-full bg-red-600 hover:bg-red-700 text-white">Confirm cancel</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Reschedule dialog */}
      <Dialog open={!!rescheduleTarget} onOpenChange={(o)=>!o && (setRescheduleTarget(null), setReschedulePolicy(null))}>
        <DialogContent>
          <DialogHeader><DialogTitle>Reschedule booking</DialogTitle></DialogHeader>
          <div className="space-y-3">
            {reschedulePolicy && (
              <div className={`rounded-xl p-3 text-sm ${reschedulePolicy.reschedule_allowed ? "bg-saffron/10 text-saffron-dark" : "bg-red-50 text-red-800"}`}>
                <div className="text-xs" data-testid="reschedule-status">
                  {reschedulePolicy.reschedule_allowed
                    ? `You've used ${reschedulePolicy.reschedule_used}/${reschedulePolicy.reschedule_max} free reschedules.`
                    : reschedulePolicy.reschedule_reason}
                </div>
              </div>
            )}
            <div>
              <Label>New date</Label>
              <div className="bg-white border border-warmBorder rounded-xl mt-1 p-2 inline-block">
                <Calendar mode="single" selected={newDate} onSelect={setNewDate}
                  disabled={(d) => { const t=new Date(); t.setHours(0,0,0,0); return d < t; }} />
              </div>
            </div>
            <div>
              <Label>New time slot</Label>
              <Select value={newTime} onValueChange={setNewTime}>
                <SelectTrigger data-testid="reschedule-time" className="mt-1"><SelectValue placeholder="Choose time" /></SelectTrigger>
                <SelectContent>{TIME_SLOTS.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <Button data-testid="confirm-reschedule-btn" onClick={confirmReschedule}
              disabled={!reschedulePolicy?.reschedule_allowed}
              className="w-full rounded-full bg-saffron hover:bg-saffron-dark text-white">
              Confirm reschedule
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Dispute dialog */}
      <Dialog open={!!disputeTarget} onOpenChange={(o)=>!o && setDisputeTarget(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>Raise a dispute</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <div>
              <Label>Category</Label>
              <Select value={disputeCategory} onValueChange={setDisputeCategory}>
                <SelectTrigger data-testid="dispute-category" className="mt-1"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {DISPUTE_CATEGORIES.map(c => <SelectItem key={c.id} value={c.id}>{c.label}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Describe what happened</Label>
              <Textarea data-testid="dispute-description" value={disputeDesc} onChange={(e)=>setDisputeDesc(e.target.value)}
                placeholder="Details help us resolve quickly..." className="mt-1 min-h-[100px]" />
            </div>
            <Button data-testid="submit-dispute-btn" onClick={submitDispute}
              className="w-full rounded-full bg-saffron hover:bg-saffron-dark text-white">Submit dispute</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
