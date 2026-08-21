import { useEffect, useState } from "react";
import { toast } from "sonner";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { AlertTriangle, CheckCircle2, XCircle } from "lucide-react";

const CATEGORY_LABELS = {
  no_show: "No-show",
  late_arrival: "Late arrival",
  incomplete_pooja: "Incomplete pooja",
  payment_issue: "Payment issue",
  other: "Other",
};

const STATUS_STYLES = {
  open: "bg-marigold/20 text-saffron-dark",
  in_review: "bg-blue-100 text-blue-700",
  resolved: "bg-green-100 text-green-700",
  rejected: "bg-muted text-muted2",
};

export default function AdminDisputes() {
  const [statusFilter, setStatusFilter] = useState("");
  const [disputes, setDisputes] = useState([]);
  const [selected, setSelected] = useState(null);
  const [resolveStatus, setResolveStatus] = useState("resolved");
  const [resolveNote, setResolveNote] = useState("");
  const [refundAmount, setRefundAmount] = useState(0);

  const load = () => {
    const q = statusFilter ? `?status=${statusFilter}` : "";
    api.get(`/admin/disputes${q}`).then(({ data }) => setDisputes(data)).catch(() => {});
  };
  useEffect(() => { load(); }, [statusFilter]);

  const openDispute = async (d) => {
    try {
      const { data } = await api.get(`/admin/disputes/${d.id}`);
      setSelected(data);
      setResolveStatus("resolved");
      setResolveNote("");
      setRefundAmount(0);
    } catch (e) {
      toast.error("Failed to load dispute");
    }
  };

  const resolveDispute = async () => {
    try {
      await api.post(`/admin/disputes/${selected.id}/resolve`, {
        status: resolveStatus,
        resolution_note: resolveNote,
        refund_amount: Number(refundAmount) || 0,
      });
      toast.success("Dispute updated");
      setSelected(null); load();
    } catch (e) {
      toast.error(e?.response?.data?.detail || "Failed");
    }
  };

  return (
    <div>
      <div className="mb-6 flex items-end justify-between">
        <div>
          <h1 className="font-heading text-4xl text-ink">Disputes</h1>
          <p className="text-sm text-muted2 mt-1">{disputes.length} shown · resolve customer & priest issues</p>
        </div>
        <Select value={statusFilter || "all"} onValueChange={(v)=>setStatusFilter(v === "all" ? "" : v)}>
          <SelectTrigger data-testid="dispute-filter" className="w-48"><SelectValue placeholder="All statuses" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            <SelectItem value="open">Open</SelectItem>
            <SelectItem value="in_review">In review</SelectItem>
            <SelectItem value="resolved">Resolved</SelectItem>
            <SelectItem value="rejected">Rejected</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="bg-white border border-warmBorder rounded-xl overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Raised</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Booking</TableHead>
              <TableHead>By</TableHead>
              <TableHead>Status</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {disputes.length === 0 && (
              <TableRow><TableCell colSpan={6} className="text-center text-muted2 py-8" data-testid="no-disputes">No disputes.</TableCell></TableRow>
            )}
            {disputes.map(d => (
              <TableRow key={d.id} data-testid={`dispute-row-${d.id}`}>
                <TableCell className="text-xs text-muted2">{d.created_at?.slice(0,10)}</TableCell>
                <TableCell className="text-sm">
                  <div className="flex items-center gap-1"><AlertTriangle className="w-3 h-3 text-saffron" />{CATEGORY_LABELS[d.category] || d.category}</div>
                </TableCell>
                <TableCell className="text-sm">
                  <div className="font-semibold text-ink">{d.pooja_name}</div>
                  <div className="text-xs text-muted2">{d.booking_date} · {d.priest_name}</div>
                </TableCell>
                <TableCell className="text-sm">
                  <div>{d.raised_by_name}</div>
                  <div className="text-xs text-muted2 capitalize">{d.raised_by_role}</div>
                </TableCell>
                <TableCell>
                  <span className={`text-xs font-semibold px-2 py-1 rounded-full ${STATUS_STYLES[d.status]}`}>{d.status}</span>
                </TableCell>
                <TableCell>
                  <Button data-testid={`open-dispute-${d.id}`} size="sm" variant="outline" onClick={()=>openDispute(d)}
                    className="rounded-full h-8">Review</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={!!selected} onOpenChange={(o)=>!o && setSelected(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Dispute {selected?.id?.slice(0,8)}</DialogTitle>
            <DialogDescription>Review the customer/priest issue and post a resolution.</DialogDescription>
          </DialogHeader>
          {selected && (
            <div className="space-y-4">
              <div className="bg-cotton rounded-xl p-3 text-sm">
                <div><b>{CATEGORY_LABELS[selected.category]}</b> — raised by {selected.raised_by_name} ({selected.raised_by_role})</div>
                <div className="text-muted2 mt-1">{selected.description || <span className="italic">No description provided</span>}</div>
              </div>
              {selected.booking && (
                <div className="bg-white border border-warmBorder rounded-xl p-3 text-sm">
                  <div className="font-semibold text-ink">{selected.booking.pooja_name}</div>
                  <div className="text-muted2 text-xs mt-1">
                    {selected.booking.customer_name} · {selected.booking.priest_name} · {selected.booking.booking_date} {selected.booking.booking_time}
                  </div>
                  <div className="text-muted2 text-xs mt-1">Address: {selected.booking.address}</div>
                  <div className="mt-2 flex items-center justify-between">
                    <span className="text-saffron font-semibold">₹{(selected.booking.total_amount || selected.booking.price || 0).toLocaleString("en-IN")}</span>
                    <span className="text-xs">Payment: <b className="capitalize">{selected.booking.payment_status}</b></span>
                  </div>
                </div>
              )}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>Resolution</Label>
                  <Select value={resolveStatus} onValueChange={setResolveStatus}>
                    <SelectTrigger data-testid="resolve-status" className="mt-1"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="in_review">Move to In-review</SelectItem>
                      <SelectItem value="resolved">Resolve (in favour)</SelectItem>
                      <SelectItem value="rejected">Reject</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Refund amount (₹)</Label>
                  <Input data-testid="resolve-refund" type="number" min="0" value={refundAmount}
                    onChange={(e)=>setRefundAmount(e.target.value)} className="mt-1 h-10" />
                </div>
              </div>
              <div>
                <Label>Resolution note (visible to team)</Label>
                <Textarea data-testid="resolve-note" value={resolveNote} onChange={(e)=>setResolveNote(e.target.value)}
                  placeholder="How was this resolved?" className="mt-1 min-h-[80px]" />
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={()=>setSelected(null)} className="flex-1 rounded-full">Close</Button>
                <Button data-testid="resolve-dispute-btn" onClick={resolveDispute}
                  className="flex-1 rounded-full bg-saffron hover:bg-saffron-dark text-white">
                  {resolveStatus === "resolved" ? <><CheckCircle2 className="w-4 h-4 mr-1" />Save</> :
                   resolveStatus === "rejected" ? <><XCircle className="w-4 h-4 mr-1" />Save</> :
                   "Save"}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
